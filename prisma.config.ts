<<<<<<< HEAD
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
=======
import "dotenv/config"
import { defineConfig } from "prisma/config"

// Select the datasource provider from the DATABASE_URL scheme, overridable via
// DATABASE_PROVIDER. This is what lets the same schema files drive SQLite dev
// and Postgres production with separate migration histories.
const url = process.env.DATABASE_URL ?? ""
const provider =
  process.env.DATABASE_PROVIDER === "postgresql" ||
  url.startsWith("postgresql://") ||
  url.startsWith("postgres://")
    ? "postgresql"
    : "sqlite"

const isPostgres = provider === "postgresql"

export default defineConfig({
  schema: isPostgres ? "prisma/schema.postgresql.prisma" : "prisma/schema.prisma",
  migrations: {
    path: isPostgres ? "prisma/migrations-postgresql" : "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url,
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
  },
})
