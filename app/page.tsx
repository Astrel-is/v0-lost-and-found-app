"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Eye, BookOpen } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
<<<<<<< HEAD
import { ItemCard } from "@/components/item-card"
import { getItems, initializeStorage } from "@/lib/storage"
import { type Item } from "@/lib/mock-data"
=======
import { itemsApi } from "@/lib/api-client"
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
import Image from "next/image"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [recentItems, setRecentItems] = useState<any[]>([])

  useEffect(() => {
    itemsApi
      .getAll({ status: "available", limit: 4 })
      .then((res) => setRecentItems(res.items))
      .catch(() => setRecentItems([]))
  }, [])

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/50 backdrop-blur-xl glass-effect">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 animate-fade-in">
          <div className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Image src="/vault-church-logo.jpeg" alt="Vault Church" fill sizes="(max-width: 640px) 32px, 40px" className="object-contain" priority />
            </div>
            <span className="text-base sm:text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">Vault Church</span>
=======
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-900 to-slate-950">
      {/* Hero Section - Cinematic */}
      <header className="relative border-b border-white/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-emerald-500/5 blur-[128px]" />
        </div>
        <div className="container relative mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <Image src="/vault-church-logo.jpeg" alt="Vault Church" fill sizes="(max-width: 640px) 32px, 40px" className="object-contain" priority />
            </div>
            <span className="text-base sm:text-xl font-semibold text-white truncate">Vault Church Security System</span>
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
<<<<<<< HEAD
              <Button variant="default" size="sm" className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Login
              </Button>
=======
              <Button variant="ghost" className="text-white hover:bg-white/10">Login</Button>
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
            </Link>
          </nav>
        </div>
      </header>

<<<<<<< HEAD
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="mb-8 flex justify-center animate-bounce-subtle">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 group">
              <div className="absolute inset-0 animate-glow-pulse rounded-full" />
              <Image src="/vault-church-logo.jpeg" alt="Vault Church" fill sizes="160px" className="object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300" priority />
            </div>
          </div>
          
          <div className="space-y-4 animate-slide-in-up">
            <h1 className="text-balance text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-foreground">
              Vault Church
              <span className="gradient-text block mt-2">Security System</span>
            </h1>
            
            <p className="text-pretty text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade asset management, access control, and protocol enforcement for community safety. 
              <span className="block text-foreground font-semibold mt-3">Shielded in Silence. Fortified for Eternity.</span>
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4 animate-scale-in">
            <Link href="/login">
              <Button size="lg" className="font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8">
                <Shield className="mr-2 h-5 w-5" />
                Access System
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" size="lg" className="font-semibold hover:border-primary transition-all duration-300 px-8">
                Browse Assets
              </Button>
            </Link>
=======
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[200px]" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center animate-cinematic-scale-in">
              <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                <Image src="/vault-church-logo.jpeg" alt="Vault Church" fill sizes="(max-width: 640px) 128px, 160px" className="object-contain" priority />
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-cinematic-glow" />
              </div>
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-wider text-white md:text-6xl animate-cinematic-text-reveal">
              VAULT CHURCH
            </h1>
            <p className="mb-4 text-lg tracking-[0.3em] text-primary animate-cinematic-text-reveal delay-200">
              SECURITY OPERATIONS CENTER
            </p>
            <p className="mb-10 text-pretty text-lg text-zinc-400 md:text-xl animate-cinematic-text-reveal delay-300">
              A unified security system for asset management, access control, protocol enforcement, and community safety.
              Shielded in silence. Fortified for eternity.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-cinematic-slide-up delay-400">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Shield className="mr-2 h-5 w-5" />
                  ACCESS SYSTEM
                </Button>
              </Link>
            </div>
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
          </div>
        </div>
      </section>

      {/* Features Section */}
<<<<<<< HEAD
      <section className="border-y border-border/50 py-20 md:py-28 glass-effect">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-in-down">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              System Capabilities
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Asset Management", desc: "Comprehensive tracking with verification and secure protocols" },
              { icon: Lock, title: "Access Control", desc: "Role-based auth with admin user management" },
              { icon: BookOpen, title: "Security Playbooks", desc: "Operational protocols for response procedures" },
              { icon: Eye, title: "Audit Logging", desc: "Complete activity tracking for transparency" }
            ].map((feature, i) => (
              <Card 
                key={i}
                className="p-6 group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 border-border/50 hover:border-primary/30 glass-effect cursor-default animate-slide-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                  {feature.desc}
                </p>
=======
      <section className="relative border-t border-white/10 bg-white/[0.02] py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-wider text-white animate-cinematic-text-reveal">CAPABILITIES</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Lost & Found", desc: "Comprehensive asset tracking with photo verification, claim processing, and secure release protocols.", delay: "100" },
              { icon: Lock, title: "Access Control", desc: "Role-based authentication with admin-controlled user management and security clearance levels.", delay: "200" },
              { icon: BookOpen, title: "Playbooks", desc: "Operational protocols for security scenarios with priority-based response procedures.", delay: "300" },
              { icon: Eye, title: "Audit Logging", desc: "Complete activity tracking with transparent logging of all security events and user actions.", delay: "400" },
            ].map(({ icon: Icon, title, desc, delay }) => (
              <Card key={title} className={`p-6 bg-white/[0.03] border-white/10 hover:bg-white/[0.06] transition-all animate-cinematic-slide-up delay-${delay}`}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-zinc-400">{desc}</p>
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
              </Card>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Recent Items Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="mb-12 space-y-4 animate-slide-in-down">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-foreground">Asset Registry</h2>
              <p className="text-muted-foreground mt-2">Recently recovered items in the system</p>
            </div>
            <Link href="/browse">
              <Button variant="outline" className="font-semibold hover:border-primary transition-all duration-300">
                View All →
              </Button>
            </Link>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full" />
=======
      {/* Recent Items */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-wider text-white">ASSET REGISTRY</h2>
            <p className="text-sm text-zinc-400 mt-1">Recently recovered items in the security system</p>
          </div>
          <Link href="/browse">
            <Button variant="ghost" className="text-white hover:bg-white/10">View All</Button>
          </Link>
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
        </div>
        
        {recentItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentItems.map((item, i) => (
<<<<<<< HEAD
              <div key={item.id} className="animate-slide-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <ItemCard
                  id={item.id}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  dateFound={new Date(item.dateFounded)}
                  location={item.location}
                  status={item.status as any}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-16 text-center glass-effect animate-scale-in border-dashed">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No assets available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later or upload an item.</p>
=======
              <Link key={item.id} href={`/items/${item.id}`}>
                <Card className={`overflow-hidden bg-white/[0.03] border-white/10 transition-all hover:shadow-lg hover:bg-white/[0.06] animate-cinematic-slide-up delay-${(i + 1) * 100}`}>
                  <div className="relative aspect-square bg-zinc-800/50">
                    <Image src={item.imageUrl || "/placeholder.svg"} alt={`${item.category} found item`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 25vw, 320px" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{item.category}</span>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{item.status}</span>
                    </div>
                    <p className="text-sm text-zinc-400">Found {new Date(item.dateFounded).toLocaleDateString()}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-white/[0.03] border-white/10">
            <p className="text-zinc-400">No items available at the moment. Check back later!</p>
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
          </Card>
        )}
      </section>

      {/* Footer */}
<<<<<<< HEAD
      <footer className="border-t border-border/50 bg-card/50 glass-effect py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-3">The Vault</h3>
              <p className="text-sm text-muted-foreground">Enterprise security operations for community safety.</p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
                <li><Link href="/browse" className="text-muted-foreground hover:text-primary transition-colors">Browse</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-3">Contact</h3>
              <p className="text-sm text-muted-foreground">security@vaultchurch.org</p>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Vault Church. Shielded in Silence. Fortified for Eternity.</p>
          </div>
=======
      <footer className="border-t border-white/10 bg-white/[0.02] py-8">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>&copy; 2025 Vault Church Security System. Shielded in Silence. Fortified for Eternity.</p>
>>>>>>> fe2d2d964d64c36af48df87af815cae4bd5b8699
        </div>
      </footer>
    </div>
  )
}
