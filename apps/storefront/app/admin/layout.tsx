"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { LayoutDashboard, PlusCircle, LogOut, Package, Image as ImageIcon, MessageCircle } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/admin/login"

  const handleSignOut = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  if (isLoginPage) {
    return <>{children}</>
  }

  const navItems = [
    { name: "Products", href: "/admin", icon: LayoutDashboard },
    { name: "Add Product", href: "/admin/new", icon: PlusCircle },
    { name: "Bulk Import", href: "/admin/import", icon: Package },
    { name: "Hero Images", href: "/admin/hero", icon: ImageIcon },
    { name: "Reviews", href: "/admin/reviews", icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans flex text-[#202223]">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#EBEBEB] border-r border-[#D2D5D9] flex flex-col fixed inset-y-0 left-0 z-30 transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-[#202223]" onClick={() => setIsMobileMenuOpen(false)}>
            Store Admin
          </Link>
          <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(false)}>
            ✕
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active 
                    ? "bg-white text-[#202223] shadow-sm font-semibold" 
                    : "text-[#5C5F62] hover:bg-[#F4F6F8] hover:text-[#202223]"
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? "text-[#008060]" : "text-[#5C5F62]"}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#D2D5D9]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-[#5C5F62] hover:bg-[#F4F6F8] hover:text-[#202223] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen pb-12 w-full">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-[#D2D5D9] flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-gray-600 hover:text-black"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h1 className="text-sm font-semibold text-[#202223] capitalize hidden sm:block">
              {pathname.split("/").pop() === "admin" ? "Products" : pathname.split("/").pop()}
            </h1>
          </div>
          <Link href="/" target="_blank" className="text-sm font-medium text-[#008060] hover:underline">
            View Store
          </Link>
        </header>
        
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
