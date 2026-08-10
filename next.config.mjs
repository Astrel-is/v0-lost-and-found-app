/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
]

const nextConfig = {
  typescript: {
    // Production should fail fast on type errors.
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
<<<<<<< HEAD
=======
  async headers() {
    return [
      // Apply the same hardening to API routes (middleware excludes /api).
      {
        source: "/api/:path*",
        headers: securityHeaders,
      },
    ]
  },
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
}

export default nextConfig
