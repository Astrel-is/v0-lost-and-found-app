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
- `pnpm test` — full vitest suite (unit + no-auth regression + role authorization)
- `pnpm test:security` — no-auth regression only (protected routes return 401)
- `pnpm test:coverage` — vitest with coverage report (core security libs are the focus)
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:seed` / `pnpm db:studio`
- `bash start.sh` — full local setup (install, reset DB, seed, dev server)

After any change, run `pnpm lint`, `npx tsc --noEmit`, and `pnpm test`.

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

- Dev DB is SQLite (`dev.db` at repo root, gitignored).
- ⚠️ **Known gap: the app is SQLite-only right now.** `prisma/schema.prisma` hardcodes
  `provider = "sqlite"` and `lib/prisma.ts` always uses the better-sqlite3 adapter, so the documented
  "production Postgres via `DATABASE_URL`" does not actually work. A Postgres `DATABASE_URL` will fail
  `prisma migrate deploy` (provider mismatch). Making Postgres work requires: an env-driven `provider`
  in the schema, adapter selection by env in `lib/prisma.ts` (the Neon adapter is installed but unused),
  and a Postgres-generated migration history. Until then, treat the Vercel deploy's `prisma migrate
  deploy` + seed as SQLite-only, and add a Postgres CI smoke test once the provider is env-driven.
- Schema changes: update `prisma/schema.prisma`, run `pnpm db:migrate` (dev). If the migration
  history drifts from the DB (e.g. a runtime table like `rate_limit_counters`), `start.sh` resets
  the dev DB — that is expected.
- `User.tokenVersion` is bumped on password change to revoke all existing sessions. Keep it in the
  JWT payload and verify it in `getAuthenticatedUser` (see `lib/auth-middleware.ts`).
- JWT default TTL is 8h and must match the cookie `maxAge` in the login route.

## Testing

- Vitest is the runner (`pnpm test`); config lives in `vitest.config.ts` (loads `.env` via
  `vitest.setup.ts`, resolves the `@/` alias, runs files sequentially so integration tests don't
  contend on the shared SQLite `dev.db`).
- `tests/security-noauth-regression.test.ts` asserts every protected route returns 401 without a
  session (imports route handlers directly; PrismaClient is disconnected in `afterAll`).
- `tests/authz-regression.test.ts` covers the role matrix against the real DB with throwaway users
  (created in `beforeAll`, removed in `afterAll`).
- `tests/unit/` covers the security-critical libs: `jwt.ts`, `auth-middleware.ts`, `validation.ts`,
  `security.ts`, `rate-limit.ts`, `db.ts` (`auth-middleware` mocks `lib/db`; `rate-limit` mocks it to
  null to force the in-memory path).
- Always set `process.env.JWT_SECRET` in tests that sign/verify tokens; never reuse the value from
  `.env` in test expectations.
- Add role-based authorization tests when covering new endpoints.
- `pnpm test:coverage` enforces thresholds on `lib/` (85% stmts/lines, 80% branches, 75% funcs);
  client/mock layers are excluded from the gate. Don't let coverage regress below the threshold.

## CI/CD

- CI (`.github/workflows/ci.yml`): lint, typecheck, prepare the ephemeral `ci.db` via
  `prisma migrate deploy`, `pnpm test:coverage` (full suite + coverage gate), dependency review on
  PRs (`fail-on-severity: high`), production build.
- CodeQL (`.github/workflows/codeql.yml`): semantic JS/TS scanning on PRs, `main`, and weekly.
- Known baseline: `pnpm audit` reports a few `lodash` advisories (dev-tooling transitive dep, no
  patched release). Do not add new high/critical vulnerabilities via PRs (dependency review blocks).
- CD (`.github/workflows/deploy.yml`): Vercel preview on PRs, production on `main`; applies
  `prisma migrate deploy` + seed against `PROD_DATABASE_URL` before each deploy. Requires the
  `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `PROD_DATABASE_URL`, and
  `BOOTSTRAP_*_PASSWORD` secrets before it activates.

## Style

- Match the existing code conventions (structure, naming, import order).
- Do not add comments unless they clarify non-obvious security/correctness logic.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
