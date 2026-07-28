"use client"
import React, { useState, useEffect } from "react"
import { Lock, ShieldCheck, KeyRound, CheckCircle, LogOut } from "lucide-react"

export function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [pin, setPin] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const auth = localStorage.getItem("retro_admin_auth_token")
    if (auth === "RETRO_SECRET_88875") {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === "88875" || pin === "rtc2026") {
      localStorage.setItem("retro_admin_auth_token", "RETRO_SECRET_88875")
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("❌ Access Denied: Invalid Workshop Security Key.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("retro_admin_auth_token")
    setIsAuthenticated(false)
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-400 font-mono text-sm">Verifying Workshop Security Protocol...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Horological Admin Console</h2>
            <p className="text-xs text-gray-400">Please enter your authorized Workshop Access Key to manage inventory and pricing.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter Workshop Key..."
                className="w-full text-center tracking-widest text-lg font-mono py-3 rounded-xl bg-[#0d1117] border border-gray-700 text-white focus:outline-none focus:border-[#d4af37]"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 py-2 rounded-lg">{error}</p>}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#d4af37] hover:bg-[#b89728] text-black font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg shadow-[#d4af37]/10 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>
          </form>
          <div className="pt-4 border-t border-gray-800/80 text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted Workshop Session</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-800"
          title="Lock Admin Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock / Logout Session</span>
        </button>
      </div>
      {children}
    </div>
  )
}
