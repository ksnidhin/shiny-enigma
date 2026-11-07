"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { WatchProduct } from "@/lib/api"
import { ShoppingBag, ArrowRight, Trash2, Truck, MessageCircle, ArrowLeft } from "lucide-react"

interface CartItem {
  watch: WatchProduct;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = React.useState<CartItem[]>([])

  React.useEffect(() => {
    import("@/lib/cart").then((module) => {
      setItems(module.getCartItems())
    })
  }, [])

  const updateQuantity = async (id: string, delta: number) => {
    const { updateCartQuantity, getCartItems } = await import("@/lib/cart")
    const item = items.find(i => i.watch.id === id)
    if (item) {
      updateCartQuantity(id, item.quantity + delta)
      setItems(getCartItems())
    }
  }

  const removeItem = async (id: string) => {
    const { removeFromCart, getCartItems } = await import("@/lib/cart")
    removeFromCart(id)
    setItems(getCartItems())
  }

  const subtotal = items.reduce((sum, item) => sum + (item.watch?.price || 0) * item.quantity, 0)
  const shipping = 0 // Complimentary express shipping across India on all vintage pieces
  const total = subtotal + shipping

  const handleCheckout = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://retrotimeco.in"
    const itemList = items.map(item => 
      `• *${item.watch?.name || "Timepiece"}* (Qty: ${item.quantity})\n  Ref: ${item.watch?.reference_number || "Vintage"}\n  Price: Rs. ${((item.watch?.price || 0) * item.quantity).toLocaleString("en-IN")}\n  Link: ${origin}/products/${item.watch?.slug || ""}`
    ).join("\n\n")

    const text = `Hi RetroTimeCo! I would like to purchase the following pieces from my bag:\n\n${itemList}\n\n*Total Amount: Rs. ${total.toLocaleString("en-IN")} (Includes Insured Express Shipping)*\n\nPlease send me the payment instructions and dispatch timeline!`
    window.open(`https://wa.me/919171988875?text=${encodeURIComponent(text)}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] py-8 sm:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#D8D1C5]">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold text-[#C85A17]">/</span>
            <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#11161B]">
              SHOPPING BAG
            </h1>
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#0E1620] text-white">
              {items.length} {items.length === 1 ? "PIECE" : "PIECES"}
            </span>
          </div>

          <Link
            href="/collections/all"
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#11161B] hover:text-[#C85A17] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>CONTINUE BROWSING</span>
          </Link>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="bg-[#0E1620] text-white p-4 mb-8 flex items-center justify-between border border-[#1C2736]">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#C85A17] shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                COMPLIMENTARY EXPRESS SHIPPING • INDIA-WIDE
              </p>
              <p className="font-mono text-[11px] text-gray-300">
                All shipments insured and dispatched via India Post Speed Post / Blue Dart from Chennai.
              </p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#F8F5EE] border border-[#D8D1C5] p-12 sm:p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-[#EAE4D9] flex items-center justify-center text-[#0E1620] mx-auto border border-[#D8D1C5]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#11161B]">
              Your Bag is Empty
            </h2>
            <p className="font-mono text-xs text-[#5C646D] max-w-md mx-auto leading-relaxed">
              Discover our curated archive of rare Japanese mechanicals, Swiss chronometers, and new Casio releases.
            </p>
            <div className="pt-2">
              <Link
                href="/collections/all"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C85A17] hover:bg-[#B34E12] text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors"
              >
                <span>EXPLORE THE ARCHIVE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Bag Item Rows */}
            <div className="md:col-span-7 space-y-4">
              {items.map((item) => (
                <div
                  key={item.watch.id}
                  className="bg-[#F8F5EE] border border-[#D8D1C5] p-4 flex gap-4 items-center"
                >
                  <Link href={`/products/${item.watch.slug}`} className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#EAE4DB] shrink-0 overflow-hidden border border-[#D8D1C5]">
                    <Image
                      src={item.watch.image || (item.watch.gallery_images && item.watch.gallery_images[0]) || "/hero_vintage_watch_1785170825322.jpg"}
                      alt={item.watch.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.watch.slug}`}>
                      <h3 className="font-heading text-base font-bold text-[#11161B] hover:text-[#C85A17] transition-colors truncate">
                        {item.watch.name}
                      </h3>
                    </Link>
                    <p className="font-mono text-[11px] text-[#5C646D] mt-0.5">
                      Ref. {item.watch.reference_number || "Vintage"} • {item.watch.brand}
                    </p>
                    <div className="font-mono text-sm font-bold text-[#11161B] mt-1.5">
                      ₹ {(item.watch.price * item.quantity).toLocaleString("en-IN")}
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-[#D8D1C5] bg-white font-mono text-xs">
                        <button
                          onClick={() => updateQuantity(item.watch.id, -1)}
                          className="px-2.5 py-1 hover:bg-[#EAE4D9] text-[#11161B] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-[#11161B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.watch.id, 1)}
                          className="px-2.5 py-1 hover:bg-[#EAE4D9] text-[#11161B] transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.watch.id)}
                        className="text-[#5C646D] hover:text-red-700 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & WhatsApp Checkout Box */}
            <div className="md:col-span-5 bg-[#F8F5EE] border border-[#D8D1C5] p-6 space-y-5">
              <h2 className="font-mono text-xs font-bold tracking-[0.18em] uppercase text-[#11161B] pb-3 border-b border-[#D8D1C5]">
                ORDER SUMMARY
              </h2>

              <div className="space-y-2.5 font-mono text-xs text-[#5C646D]">
                <div className="flex justify-between">
                  <span>ITEMS SUB-TOTAL</span>
                  <span className="font-bold text-[#11161B]">₹ {subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>INSURED ALL-INDIA SHIPPING</span>
                  <span className="font-bold text-[#C85A17]">COMPLIMENTARY</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8D1C5] flex justify-between items-baseline font-mono">
                <span className="text-xs font-bold uppercase tracking-wider text-[#11161B]">TOTAL PAYABLE</span>
                <span className="text-2xl font-black text-[#11161B]">₹ {total.toLocaleString("en-IN")}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 px-6 bg-[#C85A17] hover:bg-[#B34E12] text-white font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C85A17]/20"
              >
                <MessageCircle className="w-5 h-5" />
                <span>CHECKOUT VIA WHATSAPP</span>
              </button>

              <div className="font-mono text-[10px] text-[#5C646D] leading-relaxed pt-2 space-y-1">
                <p>✓ Instant confirmation with our Chennai horology desk.</p>
                <p>✓ Tracked dispatch with continuous video unboxing warranty.</p>
                <p>✓ 7-Day Replacement Policy for mechanical defects.</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
