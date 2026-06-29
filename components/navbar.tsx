"use client"

import Link from "next/link"
import { Link2, Sparkles, Shield, LogOut, Info, Settings, Mail } from "lucide-react"
import { useEffect, useState } from "react"

interface UserProfile {
  id: string
  email: string
  fullName: string
  role: "user" | "admin"
  paymentStatus: "pending" | "verified" | "rejected"
}

export function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          setIsPremium(data.user.role === "admin" || data.user.paymentStatus === "verified")
        } else {
          setUser(null)
          setIsPremium(false)
        }
      }
    } catch (e) {
      console.error("Navbar session fetch error:", e)
    }
  }

  useEffect(() => {
    fetchUser()
    const interval = setInterval(fetchUser, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        setUser(null)
        setIsPremium(false)
        window.location.href = "/"
      }
    } catch (e) {
      console.error("Logout error:", e)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 font-sans">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-200">
              <Link2 className="w-5.5 h-5.5 rotate-45" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                GAUR <span className="text-indigo-400">LINKS</span>
              </div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest leading-none font-semibold">
                Dynamic Redirector
              </span>
            </div>
          </Link>

          {/* Navigation Links for Verified Users */}
          {isPremium && (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-xs font-semibold text-neutral-400 hover:text-white transition-all">
                About Tool
              </Link>
              <Link href="/services" className="text-xs font-semibold text-neutral-400 hover:text-white transition-all">
                Our Features
              </Link>
              <Link href="/contact" className="text-xs font-semibold text-neutral-400 hover:text-white transition-all">
                Get Support
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-3">
            {/* Admin Panel Link */}
            {user?.role === "admin" && (
              <Link
                href="/admin/payments"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-900/50 bg-red-950/20 text-xs text-red-400 hover:text-white hover:bg-red-900/20 transition-all duration-200"
              >
                <Shield className="w-3.5 h-3.5 text-red-500" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Premium Indicator */}
            {isPremium && user?.role !== "admin" && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xs text-amber-400 font-bold shadow-lg shadow-amber-500/5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                PREMIUM
              </div>
            )}

            {/* User Session Info / Logout */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">Signed in as</span>
                  <span className="block text-xs font-mono text-indigo-300 font-semibold">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-red-400 hover:bg-red-950/10 hover:border-red-900/30 transition-all cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                v1.0.0 Stable
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
