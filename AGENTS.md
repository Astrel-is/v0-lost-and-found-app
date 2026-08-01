# AGENTS.md

Guidance for AI coding agents working in this repository (opencode, Cursor, Copilot, etc.).

## Project overview

**Vault Church Security System** — a lost-&-found and church security operations app.
Next.js 14 (App Router) + TypeScript + Tailwind/shadcn UI, Prisma ORM, pnpm, Zod validation,
custom JWT auth (no external auth library).

## Commands (always use these)

- `pnpm dev` — dev server on http://localhost:3000
- `pnpm lint` — ESLint (project has `eslint.config.mjs`; run this, not legacy config)
- `npx tsc --noEmit` — typecheck
- `pnpm build` — production build (`prisma generate && next build`)
- `pnpm test:security` — security regression tests (unauth access must return 401)
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:seed` / `pnpm db:studio`
- `bash start.sh` — full local setup (install, reset DB, seed, dev server)

After any change, run `pnpm lint`, `npx tsc --noEmit`, and `pnpm test:security`.

## Architecture

- `app/` — pages (all client components) + `app/api/*` — the real, DB-backed backend (route handlers)
- `lib/` — core logic: `db.ts`/`prisma.ts`, `jwt.ts`, `auth-middleware.ts`, `auth-context.tsx`,
  `rate-limit.ts`, `security.ts`, `validation.ts`, `audit-logger.ts`, `api-client.ts`
- `middleware.ts` — security headers + cookie guard for `/admin` and `/volunteer` pages
- `prisma/` — schema + `seed.ts` (dev users; passwords from `BOOTSTRAP_*_PASSWORD` env, else dev defaults)
- `.github/workflows/` — `ci.yml` (lint/typecheck/test/build) and `deploy.yml` (Vercel)

### ⚠️ THE most important rule: mock UI vs real API

The **pages in the UI currently run on localStorage mocks** (`lib/storage.ts`, `lib/mock-data.ts`,
`lib/mock-api.ts`) — e.g. `/browse`, `/upload`, `/dashboard`, `/my-claims`, `/admin/*`,
`/volunteer/*`. These mocks are **legacy** and do not exercise auth or the database.

The **DB-backed API under `app/api/*` is authoritative, secure, and the source of truth**.

- When adding or changing features, wire the UI to the real API (`lib/api-client.ts` or `fetch`
  with `credentials: "same-origin"`). Do NOT extend the mock layers.
- The eventual goal is to delete `lib/storage.ts`, `lib/mock-data.ts`, `lib/mock-api.ts` and
  point every page at the API.

## Security conventions (mandatory — do not break these)

- **Auth is cookie-based.** The httpOnly `auth_token` cookie carries the JWT. Never store the token
  in localStorage/sessionStorage. Client calls use `credentials: "same-origin"`.
- **Authorization is server-side only.** Every protected route handler must call `requireAuth`,
  `requireAdmin`, or `requireAdminOrVolunteer` from `lib/auth-middleware.ts`. The user's role is
  re-fetched from the DB per request. Never trust a client-supplied role or userId.
- **Identity comes from the session.** E.g. `uploadedById` is derived from `authResult.user.id`,
  never from the request body.
- **Validate everything.** Use the Zod schemas in `lib/validation.ts` via `validateAndSanitize`,
  and the helpers in `lib/security.ts` (path traversal, URL/image validation, `sanitizeSearchQuery`,
  `assertSameOrigin` for CSRF).
- **Never expose PII.** Public item listings return only the uploader's `id`; claimant/uploader
  personal data must not appear in public responses.
- **Log to the server, don't fake logs.** Use `POST /api/audit-logs` (type allowlist, user derived
  from session). Never log passwords, tokens, or secrets.
- **No hardcoded secrets.** Secrets come from env (`JWT_SECRET`, `BOOTSTRAP_*_PASSWORD`,
  `DATABASE_URL`). `.env` is gitignored; only `.env.example` is committed. Never commit a real
  credential anywhere, including docs.
- **Rate limit mutating and login endpoints** (`lib/rate-limit.ts`).

## Roles

- `user` — browse, upload items, submit claims, manage profile
- `volunteer` — user + review claims, process item releases
- `admin` — everything (users, locations, playbooks, audit logs, settings)

## Database & migrations

- Dev DB is SQLite (`prisma/dev.db`, gitignored). Production is Postgres via `DATABASE_URL`.
- Schema changes: update `prisma/schema.prisma`, run `pnpm db:migrate` (dev). If the migration
  history drifts from the DB (e.g. a runtime table like `rate_limit_counters`), `start.sh` resets
  the dev DB — that is expected.
- `User.tokenVersion` is bumped on password change to revoke all existing sessions. Keep it in the
  JWT payload and verify it in `getAuthenticatedUser` (see `lib/auth-middleware.ts`).
- JWT default TTL is 8h and must match the cookie `maxAge` in the login route.

## Testing

- `tests/security-noauth-regression.test.ts` asserts every protected route returns 401 without a
  session. It imports route handlers directly and ends with `process.exit(0)` (required because
  PrismaClient keeps the event loop alive).
- Add role-based authorization tests when covering new endpoints.

## CI/CD

- CI (`.github/workflows/ci.yml`): lint, typecheck, `pnpm test:security`, production build.
- CD (`.github/workflows/deploy.yml`): Vercel preview on PRs, production on `main`. Requires the
  `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets before it activates.

## Style

- Match the existing code conventions (structure, naming, import order).
- Do not add comments unless they clarify non-obvious security/correctness logic.
