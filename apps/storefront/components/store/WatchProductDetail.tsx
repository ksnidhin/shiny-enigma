"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { WatchProduct } from "@/lib/api"
import { 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Star, 
  MessageCircle, 
  ArrowRight, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Bookmark,
  Maximize2,
  X
} from "lucide-react"
import { isSaved, toggleSaved } from "@/lib/wishlist"

interface WatchProductDetailProps {
  watch: WatchProduct;
  related: WatchProduct[];
}

export function WatchProductDetail({ watch, related }: WatchProductDetailProps) {
  // Gallery setup
  const gallery = React.useMemo(() => {
    const list = watch.gallery_images && watch.gallery_images.length > 0 
      ? [...watch.gallery_images] 
      : [watch.image || "/hero_vintage_watch_1785170825322.jpg"]
    // Ensure primary image is at start if not present
    if (watch.image && !list.includes(watch.image)) {
      list.unshift(watch.image)
    }
    return list.filter(Boolean)
  }, [watch.gallery_images, watch.image])

  const [activeImageIndex, setActiveImageIndex] = React.useState<number>(0)
  const [saved, setSaved] = React.useState<boolean>(false)

  // Fullscreen Viewer state
  const [viewerOpen, setViewerOpen] = React.useState<boolean>(false)
  const [viewerIndex, setViewerIndex] = React.useState<number>(0)
  const touchStartX = React.useRef<number | null>(null)

  React.useEffect(() => {
    setSaved(isSaved(watch.id))
    const handler = () => setSaved(isSaved(watch.id))
    window.addEventListener("rtc_saved_updated", handler)
    return () => window.removeEventListener("rtc_saved_updated", handler)
  }, [watch.id])

  const handleToggleBookmark = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const nowSaved = toggleSaved(watch.id)
    setSaved(nowSaved)
  }

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setActiveImageIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1))
  }

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setActiveImageIndex(prev => (prev + 1) % gallery.length)
  }

  // Fullscreen viewer navigation handlers
  const handleViewerPrev = () => {
    setViewerIndex(prev => {
      const newIdx = prev === 0 ? gallery.length - 1 : prev - 1
      setActiveImageIndex(newIdx)
      return newIdx
    })
  }

  const handleViewerNext = () => {
    setViewerIndex(prev => {
      const newIdx = (prev + 1) % gallery.length
      setActiveImageIndex(newIdx)
      return newIdx
    })
  }

  const openViewerAt = (idx: number) => {
    setActiveImageIndex(idx)
    setViewerIndex(idx)
    setViewerOpen(true)
  }

  // Keyboard navigation & body scroll locking for fullscreen viewer
  React.useEffect(() => {
    if (!viewerOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setViewerOpen(false)
      } else if (e.key === "ArrowLeft") {
        handleViewerPrev()
      } else if (e.key === "ArrowRight") {
        handleViewerNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [viewerOpen, gallery.length])

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleViewerNext()
      } else {
        handleViewerPrev()
      }
    }
    touchStartX.current = null
  }

  // WhatsApp Actions matching existing business rules (active for in_stock watches only)
  const handleBuyNowWhatsApp = () => {
    const pageUrl = typeof window !== "undefined" ? window.location.href : ""
    const text = `Hi RetroTimeCo! I'm interested to buy this timepiece:\n\n*${watch.name}*\nRef: ${watch.reference_number || "Vintage"}\nPrice: Rs. ${watch.price.toLocaleString("en-IN")}\nLink: ${pageUrl}\n\nPlease let me know how to proceed with payment and ready-to-ship delivery!`
    window.open(`https://wa.me/919171988875?text=${encodeURIComponent(text)}`, "_blank")
  }

  const handleReserveWhatsApp = () => {
    const pageUrl = typeof window !== "undefined" ? window.location.href : ""
    const text = `Hi RetroTimeCo! I would like to reserve this piece for 24 hours:\n\n*${watch.name}* (Ref: ${watch.reference_number || "Vintage"})\nPrice: Rs. ${watch.price.toLocaleString("en-IN")}\nLink: ${pageUrl}`
    window.open(`https://wa.me/919171988875?text=${encodeURIComponent(text)}`, "_blank")
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (navigator.share) {
      try {
        await navigator.share({
          title: watch.name,
          text: `Vintage Timepiece: ${watch.name} at RetroTimeCo`,
          url,
        })
      } catch {}
    } else {
      navigator.clipboard.writeText(url)
      alert("Timepiece link copied to clipboard.")
    }
  }

  const activeImage = gallery[activeImageIndex] || watch.image || "/hero_vintage_watch_1785170825322.jpg"
  const slideNumFormatted = String(activeImageIndex + 1).padStart(2, "0")
  const totalNumFormatted = String(gallery.length).padStart(2, "0")

  // Condition Grade formatting
  const conditionGradeDisplay = (watch.condition_label || watch.condition_grade || "EXCELLENT WORKING CONDITION").toUpperCase()
  const checkedFunctions = watch.condition_notes 
    ? watch.condition_notes 
    : "Chronograph / Escapement regulation / Amplitude checked / Timegrapher verified"

  return (
    <div className="min-h-screen bg-[#F4EFE6] py-6 sm:py-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
        
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-wider text-[#5C646D] mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#11161B] transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/collections/all" className="hover:text-[#11161B] transition-colors">THE ARCHIVE</Link>
          <span>/</span>
          <Link href={`/collections/${watch.collection}`} className="hover:text-[#11161B] transition-colors uppercase">
            {watch.brand || watch.collection_title || "TIMEPIECES"}
          </Link>
        </nav>

        {/* 2. Photography Showcase (Hero Image + Fullscreen Trigger + Thumbnails) */}
        <div className="space-y-4 mb-8">
          <div 
            onClick={() => openViewerAt(activeImageIndex)}
            className="relative aspect-4/3 sm:aspect-16/10 w-full bg-[#16212E] border border-[#D8D1C5] overflow-hidden group cursor-zoom-in"
            title="Click to view full screen photograph"
          >
            <Image
              src={activeImage}
              alt={watch.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover object-center transition-all duration-300 group-hover:scale-102"
            />

            {/* Subtle Zoom Indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#0E1620]/80 backdrop-blur-xs px-2.5 py-1 text-white/90 font-mono text-[11px] border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5 text-[#C85A17]" />
              <span className="hidden sm:inline">FULLSCREEN</span>
            </div>

            {/* Slide Index Counter & Dash Pagination */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 bg-[#0E1620]/80 backdrop-blur-xs px-3 py-1.5 border border-white/10 text-white font-mono text-xs">
              <span className="font-bold tracking-wider">
                {slideNumFormatted} / {totalNumFormatted}
              </span>
              <div className="flex items-center gap-1">
                {gallery.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-[2px] transition-all duration-200 ${
                      idx === activeImageIndex ? "w-6 bg-[#C85A17]" : "w-2.5 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Share & Bookmark Floating Icons */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <button
                onClick={handleToggleBookmark}
                aria-label={saved ? "Remove from saved" : "Save timepiece"}
                className={`p-2.5 rounded-sm backdrop-blur-xs transition-colors shadow-md ${
                  saved ? "bg-[#C85A17] text-white" : "bg-white/80 text-[#0E1622] hover:bg-white"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share timepiece"
                className="p-2.5 rounded-sm bg-white/80 text-[#0E1622] hover:bg-white backdrop-blur-xs transition-colors shadow-md"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Prev / Next Chevrons on Hover */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Previous photograph"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-[#0E1620]/70 hover:bg-[#0E1620] text-white transition-opacity opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  aria-label="Next photograph"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#0E1620]/70 hover:bg-[#0E1620] text-white transition-opacity opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Horizontal Thumbnails Carousel — Clicking opens fullscreen at that photo */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => openViewerAt(idx)}
                  aria-label={`View photo ${idx + 1} in fullscreen`}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#EAE4DB] overflow-hidden border transition-all cursor-zoom-in ${
                    idx === activeImageIndex
                      ? "border-2 border-[#C85A17] scale-102"
                      : "border-[#D8D1C5] opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image src={imgUrl} alt={`${watch.name} detail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Title & Horological Identity Header */}
        <div className="space-y-3 mb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-[#5C646D]">
            RTC  /  ARCHIVE OBJECT {watch.reference_number || "VNTG-SPEC"}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#11161B] leading-tight">
            {watch.name}
          </h1>

          <div className="font-mono text-xs sm:text-sm text-[#5C646D] flex flex-wrap items-center gap-2">
            <span>{watch.era_label || "Vintage Era"}</span>
            <span>•</span>
            <span>{watch.brand}</span>
            <span>•</span>
            <span>{watch.specs?.movement_caliber ? `Calibre ${watch.specs.movement_caliber}` : watch.model_name}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[#5C646D]">
            <div className="flex text-[#C85A17]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C85A17]" />
              ))}
            </div>
            <span className="font-bold text-[#11161B]">{watch.rating || 5.0}</span>
            <span>({watch.reviews_count || 1} review)</span>
          </div>
        </div>

        {/* 4. Price & SOLD Indicator Strip (Clean Tasteful SOLD Badge) */}
        <div className="flex flex-wrap items-center gap-4 py-4 mb-6 border-y border-[#D8D1C5]">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-[#11161B]">
              ₹ {watch.price.toLocaleString("en-IN")}
            </span>
            {watch.original_price && (
              <span className="font-mono text-sm text-[#5C646D] line-through">
                (₹ {watch.original_price.toLocaleString("en-IN")})
              </span>
            )}
          </div>

          {!watch.in_stock ? (
            <span className="bg-[#0E1620] text-white font-mono text-xs font-bold tracking-widest px-3 py-1 uppercase border border-[#D8D1C5]/30">
              SOLD
            </span>
          ) : (
            <>
              <div className="hidden sm:block text-[#D8D1C5]">|</div>
              <span className="font-mono text-xs font-bold tracking-wider text-[#11161B] uppercase border-b-2 border-[#C85A17] pb-0.5">
                PRICE INCLUDES SHIPPING
              </span>
            </>
          )}
        </div>

        {/* 5. HOROLOGIST CONDITION REPORT */}
        <div className="mb-6 border border-[#0E1620] overflow-hidden">
          <div className="bg-[#0E1620] text-white px-4 py-2.5 font-mono text-xs font-bold tracking-[0.18em] uppercase">
            HOROLOGIST CONDITION REPORT
          </div>
          <div className="bg-[#ECE5DA] divide-y divide-[#D8D1C5] font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 sm:py-3 gap-1 sm:gap-4">
              <span className="sm:col-span-4 text-[#5C646D] font-bold uppercase tracking-wider">
                GRADE
              </span>
              <span className="sm:col-span-8 text-[#C85A17] font-bold uppercase tracking-wider">
                {conditionGradeDisplay}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:px-4 sm:py-3 gap-1 sm:gap-4">
              <span className="sm:col-span-4 text-[#5C646D] font-bold uppercase tracking-wider">
                CHECKED FUNCTIONS
              </span>
              <span className="sm:col-span-8 text-[#11161B] leading-relaxed">
                {checkedFunctions}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Primary Action Buttons — ONLY rendered for in-stock watches (no buttons or marketing CTAs for sold items) */}
        {watch.in_stock && (
          <div className="space-y-3 mb-8">
            <button
              onClick={handleBuyNowWhatsApp}
              className="w-full py-4 px-6 bg-[#C85A17] hover:bg-[#B34E12] text-white font-mono text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C85A17]/20"
            >
              <MessageCircle className="w-5 h-5" />
              <span>BUY VIA WHATSAPP — ₹ {watch.price.toLocaleString("en-IN")}</span>
            </button>

            <button
              onClick={handleReserveWhatsApp}
              className="w-full py-3.5 px-6 bg-[#F4EFE6] hover:bg-[#EAE4D9] text-[#0E1622] border-2 border-[#0E1622] font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>INQUIRE / RESERVE • 24H HOLD</span>
            </button>
          </div>
        )}

        {/* 7. Trust Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D8D1C5] border-y border-[#D8D1C5] py-4 mb-10 text-center">
          <div className="flex flex-col items-center gap-1.5 py-2 px-3">
            <ShieldCheck className="w-5 h-5 text-[#C85A17]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#11161B]">
              AUTHENTICITY INSPECTED
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 py-2 px-3">
            <Truck className="w-5 h-5 text-[#C85A17]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#11161B]">
              INSURED INDIA-WIDE DELIVERY
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 py-2 px-3">
            <Wrench className="w-5 h-5 text-[#C85A17]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#11161B]">
              WORKSHOP SERVICED &amp; REGULATED
            </span>
          </div>
        </div>

        {/* 8. HOROLOGICAL SPECIFICATIONS */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-mono font-bold text-[#C85A17]">/</span>
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#11161B]">
              HOROLOGICAL SPECIFICATIONS
            </h2>
          </div>

          <div className="border-t border-[#D8D1C5] divide-y divide-[#D8D1C5] font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 py-2.5">
              <span className="sm:col-span-5 text-[#5C646D] font-bold uppercase tracking-wider">
                MOVEMENT CALIBRE
              </span>
              <span className="sm:col-span-7 text-[#11161B] font-medium">
                {watch.specs?.movement_caliber || watch.reference_number || "Mechanical"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 py-2.5">
              <span className="sm:col-span-5 text-[#5C646D] font-bold uppercase tracking-wider">
                CASE MATERIAL
              </span>
              <span className="sm:col-span-7 text-[#11161B] font-medium">
                {watch.specs?.case_material || "Stainless Steel"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 py-2.5">
              <span className="sm:col-span-5 text-[#5C646D] font-bold uppercase tracking-wider">
                CASE DIAMETER
              </span>
              <span className="sm:col-span-7 text-[#11161B] font-medium">
                {watch.specs?.case_size_mm ? `${watch.specs.case_size_mm} mm` : "37 mm"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 py-2.5">
              <span className="sm:col-span-5 text-[#5C646D] font-bold uppercase tracking-wider">
                LUG WIDTH
              </span>
              <span className="sm:col-span-7 text-[#11161B] font-medium">
                {watch.specs?.lug_width_mm ? `${watch.specs.lug_width_mm} mm` : "18 mm"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 py-2.5">
              <span className="sm:col-span-5 text-[#5C646D] font-bold uppercase tracking-wider">
                CRYSTAL
              </span>
              <span className="sm:col-span-7 text-[#11161B] font-medium capitalize">
                {watch.specs?.crystal_type ? `${watch.specs.crystal_type} Glass` : "Mineral Glass"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 py-2.5">
              <span className="sm:col-span-5 text-[#5C646D] font-bold uppercase tracking-wider">
                MEASURED ACCURACY
              </span>
              <span className="sm:col-span-7 text-[#11161B] font-medium">
                {watch.specs?.measured_accuracy_sec_per_day || "Regulated / Accurate"}
              </span>
            </div>
          </div>
        </div>

        {/* 9. HOROLOGICAL ARCHIVE NOTES */}
        <div className="mb-12 pb-10 border-b border-[#D8D1C5]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-mono font-bold text-[#C85A17]">/</span>
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#11161B]">
              HOROLOGICAL ARCHIVE NOTES
            </h2>
          </div>
          <p className="text-sm text-[#5C646D] leading-relaxed font-light">
            {watch.description || "Curated vintage timepiece from RetroTimeCo Horological Archive. Inspected and regulated."}
          </p>
          {watch.service_history && (
            <div className="mt-3 p-3 bg-[#EAE4D9] border border-[#D8D1C5] font-mono text-xs text-[#5C646D]">
              <strong>Service Record: </strong>{watch.service_history}
            </div>
          )}
        </div>

        {/* 10. MORE FROM THE ARCHIVE */}
        {related && related.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-bold text-[#C85A17]">/</span>
                <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#11161B]">
                  MORE FROM THE ARCHIVE
                </h2>
              </div>
              <Link
                href={`/collections/${watch.collection}`}
                className="font-mono text-xs font-bold uppercase tracking-wider text-[#11161B] hover:text-[#C85A17] flex items-center gap-1 transition-colors"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {related.slice(0, 4).map((item) => (
                <div key={item.id} className="bg-[#F8F5EE] border border-[#D8D1C5] flex flex-col justify-between">
                  <Link href={`/products/${item.slug}`} className="relative aspect-square w-full bg-[#EAE4DB] block overflow-hidden">
                    <Image
                      src={item.image || "/hero_vintage_watch_1785170825322.jpg"}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {!item.in_stock && (
                      <div className="absolute top-2 left-2 z-10 pointer-events-none">
                        <span className="bg-[#0E1620] text-white border border-[#D8D1C5]/40 text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 uppercase shadow-sm">
                          SOLD
                        </span>
                      </div>
                    )}
                  </Link>
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-heading text-sm sm:text-base font-bold text-[#11161B] hover:text-[#C85A17] line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="font-mono text-[10px] text-[#5C646D] mt-0.5 line-clamp-1">
                        c. {item.era_label || "Vintage"}  /  Ref. {item.reference_number || item.brand}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#D8D1C5] flex items-center justify-between">
                      <span className="font-mono text-sm sm:text-base font-bold text-[#11161B]">
                        ₹ {item.price.toLocaleString("en-IN")}
                      </span>
                      {!item.in_stock ? (
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#8E9BA8]">
                          SOLD
                        </span>
                      ) : (
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#C85A17] hover:text-[#11161B] flex items-center gap-0.5"
                        >
                          <span>VIEW PIECE</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FULLSCREEN IMAGE VIEWER MODAL */}
      {viewerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0A0E14]/98 backdrop-blur-md flex flex-col justify-between select-none"
          onClick={() => setViewerOpen(false)}
        >
          {/* Top Bar: Slide Counter & Close Button */}
          <div className="flex items-center justify-between p-4 sm:p-6 text-white z-60" onClick={(e) => e.stopPropagation()}>
            <div className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#D8D1C5] bg-[#0E1620] px-3 py-1.5 border border-white/10">
              {String(viewerIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
            </div>
            <button
              onClick={() => setViewerOpen(false)}
              aria-label="Close fullscreen image viewer"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Center Image Stage with Touch Swipes */}
          <div 
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Prev Button */}
            {gallery.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleViewerPrev(); }}
                aria-label="Previous photograph"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-[#0E1620]/80 hover:bg-[#C85A17] text-white transition-colors z-60 cursor-pointer shadow-lg border border-white/20"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            {/* High-Resolution Centered Image (never cropped) */}
            <div className="relative max-h-[82vh] max-w-[92vw] h-full w-full flex items-center justify-center pointer-events-none">
              <img
                src={gallery[viewerIndex]}
                alt={`${watch.name} photograph ${viewerIndex + 1}`}
                className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain shadow-2xl transition-all duration-200 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Next Button */}
            {gallery.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleViewerNext(); }}
                aria-label="Next photograph"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-[#0E1620]/80 hover:bg-[#C85A17] text-white transition-colors z-60 cursor-pointer shadow-lg border border-white/20"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip (if multi-photo) */}
          {gallery.length > 1 && (
            <div className="p-3 sm:p-4 flex items-center justify-center gap-2 overflow-x-auto z-60" onClick={(e) => e.stopPropagation()}>
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => { setViewerIndex(idx); setActiveImageIndex(idx); }}
                  aria-label={`Jump to photo ${idx + 1}`}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-black/40 border transition-all cursor-pointer ${
                    idx === viewerIndex ? "border-2 border-[#C85A17] scale-105" : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
