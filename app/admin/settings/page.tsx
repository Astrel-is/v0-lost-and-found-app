"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Zap, ShieldAlert, FileCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { auditLogsApi, ApiError } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { BackButton } from "@/components/back-button"

export default function AdminSettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    auditLogsApi
      .getAll({ limit: 50 })
      .then((res) => setAuditLogs(res.logs))
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : "Failed to load audit logs"
        toast({ title: "Error", description: message, variant: "destructive" })
      })
      .finally(() => setIsLoaded(true))
  }, [toast])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const getTimeAgo = (timestamp: string) => {
    const now = Date.now()
    const logTime = new Date(timestamp).getTime()
    const diff = now - logTime
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const eventCount = auditLogs.length
  const alerts = auditLogs.filter((l) => l.severity === "error" || l.severity === "critical").length
  const recentEventCount = auditLogs.filter((l) => {
    const diff = Date.now() - new Date(l.timestamp || l.createdAt).getTime()
    return diff < 24 * 60 * 60 * 1000
  }).length

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BackButton fallbackHref="/admin" />
          </div>
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">System Status</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Live status and recent security events</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border p-6">
              <h2 className="text-xl font-black tracking-tight uppercase italic flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                System Health
              </h2>
              <p className="text-xs text-muted-foreground font-medium mb-6">
                Live status derived from the audit stream
              </p>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Audit Stream</span>
                  <span className="text-emerald-500 font-bold font-mono">ACTIVE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Events (last 24h)</span>
                  <span className="text-primary font-bold font-mono">{recentEventCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open Alerts</span>
                  <span className={`font-bold font-mono ${alerts > 0 ? "text-destructive" : "text-emerald-500"}`}>
                    {alerts}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Event</span>
                  <span className="font-bold font-mono text-card-foreground">
                    {isLoaded && eventCount > 0 ? getTimeAgo(auditLogs[0].timestamp || auditLogs[0].createdAt) : "—"}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Security Events */}
          <div className="space-y-6">
            <Card className="bg-card border-border p-6 h-fit">
              <h3 className="text-lg font-bold mb-6">Recent Security Events</h3>
              <div className="space-y-6">
                {auditLogs.slice(0, 5).map((log) => {
                  const getIcon = () => {
                    if (log.type.includes("claim")) return FileCheck
                    if (log.severity === "error" || log.severity === "critical") return ShieldAlert
                    return Zap
                  }
                  const Icon = getIcon()
                  const isAlert = log.severity === "error" || log.severity === "critical"
                  return (
                    <div key={log.id} className="flex gap-4 items-start">
                      <div
                        className={`p-2 rounded-md ${isAlert ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{log.user?.name || "System"}</p>
                        <p className="text-[11px] text-muted-foreground leading-tight">{log.action}</p>
                        <p className="text-[10px] text-primary/60 font-mono mt-1">{getTimeAgo(log.timestamp)}</p>
                      </div>
                    </div>
                  )
                })}
                {auditLogs.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No recent events</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
