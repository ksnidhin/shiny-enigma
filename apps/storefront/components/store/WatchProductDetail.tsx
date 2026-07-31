"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { WatchProduct } from "@/lib/api"
import { ShieldCheck, Truck, Clock, Award, Check, Heart, Share2, AlertCircle, ArrowRight, RefreshCw, Star, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface WatchProductDetailProps {
  watch: WatchProduct;
  related: WatchProduct[];
}

export function WatchProductDetail({ watch, related }: WatchProductDetailProps) {
  const [activeImage, setActiveImage] = React.useState<string>(watch.image || "/hero_vintage_watch_1785170825322.jpg")
  const [activeTab, setActiveTab] = React.useState<"specs" | "authenticity" | "service" | "shipping">("specs")
  const [isAdded, setIsAdded] = React.useState<boolean>(false)
  const [isReserved, setIsReserved] = React.useState<boolean>(false)

  const handleBuyNowWhatsApp = () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Hi RetroTimeCo! I'm interested to buy the specific watch:\n\n*${watch.name}*\nRef: ${watch.reference_number}\nPrice: Rs. ${watch.price.toLocaleString("en-IN")}\nLink: ${pageUrl}\n\nPlease let me know how to proceed with payment and ready-to-ship delivery!`;
    window.open(`https://wa.me/919171988875?text=${encodeURIComponent(text)}`, "_blank");
  }

  const handleAddToCart = () => {
    handleBuyNowWhatsApp();
  }

  const handleReserve = () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Hi RetroTimeCo! I would like to reserve this piece for 24 hours:\n\n*${watch.name}* (Ref: ${watch.reference_number})\nLink: ${pageUrl}`;
    window.open(`https://wa.me/919171988875?text=${encodeURIComponent(text)}`, "_blank");
  }

  const handlePrevImage = () => {
    if (!watch.gallery_images || watch.gallery_images.length <= 1) return;
    const currentIndex = watch.gallery_images.indexOf(activeImage);
    const prevIndex = currentIndex === 0 ? watch.gallery_images.length - 1 : currentIndex - 1;
    setActiveImage(watch.gallery_images[prevIndex]);
  }

  const handleNextImage = () => {
    if (!watch.gallery_images || watch.gallery_images.length <= 1) return;
    const currentIndex = watch.gallery_images.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % watch.gallery_images.length;
    setActiveImage(watch.gallery_images[nextIndex]);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-8">
        <Link href="/" className="hover:text-[var(--color-brand)]">Home</Link>
        <span>/</span>
        <Link href={`/collections/${watch.collection}`} className="hover:text-[var(--color-brand)]">{watch.collection_title}</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)] font-bold truncate max-w-[200px] sm:max-w-none">{watch.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Photography Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="group relative h-[450px] sm:h-[600px] w-full bg-[#EAE4DB] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-custom)]">
            <Image
              src={activeImage}
              alt={watch.name}
              fill
              className="object-cover object-center transition-all duration-500"
              priority
            />
            {watch.badge && watch.in_stock && (
              <span className="absolute top-4 left-4 bg-[var(--color-brand)] text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">
                {watch.badge}
              </span>
            )}
            {!watch.in_stock && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">
                Sold Out
              </span>
            )}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => {}} 
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:text-red-500 flex items-center justify-center shadow-md transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {}} 
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:text-blue-600 flex items-center justify-center shadow-md transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            {watch.gallery_images && watch.gallery_images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-800 shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-800 shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {watch.gallery_images && watch.gallery_images.length > 1 && (
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {watch.gallery_images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-24 w-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? "border-[var(--color-brand)] shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${watch.name} thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees Banner below image */}
          <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-white border border-[var(--color-border)] text-center shadow-sm">
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-6 h-6 text-[var(--color-brand)]" />
              <span className="text-xs font-bold uppercase tracking-wider">100% Authentic</span>
              <span className="text-[10px] text-[var(--color-text-secondary)]">Inspected by Master Horologists</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-x border-black/5 px-2">
              <Truck className="w-6 h-6 text-[var(--color-brand)]" />
              <span className="text-xs font-bold uppercase tracking-wider">Free Express Delivery</span>
              <span className="text-[10px] text-[var(--color-text-secondary)]">Insured Shipping Across India</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Clock className="w-6 h-6 text-[var(--color-brand)]" />
              <span className="text-xs font-bold uppercase tracking-wider">Serviced & Regulated</span>
              <span className="text-[10px] text-[var(--color-text-secondary)]">Chennai Workshop Certified</span>
            </div>
          </div>
        </div>

        {/* Right: Watch Identity & Purchase Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-6 bg-white p-8 rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-custom)]">
          <div>
            <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-[var(--color-accent)] mb-2">
              <span>{watch.brand}</span>
              <span>Ref: {watch.reference_number}</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
              {watch.name}
            </h1>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[var(--color-bg-primary)] font-semibold text-[var(--color-text-primary)]">
                {watch.era_label}
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{watch.rating} ({watch.reviews_count} reviews)</span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[var(--color-border)] flex items-center justify-between">
            <div>
              <span className="text-xs text-[var(--color-text-secondary)] block uppercase font-bold tracking-wider">Price (All-Inclusive)</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-heading text-3xl font-extrabold text-[var(--color-brand)]">
                  Rs. {watch.price.toLocaleString("en-IN")}
                </span>
                {watch.original_price && (
                  <span className="text-sm text-[var(--color-text-secondary)] line-through">
                    Rs. {watch.original_price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Condition Highlight Box */}
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-primary)]">Horologist Condition Report</span>
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-white text-xs leading-relaxed text-[var(--color-text-secondary)] font-medium">
              <div className="font-bold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />
                <span>Grade: {watch.condition_label}</span>
              </div>
              {watch.condition_notes}
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="space-y-3 pt-2">
            {watch.in_stock ? (
              <>
                <button
                  onClick={handleBuyNowWhatsApp}
                  className="w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-sm shadow-lg transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Buy Now via WhatsApp — Rs. {watch.price.toLocaleString("en-IN")}</span>
                </button>

                <button
                  onClick={handleReserve}
                  className="w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-xs border-2 border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire / Reserve via WhatsApp (24h Hold)</span>
                </button>

                <p className="text-[11px] text-center text-[var(--color-text-secondary)] font-medium">
                  ✨ Ready to Ship Today — Insured Express All-India Delivery by RetroTimeCo Chennai.
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
                    const text = `Hi RetroTimeCo! I noticed this watch is sold out:\n\n*${watch.name}* (Ref: ${watch.reference_number})\nLink: ${pageUrl}\n\nCould you please help me source a similar piece?`;
                    window.open(`https://wa.me/919171988875?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-sm shadow-lg transition-all flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white shadow-gray-600/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Sold Out - Contact for Sourcing</span>
                </button>
                <p className="text-[11px] text-center text-[var(--color-text-secondary)] font-medium">
                  This piece has been acquired by a collector. We can help source a similar timepiece.
                </p>
              </>
            )}
          </div>

          {/* Tabbed Specifications & Verification Report */}
          <div className="pt-6 border-t border-black/5 space-y-4">
            <div className="flex border-b border-[var(--color-border)]">
              {[
                { id: "specs", label: "Horological Specs" },
                { id: "authenticity", label: "Authenticity Certificate" },
                { id: "service", label: "Service History" },
                { id: "shipping", label: "Shipping & Returns" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-2 px-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[var(--color-brand)] text-[var(--color-brand)]"
                      : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "specs" && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 py-1.5 border-b border-black/5">
                  <span className="text-[var(--color-text-secondary)] font-medium">Movement Caliber</span>
                  <span className="font-bold text-[var(--color-text-primary)] text-right">{watch.specs.movement_caliber}</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-black/5">
                  <span className="text-[var(--color-text-secondary)] font-medium">Case Material</span>
                  <span className="font-bold text-[var(--color-text-primary)] text-right">{watch.specs.case_material}</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-black/5">
                  <span className="text-[var(--color-text-secondary)] font-medium">Case Diameter / Lug Width</span>
                  <span className="font-bold text-[var(--color-text-primary)] text-right">{watch.specs.case_size_mm}mm / {watch.specs.lug_width_mm}mm</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-black/5">
                  <span className="text-[var(--color-text-secondary)] font-medium">Crystal Type</span>
                  <span className="font-bold text-[var(--color-text-primary)] text-right capitalize">{watch.specs.crystal_type} Crystal</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-black/5">
                  <span className="text-[var(--color-text-secondary)] font-medium">Measured Accuracy</span>
                  <span className="font-bold text-emerald-700 text-right">{watch.specs.measured_accuracy_sec_per_day}</span>
                </div>
                <div className="grid grid-cols-2 py-1.5">
                  <span className="text-[var(--color-text-secondary)] font-medium">Water Resistance</span>
                  <span className="font-bold text-[var(--color-text-primary)] text-right">{watch.specs.water_resistance}</span>
                </div>
              </div>
            )}

            {activeTab === "authenticity" && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <span>100% Guaranteed Genuine Horology</span>
                </div>
                <p className="leading-relaxed font-light">
                  This timepiece has been physically inspected, opened, and verified under magnification by our senior watchmakers in Chennai. All case serial numbers, movement stamps, and dial fonts conform to original factory specifications.
                </p>
                <div className="pt-2 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 text-emerald-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>Backed by RetroTimeCo Lifetime Authenticity Pledge</span>
                </div>
              </div>
            )}

            {activeTab === "service" && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2 text-amber-950">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <RefreshCw className="w-5 h-5 text-amber-700" />
                  <span>In-House Horological Regulation</span>
                </div>
                <p className="leading-relaxed font-light">
                  {watch.service_history}
                </p>
                <div className="pt-2 font-bold text-[11px] uppercase tracking-wider text-amber-800">
                  ⚡ Backed by our 7-Day Replacement Guarantee (See shipping & returns tab).
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-2 text-blue-950">
                <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
                  <Truck className="w-5 h-5 text-blue-700" />
                  <span>India Post &amp; Express Couriers</span>
                </div>
                <p className="leading-relaxed font-light">
                  We deliver via government-verified <strong>India Post (Speed Post / Registered Post)</strong> as well as priority courier partners including <strong>Blue Dart, DTDC, Delhivery, Ecom Express, and XpressBees</strong> across 28,000+ Indian PIN codes.
                </p>
                <div className="pt-2 font-bold text-[11px] uppercase tracking-wider text-blue-800 space-y-1">
                  <div>✅ 7-Day Replacement Policy for transit damage or mechanical defects.</div>
                  <div className="text-red-700">⚠️ Strict No-Refund Policy (See Return Policy for details).</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description & Brand Story */}
      <div className="mt-16 bg-white p-8 md:p-12 rounded-3xl border border-[var(--color-border)] shadow-sm space-y-4">
        <span className="text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase">Horological Archive Notes</span>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
          The Craftsmanship & Heritage of the {watch.name}
        </h2>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed font-light max-w-4xl">
          {watch.description}
        </p>
      </div>

      {/* Related Products Showcase */}
      {related && related.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase block mb-1">More from this collection</span>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-text-primary)]">
                Related Timepieces
              </h2>
            </div>
            <Link href={`/collections/${watch.collection}`} className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand)] hover:underline flex items-center gap-1">
              <span>View All ({watch.collection_title})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-custom)] hover:shadow-2xl transition-all duration-500 flex flex-col group"
              >
                <Link href={`/products/${item.slug}`} className="relative h-56 w-full bg-[#EAE4DB] overflow-hidden block">
                  <Image src={item.image || "/hero_vintage_watch_1785170825322.jpg"} alt={item.name || "Watch"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {item.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-[var(--color-brand)] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </Link>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--color-accent)] uppercase">{item.brand}</span>
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[var(--color-text-primary)]">Rs. {item.price.toLocaleString("en-IN")}</span>
                    <Link href={`/products/${item.slug}`} className="px-3 py-1 bg-[var(--color-bg-primary)] group-hover:bg-[var(--color-brand)] text-[var(--color-text-primary)] group-hover:text-white text-[11px] font-bold uppercase rounded-lg transition-colors">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
