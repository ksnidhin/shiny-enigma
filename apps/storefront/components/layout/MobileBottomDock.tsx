"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, Bookmark, ShoppingBag } from "lucide-react"
import { getCartCount } from "@/lib/cart"
import { getSavedIds } from "@/lib/wishlist"

export function MobileBottomDock() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = React.useState(0)
  const [savedCount, setSavedCount] = React.useState(0)

  // Listen to cart and saved updates
  React.useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCartCount())
      setSavedCount(getSavedIds().length)
    }
    updateCounts()

    window.addEventListener("rtc_cart_updated", updateCounts)
    window.addEventListener("rtc_saved_updated", updateCounts)
    window.addEventListener("storage", updateCounts)

    return () => {
      window.removeEventListener("rtc_cart_updated", updateCounts)
      window.removeEventListener("rtc_saved_updated", updateCounts)
      window.removeEventListener("storage", updateCounts)
    }
  }, [])

  const isHome = pathname === "/"
  const isShop = pathname.startsWith("/collections") || pathname.startsWith("/products") || pathname.startsWith("/watches")
  const isSaved = pathname === "/saved"
  const isCart = pathname === "/cart"

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0E1622] border-t border-[#1C2736] px-4 py-2 flex items-center justify-around shadow-2xl safe-area-pb"
    >
      {/* 1. HOME */}
      <Link 
        href="/" 
        className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors relative ${
          isHome ? "text-[#C85A17]" : "text-gray-400 hover:text-gray-200"
        }`}
      >
        <Home className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold tracking-widest uppercase">HOME</span>
        {isHome && (
          <span className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#C85A17] rounded-full" />
        )}
      </Link>

      {/* 2. SHOP / ARCHIVE */}
      <Link 
        href="/collections/all" 
        className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors relative ${
          isShop && !isCart && !isSaved ? "text-[#C85A17]" : "text-gray-400 hover:text-gray-200"
        }`}
      >
        <LayoutGrid className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold tracking-widest uppercase">SHOP</span>
        {isShop && !isCart && !isSaved && (
          <span className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#C85A17] rounded-full" />
        )}
      </Link>

      {/* 3. SAVED */}
      <Link 
        href="/collections/all?filter=saved" 
        className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors relative ${
          isSaved ? "text-[#C85A17]" : "text-gray-400 hover:text-gray-200"
        }`}
      >
        <div className="relative">
          <Bookmark className="w-5 h-5 mb-1" />
          {savedCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#C85A17] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {savedCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase">SAVED</span>
        {isSaved && (
          <span className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#C85A17] rounded-full" />
        )}
      </Link>

      {/* 4. BAG */}
      <Link 
        href="/cart" 
        className={`flex flex-col items-center justify-center min-w-[60px] py-1 transition-colors relative ${
          isCart ? "text-[#C85A17]" : "text-gray-400 hover:text-gray-200"
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 mb-1" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-[#C85A17] text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase">BAG</span>
        {isCart && (
          <span className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#C85A17] rounded-full" />
        )}
      </Link>
    </nav>
  )
}
