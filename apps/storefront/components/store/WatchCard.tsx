"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { WatchProduct } from "@/lib/api"
import { Bookmark } from "lucide-react"
import { isSaved, toggleSaved } from "@/lib/wishlist"

export function WatchCard({ watch }: { watch: WatchProduct }) {
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    setSaved(isSaved(watch.id))
    const handler = () => setSaved(isSaved(watch.id))
    window.addEventListener("rtc_saved_updated", handler)
    return () => window.removeEventListener("rtc_saved_updated", handler)
  }, [watch.id])

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const nowSaved = toggleSaved(watch.id)
    setSaved(nowSaved)
  }

  // Format era & reference text e.g. "c. 1970s / Ref. 7009"
  const eraText = watch.era_label ? (watch.era_label.startsWith("c.") ? watch.era_label : `c. ${watch.era_label}`) : "Vintage Era"
  const refText = watch.reference_number ? `Ref. ${watch.reference_number}` : watch.brand
  const metaLine = `${eraText}  /  ${refText}`

  return (
    <div className="group relative bg-[#F8F5EE] border border-[#D8D1C5] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#0E1622] hover:shadow-md">
      {/* Top Image Showcase */}
      <div className="relative aspect-square w-full bg-[#EAE4DB] overflow-hidden">
        <Link href={`/products/${watch.slug}`} className="block w-full h-full">
          <Image
            src={watch.image || (watch.gallery_images && watch.gallery_images[0]) || "/hero_vintage_watch_1785170825322.jpg"}
            alt={watch.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Wishlist Bookmark Button (Top-Right) */}
        <button
          onClick={handleToggleBookmark}
          aria-label={saved ? "Remove from saved" : "Save timepiece"}
          className={`absolute top-2.5 right-2.5 p-2 rounded-sm backdrop-blur-xs transition-colors z-10 ${
            saved
              ? "bg-[#C85A17] text-white"
              : "bg-white/70 text-[#0E1622] hover:bg-white hover:text-[#C85A17]"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
        </button>

        {/* Clean Tasteful SOLD Badge in Corner — No Darkening / Masking / Watermarks */}
        {!watch.in_stock && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-[#0E1620] text-white border border-[#D8D1C5]/40 text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 uppercase shadow-sm">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#F8F5EE]">
        <div>
          <Link href={`/products/${watch.slug}`}>
            <h3 className="font-heading text-base sm:text-lg font-bold text-[#11161B] group-hover:text-[#C85A17] transition-colors leading-snug line-clamp-1">
              {watch.name}
            </h3>
          </Link>
          <p className="font-mono text-[11px] text-[#5C646D] mt-1 line-clamp-1 tracking-tight">
            {metaLine}
          </p>
        </div>

        {/* Price & Badge / Action */}
        <div className="mt-4 pt-3 border-t border-[#D8D1C5]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-base sm:text-lg font-extrabold text-[#11161B]">
              ₹ {watch.price.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Badge: ONE PIECE for in-stock watches (no duplicate sold labels on card) */}
          {watch.in_stock && (
            <span className="border border-[#C85A17]/60 text-[#C85A17] font-mono text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
              {watch.badge || "ONE PIECE"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
