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
      {/* Sidebar */}
      <aside className="w-64 bg-[#EBEBEB] border-r border-[#D2D5D9] flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-[#202223]">
            Store Admin
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
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
      <main className="flex-1 ml-64 min-h-screen pb-12">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-[#D2D5D9] flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-sm font-semibold text-[#202223] capitalize">
            {pathname.split("/").pop() === "admin" ? "Products" : pathname.split("/").pop()}
          </h1>
          <Link href="/" target="_blank" className="text-sm font-medium text-[#008060] hover:underline">
            View Store
          </Link>
        </header>
        
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
