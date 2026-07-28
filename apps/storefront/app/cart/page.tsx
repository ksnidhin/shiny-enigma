"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { LOCAL_WATCH_CATALOG, WatchProduct } from "@/lib/api"
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck, Lock, Check, Tag, MessageCircle } from "lucide-react"

interface CartItem {
  watch: WatchProduct;
  quantity: number;
}

export default function CartPage() {
  // Initialize with curated watches if available, otherwise empty cart
  const [items, setItems] = React.useState<CartItem[]>(
    LOCAL_WATCH_CATALOG.length >= 2
      ? [
          { watch: LOCAL_WATCH_CATALOG[0]!, quantity: 1 },
          { watch: LOCAL_WATCH_CATALOG[1]!, quantity: 1 },
        ]
      : []
  )
  const [promoCode, setPromoCode] = React.useState<string>("")
  const [discountApplied, setDiscountApplied] = React.useState<boolean>(true)
  const [isCheckingOut, setIsCheckingOut] = React.useState<boolean>(false)

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.watch?.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.watch?.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + (item.watch?.price || 0) * item.quantity, 0)
  const shipping = subtotal >= 4999 || discountApplied || subtotal === 0 ? 0 : 350
  const total = subtotal + shipping

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleCheckout = () => {
    const itemList = items.map(item => `• ${item.watch?.name || "Timepiece"} (Qty: ${item.quantity}) - Rs. ${((item.watch?.price || 0) * item.quantity).toLocaleString("en-IN")}`).join("\n");
    const text = `Hi RetroTimeCo! I'm ready to buy the following items from my cart:\n\n${itemList}\n\n*Total Amount: Rs. ${total.toLocaleString("en-IN")}*\n\nPlease let me know how to proceed with payment and ready-to-ship delivery!`;
    window.open(`https://wa.me/919171988875?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-[var(--color-brand)]" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
            Your Shopping Bag
          </h1>
          <span className="text-xs font-bold px-3 py-1 bg-[var(--color-brand)] text-white rounded-full">
            {items.length} {items.length === 1 ? "Timepiece" : "Timepieces"}
          </span>
        </div>

        {/* Free Shipping Unlock Banner */}
        <div className="bg-[#173528] text-white p-4 rounded-2xl mb-8 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                🎉 FREE Insured Express Shipping Sourced &amp; Verified by RetroTimeCo Mumbai!
              </p>
              <p className="text-[11px] text-white/80">
                All-India delivery ready to ship within 24 hours.
              </p>
            </div>
          </div>
          <Link href="/collections/all" className="hidden sm:inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-colors">
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[var(--color-border)] p-16 text-center space-y-6 max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center text-[var(--color-brand)] mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-heading text-3xl font-bold">Your bag is currently empty</h2>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
              Discover our curated archive of rare Japanese &amp; Swiss vintage timepieces, new Casio releases, and horological accessories.
            </p>
            <Link 
              href="/collections/all"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              <span>Explore All Timepieces (320+)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {items.map(({ watch, quantity }) => (
                <div 
                  key={watch.id}
                  className="bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Link href={`/products/${watch.slug}`} className="relative h-24 w-24 rounded-xl overflow-hidden bg-[#EAE4DB] flex-shrink-0 border border-black/5">
                      <Image src={watch.image} alt={watch.name} fill className="object-cover" />
                    </Link>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">{watch.brand}</span>
                      <Link href={`/products/${watch.slug}`}>
                        <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] hover:text-[var(--color-brand)] transition-colors line-clamp-1">
                          {watch.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{watch.condition_label}</p>
                      <span className="text-sm font-extrabold text-[var(--color-text-primary)] mt-2 block sm:hidden">
                        Rs. {(watch.price * quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-black/5">
                    <div className="flex items-center border border-[var(--color-border)] rounded-xl bg-[var(--color-bg-primary)]">
                      <button 
                        onClick={() => updateQuantity(watch.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[var(--color-text-primary)] hover:bg-gray-200 rounded-l-xl transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                      <button 
                        onClick={() => updateQuantity(watch.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[var(--color-text-primary)] hover:bg-gray-200 rounded-r-xl transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-base font-extrabold text-[var(--color-text-primary)] block">
                        Rs. {(watch.price * quantity).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-secondary)]">Rs. {watch.price.toLocaleString("en-IN")} each</span>
                    </div>

                    <button 
                      onClick={() => removeItem(watch.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] font-medium">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-brand)]" />
                  <span>Every watch is backed by our <strong>100% Lifetime Authenticity Pledge</strong> and 7-day inspection guarantee.</span>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Checkout */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-custom)] space-y-6">
              <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] pb-4 border-b border-black/5">
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs font-medium text-[var(--color-text-secondary)] pt-2">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-bold text-[var(--color-text-primary)]">Rs. {subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span className="font-bold text-emerald-700">{shipping === 0 ? "FREE (Rs. 350 waived)" : "Rs. " + shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST &amp; Duties</span>
                  <span className="font-bold text-[var(--color-text-primary)]">Included</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-black/10 text-base font-extrabold text-[var(--color-text-primary)]">
                  <span>Total Amount</span>
                  <span className="text-[var(--color-brand)]">Rs. {total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <span>Connecting to All-India Gateway...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Secure Checkout — Rs. {total.toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>

              {/* Payment Methods & Assurances */}
              <div className="pt-4 border-t border-black/5 text-center space-y-3">
                <p className="text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
                  Guaranteed All-India Secure Checkout
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-[var(--color-text-secondary)]">
                  <span className="px-2.5 py-1 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border)]">UPI / GPay / PhonePe</span>
                  <span className="px-2.5 py-1 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border)]">Visa / MasterCard</span>
                  <span className="px-2.5 py-1 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border)]">NetBanking</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
