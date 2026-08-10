import { PrismaClient } from "@prisma/client"
<<<<<<< HEAD
import { PrismaNeon } from "@prisma/adapter-neon"
=======
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaPg } from "@prisma/adapter-pg"

// Provider is inferred from the DATABASE_URL scheme (overridable via
// DATABASE_PROVIDER) and MUST match the schema the client was generated from:
// sqlite schema -> better-sqlite3 adapter, postgresql schema -> pg adapter.
// `prisma generate` picks the schema from the same env in prisma.config.ts, so
// keep the two in sync (CI smoke test covers the postgres path).
const url = process.env.DATABASE_URL ?? ""
const isPostgres =
  process.env.DATABASE_PROVIDER === "postgresql" ||
  url.startsWith("postgresql://") ||
  url.startsWith("postgres://")
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699

const globalForPrisma = global as unknown as { prisma: PrismaClient | null }

<<<<<<< HEAD
// Check if using mock mode (disconnected from database)
const USE_MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
const HAS_DATABASE_URL = typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0

let prismaClient: PrismaClient | null = null

if (!USE_MOCK_MODE && HAS_DATABASE_URL) {
  try {
    const connectionString = process.env.DATABASE_URL

    prismaClient =
      globalForPrisma.prisma ||
      new PrismaClient({
        adapter: new PrismaNeon({ connectionString }),
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      })

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaClient
    }
  } catch (error) {
    console.error("[v0] Failed to initialize Prisma with Neon adapter:", error)
    // Fall back to null if initialization fails
    prismaClient = null
  }
=======
function createPrismaClient() {
  const adapter = isPostgres
    ? new PrismaPg({ connectionString: url })
    : new PrismaBetterSqlite3({ url })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
