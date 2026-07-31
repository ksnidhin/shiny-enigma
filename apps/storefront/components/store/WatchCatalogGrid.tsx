"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { WatchProduct } from "@/lib/api"
import { Filter, SlidersHorizontal, ArrowUpDown, Check, X, ShieldCheck, Heart, ShoppingBag } from "lucide-react"

interface WatchCatalogGridProps {
  initialWatches: WatchProduct[];
  collectionSlug: string;
  availableBrands: string[];
  collectionTitle: string;
  collectionSubtitle?: string;
}

export function WatchCatalogGrid({
  initialWatches,
  collectionSlug,
  availableBrands,
  collectionTitle,
  collectionSubtitle,
}: WatchCatalogGridProps) {
  const [watches, setWatches] = React.useState<WatchProduct[]>(initialWatches)
  const [addedIds, setAddedIds] = React.useState<Set<string>>(new Set())
  const [selectedBrand, setSelectedBrand] = React.useState<string>("all")
  const [selectedCondition, setSelectedCondition] = React.useState<string>("all")
  const [priceRange, setPriceRange] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<string>("featured")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [showFiltersMobile, setShowFiltersMobile] = React.useState<boolean>(false)

  // Filter & Sort computation
  React.useEffect(() => {
    let result = [...initialWatches]

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter(w => w.brand.toLowerCase() === selectedBrand.toLowerCase())
    }

    // Condition filter
    if (selectedCondition !== "all") {
      result = result.filter(w => (w.condition_grade || "").toLowerCase() === selectedCondition.toLowerCase())
    }

    // Price filter
    if (priceRange === "under_5k") {
      result = result.filter(w => w.price <= 5000)
    } else if (priceRange === "5k_25k") {
      result = result.filter(w => w.price > 5000 && w.price <= 25000)
    } else if (priceRange === "25k_50k") {
      result = result.filter(w => w.price > 25000 && w.price <= 50000)
    } else if (priceRange === "above_50k") {
      result = result.filter(w => w.price > 50000)
    }

    // Keyword search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q) ||
        w.model_name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q)
      )
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.id.localeCompare(a.id))
    } else if (sortBy === "featured") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setWatches(result)
  }, [selectedBrand, selectedCondition, priceRange, sortBy, searchQuery, initialWatches])

  const clearFilters = () => {
    setSelectedBrand("all")
    setSelectedCondition("all")
    setPriceRange("all")
    setSearchQuery("")
    setSortBy("featured")
  }

  const activeFiltersCount = 
    (selectedBrand !== "all" ? 1 : 0) + 
    (selectedCondition !== "all" ? 1 : 0) + 
    (priceRange !== "all" ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0)

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10">
      {/* Collection Header Banner */}
      <div className="bg-[#173528] text-white rounded-3xl p-8 md:p-12 mb-10 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Verified Horology</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
            {collectionTitle}
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed font-light">
            {collectionSubtitle || "Explore our authenticated inventory. Every watch undergoes extensive mechanical regulation and verification by expert horologists."}
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)] mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[var(--color-border)] text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Filter className="w-4 h-4 text-[var(--color-brand)]" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-secondary)]">
            Showing <span className="text-[var(--color-text-primary)] font-extrabold">{watches.length}</span> timepieces
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search watches or calibers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] w-full md:w-64"
          />

          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-[var(--color-border)] bg-white text-xs font-semibold text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-text-secondary)] absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className={`lg:block ${showFiltersMobile ? "block" : "hidden"} space-y-6 bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm h-fit`}>
          <div className="flex items-center justify-between pb-4 border-b border-black/5">
            <span className="font-heading text-xl font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[var(--color-brand)]" />
              <span>Filter Catalog</span>
            </span>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-[var(--color-accent)] font-semibold hover:underline">
                Clear All
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-primary)]">Brand</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBrand("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedBrand === "all"
                    ? "bg-[var(--color-brand)] text-white font-bold shadow-sm"
                    : "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-gray-200"
                }`}
              >
                All Brands
              </button>
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedBrand.toLowerCase() === brand.toLowerCase()
                      ? "bg-[var(--color-brand)] text-white font-bold shadow-sm"
                      : "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:bg-gray-200"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-black/5">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-primary)]">Price Range</h3>
            <div className="flex flex-col space-y-2 text-xs font-medium">
              {[
                { label: "All Prices", value: "all" },
                { label: "Under Rs. 5,000", value: "under_5k" },
                { label: "Rs. 5,000 - Rs. 25,000", value: "5k_25k" },
                { label: "Rs. 25,000 - Rs. 50,000", value: "25k_50k" },
                { label: "Above Rs. 50,000", value: "above_50k" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer py-1 hover:text-[var(--color-brand)]">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === opt.value}
                    onChange={() => setPriceRange(opt.value)}
                    className="accent-[var(--color-brand)] w-4 h-4 cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition Grade Filter */}
          <div className="space-y-3 pt-4 border-t border-black/5">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-primary)]">Condition</h3>
            <div className="flex flex-col space-y-2 text-xs font-medium">
              {[
                { label: "All Conditions", value: "all" },
                { label: "Brand New / Sealed", value: "new" },
                { label: "Mint Restored", value: "mint" },
                { label: "Excellent (Original)", value: "excellent" },
                { label: "Very Good (Patina)", value: "very_good" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer py-1 hover:text-[var(--color-brand)]">
                  <input
                    type="radio"
                    name="conditionGrade"
                    checked={selectedCondition === opt.value}
                    onChange={() => setSelectedCondition(opt.value)}
                    className="accent-[var(--color-brand)] w-4 h-4 cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {watches.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold">No timepieces match your criteria</h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-sm">
                Try clearing your search keyword or relaxing your filter selections to see our curated archive.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-[var(--color-brand)] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watches.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-custom)] hover:shadow-2xl transition-all duration-500 flex flex-col group relative"
                >
                  <Link href={`/products/${product.slug}`} className="relative h-64 w-full bg-[#EAE4DB] overflow-hidden block">
                    <Image
                      src={product.image || "/hero_vintage_watch_1785170825322.jpg"}
                      alt={product.name || "Watch"}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {product.badge && product.in_stock && (
                      <span className="absolute top-3 left-3 bg-[var(--color-brand)] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        {product.badge}
                      </span>
                    )}
                    {!product.in_stock && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                        Sold Out
                      </span>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                      <button 
                        onClick={async (e) => { 
                          e.preventDefault(); 
                          const { addToCart } = await import("@/lib/cart");
                          addToCart(product);
                          setAddedIds(prev => new Set(prev).add(product.id));
                          setTimeout(() => {
                            setAddedIds(prev => {
                              const next = new Set(prev);
                              next.delete(product.id);
                              return next;
                            });
                          }, 2000);
                        }}
                        className={`w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-colors shadow-sm ${addedIds.has(product.id) ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${addedIds.has(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-1 justify-between bg-white group-hover:bg-[#FCFAFA] transition-colors">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-1">
                        <span>{product.brand}</span>
                        <span>{product.era_label ? product.era_label.split(" ")[0] : ""}</span>
                      </div>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors line-clamp-2 leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 line-clamp-1 font-normal">
                        {product.condition_label}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-[var(--color-text-primary)]">
                          Rs. {product.price.toLocaleString("en-IN")}
                        </span>
                        {product.original_price && (
                          <span className="text-xs text-[var(--color-text-secondary)] line-through ml-2">
                            Rs. {product.original_price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="px-3.5 py-2 rounded-xl bg-[var(--color-bg-primary)] group-hover:bg-[var(--color-brand)] text-[var(--color-text-primary)] group-hover:text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
                      >
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
