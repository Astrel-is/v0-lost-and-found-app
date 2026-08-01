import type { AuditLogType, AuditLog } from "./mock-data"
import { addAuditLog as addAuditLogToStorage } from "./storage"

// Writes an audit entry. When an authenticated session exists this is recorded
// server-side via the API (identity derived from the session, so the trail is
// tamper-evident). localStorage is only used as a fallback for anonymous users
// or when the server is unreachable. Fire-and-forget: never breaks the UI.
export function addAuditLog(
  type: AuditLogType,
  action: string,
  userId?: string,
  userName?: string,
  details?: string,
  severity: "info" | "warning" | "error" | "critical" = "info",
) {
  try {
    // Server-side recording requires the httpOnly session cookie.
    if (typeof window === "undefined") {
      return null
    }

    fetch("/api/audit-logs", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, action, details, severity }),
    })
      .catch(() => {
        // Fallback: record locally so the entry is not lost entirely.
        const log: AuditLog = {
          id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          action,
          details: details || undefined,
          severity,
          userId: userId || undefined,
          userName: userName || undefined,
          timestamp: new Date().toISOString(),
        }
        addAuditLogToStorage(log)
      })

    return null
  } catch (error) {
    console.error("Failed to create audit log:", error)
    // Don't throw - audit logging should not break the application
    return null
  }
}
