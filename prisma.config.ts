import { PrismaClient } from "@prisma/client"
import { defineConfig } from "prisma/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    table: "_prisma_migrations",
  },
  adapter:
    process.env.DATABASE_PROVIDER === "postgresql" ||
    process.env.DATABASE_URL?.startsWith("postgresql://") ||
    process.env.DATABASE_URL?.startsWith("postgres://")
      ? new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" })
      : new PrismaBetterSqlite3({ url: "file:./dev.db" }),
})

declare global {
  // allow global `var` declarations in TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  })

if (process.env.NODE_ENV !== "production") global.prisma = prisma

export { prisma }
