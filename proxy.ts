import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import crypto from "crypto"
import { verifyAccessToken } from "@/lib/jwt"
import { prisma } from "@/lib/db"

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  response.headers.set("X-DNS-Prefetch-Control", "off")
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "no-referrer")
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none")

  // Strict CSP using a per-request nonce + 'strict-dynamic'. Next.js reads the
  // nonce from the CSP header and applies it to its own inline scripts/styles
  // automatically. 'unsafe-eval' is only needed in dev (React debug eval).
  const isDev = process.env.NODE_ENV !== "production"
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}; style-src 'self' 'nonce-${nonce}'; img-src 'self' data: https: blob:; font-src 'self' data:; audio-src 'self' https:; connect-src 'self'; frame-ancestors 'none'`
  )
  response.headers.set("x-nonce", nonce)

  // Permissions Policy - Deny dangerous features
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
  )

  // Additional security headers
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp")
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin")

  // ---- Server-side route protection ----
  // Enforce authentication/authorization for privileged area before the page renders,
  // so access is not left to client-side checks alone.
  const { pathname } = request.nextUrl

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/")
  const isVolunteerPath = pathname === "/volunteer" || pathname.startsWith("/volunteer/")

  if (isAdminPath || isVolunteerPath) {
    const token = request.cookies.get("auth_token")?.value
    const payload = token ? verifyAccessToken(token) : null

    // Re-validate against the database: reject stale/revoked sessions (tokenVersion
    // bumped on password change) and reflect the user's CURRENT role, so a demoted
    // or deleted account loses privileged page access immediately rather than for
    // the remainder of the (up to 8h) token lifetime.
    let currentRole: string | null = null
    if (payload && prisma) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
          select: { role: true, tokenVersion: true },
        })
        if (user && user.tokenVersion === payload.tokenVersion) {
          currentRole = user.role
        }
      } catch {
        // DB unavailable — deny privileged access rather than granting by default.
        currentRole = null
      }
    }

    const isAdmin = currentRole === "admin"
    const isStaff = currentRole === "admin" || currentRole === "volunteer"

    if ((isAdminPath && !isAdmin) || (isVolunteerPath && !isStaff)) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.search = ""
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).)*)",
  ],
}