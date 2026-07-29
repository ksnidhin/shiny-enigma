import React from "react"
import Link from "next/link"
import Image from "next/image"
import { WatchProduct } from "@/lib/api"
import { Star } from "lucide-react"

export function WatchCard({ watch }: { watch: WatchProduct }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-custom)] hover:shadow-2xl transition-all duration-500 flex flex-col group relative h-full">
      <Link href={`/products/${watch.slug}`} className="relative h-64 w-full bg-[#EAE4DB] overflow-hidden block shrink-0">
        <Image
          src={watch.image}
          alt={watch.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {watch.badge && (
          <span className="absolute top-3 left-3 bg-[var(--color-brand)] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
            {watch.badge}
          </span>
        )}
        {!watch.in_stock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
              Sold Out
            </span>
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1 justify-between bg-white relative">
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-[var(--color-accent)] mb-1.5">
            <span>{watch.brand}</span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-gray-500">{watch.rating}</span>
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors leading-snug line-clamp-2">
            <Link href={`/products/${watch.slug}`}>{watch.name}</Link>
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 line-clamp-1">
            {watch.condition_label}
          </p>
        </div>
        <div className="pt-4 border-t border-black/5 mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {watch.original_price && (
              <span className="text-[10px] text-[var(--color-text-secondary)] line-through">
                Rs. {watch.original_price.toLocaleString("en-IN")}
              </span>
            )}
            <span className="font-heading text-[var(--color-brand)] font-bold text-lg">
              Rs. {watch.price.toLocaleString("en-IN")}
            </span>
          </div>
          <Link
            href={`/products/${watch.slug}`}
            className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
