"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { getCartCount } from "@/lib/cart"

export function CartNavIcon() {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    setCount(getCartCount())
    const handler = () => setCount(getCartCount())
    window.addEventListener("rtc_cart_updated", handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener("rtc_cart_updated", handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  return (
    <Link 
      href="/cart" 
      className="p-2 text-[#0E1622] hover:text-[#C85A17] focus-ring rounded-full transition-colors relative" 
      aria-label="Cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 bg-[#C85A17] text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-sm">
          {count}
        </span>
      )}
    </Link>
  )
}
