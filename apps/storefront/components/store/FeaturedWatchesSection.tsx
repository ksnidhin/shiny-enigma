"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Award, Sparkles } from "lucide-react"
import { fetchWatches, WatchProduct } from "@/lib/api"

export function FeaturedWatchesSection() {
  const [featured, setFeatured] = useState<WatchProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetchWatches()
        if (res && res.data) {
          const onlyFeatured = res.data.filter(w => w.featured)
          setFeatured(onlyFeatured)
        }
      } catch (err) {
        console.error("Failed to load featured watches:", err)
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [])

  return (
    <section className="py-20 bg-[#16211C] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Latest Drops &amp; Verified Gems</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold">
              Featured Timepieces
            </h2>
          </div>
          <Link 
            href="/collections/all" 
            className="text-xs font-bold tracking-wider uppercase text-amber-200 hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>View All Timepieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Featured Timepieces Selected</h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              You currently have no watches marked as Featured in your catalog. Open your Horological Admin Console and toggle the ⭐️ Featured status on any timepiece to showcase it right here!
            </p>
            <Link 
              href="/collections/all" 
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#d4af37] hover:bg-[#b89728] text-black font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg"
            >
              <span>Explore Complete Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <div 
                key={product.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 w-full bg-[#EAE4DB] overflow-hidden">
                  {product.image ? (
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-mono">No Image</div>
                  )}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[var(--color-brand)] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 text-gray-700 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm" aria-label="Add to wishlist">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-200 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-white/60 mt-1 line-clamp-1 font-light">
                      {product.condition_label || product.condition_grade}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-white">Rs. {product.price.toLocaleString("en-IN")}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-xs text-white/40 line-through ml-2">Rs. {product.original_price.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                    
                    <Link 
                      href={`/products/${product.slug}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[#b88c47] text-white text-xs font-semibold tracking-wide uppercase transition-all shadow"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
