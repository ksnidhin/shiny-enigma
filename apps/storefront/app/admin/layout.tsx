import Link from "next/link"
import React from "react"
import { ShieldCheck, PlusCircle, LayoutDashboard, ExternalLink, Watch } from "lucide-react"

import { AdminAuthWrapper } from "./AdminAuthWrapper"

export const metadata = {
  title: "Horological Admin Console | RetroTimeCo",
  description: "Custom management dashboard for RetroTimeCo timepieces, pricing in Rs., and workshop restoration records.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans flex flex-col">
      {/* Top Console Bar */}
      <header className="border-b border-gray-800 bg-[#161b22] sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3 text-lg font-bold tracking-tight text-white hover:text-[#d4af37] transition-colors">
            <div className="p-2 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-black tracking-widest uppercase text-[#d4af37]">RetroTimeCo</span>
              <span className="text-xs text-gray-400 font-mono">Horological Admin Console v2.0</span>
            </div>
          </Link>
          <div className="h-6 w-[1px] bg-gray-800 hidden md:block" />
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Inventory Archive
            </Link>
            <Link
              href="/admin/new"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-[#d4af37] hover:text-white hover:bg-[#d4af37]/20 transition-colors border border-[#d4af37]/30 bg-[#d4af37]/10"
            >
              <PlusCircle className="w-4 h-4" />
              Add Timepiece
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Connected to Custom REST Server (Port 9000)
          </div>
          <Link
            href="/collections/all"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors border border-gray-700"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <AdminAuthWrapper>
          {children}
        </AdminAuthWrapper>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500 font-mono">
        RetroTimeCo Horological Management Engine — Mumbai Workshop & Storage Engine
      </footer>
    </div>
  )
}
