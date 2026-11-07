"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { WatchProduct } from "@/lib/api"
import { WatchCard } from "./WatchCard"
import { Filter, SlidersHorizontal, ArrowUpDown, X, ShieldCheck } from "lucide-react"
import { getSavedIds } from "@/lib/wishlist"

export interface WatchCatalogGridProps {
  initialWatches: WatchProduct[];
  collectionSlug: string;
  availableBrands: string[];
  collectionTitle: string;
  collectionSubtitle?: string;
}

function WatchCatalogGridContent({
  initialWatches,
  collectionSlug,
  availableBrands,
  collectionTitle,
  collectionSubtitle,
}: WatchCatalogGridProps) {
  const searchParams = useSearchParams()
  const filterQuery = searchParams.get("filter")

  const [watches, setWatches] = React.useState<WatchProduct[]>(initialWatches)
  const [selectedBrand, setSelectedBrand] = React.useState<string>("all")
  const [selectedCondition, setSelectedCondition] = React.useState<string>("all")
  const [priceRange, setPriceRange] = React.useState<string>("all")
  const [inStockOnly, setInStockOnly] = React.useState<boolean>(false)
  const [showSavedOnly, setShowSavedOnly] = React.useState<boolean>(filterQuery === "saved")
  const [sortBy, setSortBy] = React.useState<string>("featured")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [showFiltersMobile, setShowFiltersMobile] = React.useState<boolean>(false)

  // Sync saved query param
  React.useEffect(() => {
    if (filterQuery === "saved") {
      setShowSavedOnly(true)
    }
  }, [filterQuery])

  // Filter & Sort computation
  React.useEffect(() => {
    let result = [...initialWatches]

    // Saved pieces filter
    if (showSavedOnly) {
      const savedIds = getSavedIds()
      result = result.filter(w => savedIds.includes(w.id))
    }

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter(w => w.brand.toLowerCase() === selectedBrand.toLowerCase())
    }

    // Condition filter
    if (selectedCondition !== "all") {
      result = result.filter(w => (w.condition_grade || "").toLowerCase() === selectedCondition.toLowerCase())
    }

    // Stock filter
    if (inStockOnly) {
      result = result.filter(w => w.in_stock)
    }

    // Price filter
    if (priceRange === "under_5k") {
      result = result.filter(w => w.price <= 5000)
    } else if (priceRange === "5k_15k") {
      result = result.filter(w => w.price > 5000 && w.price <= 15000)
    } else if (priceRange === "15k_35k") {
      result = result.filter(w => w.price > 15000 && w.price <= 35000)
    } else if (priceRange === "above_35k") {
      result = result.filter(w => w.price > 35000)
    }

    // Keyword search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q) ||
        w.model_name.toLowerCase().includes(q) ||
        w.reference_number.toLowerCase().includes(q) ||
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
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating)
    }

    setWatches(result)
  }, [
    selectedBrand,
    selectedCondition,
    priceRange,
    inStockOnly,
    showSavedOnly,
    sortBy,
    searchQuery,
    initialWatches
  ])

  const clearFilters = () => {
    setSelectedBrand("all")
    setSelectedCondition("all")
    setPriceRange("all")
    setInStockOnly(false)
    setShowSavedOnly(false)
    setSearchQuery("")
    setSortBy("featured")
  }

  const activeFiltersCount = 
    (selectedBrand !== "all" ? 1 : 0) + 
    (selectedCondition !== "all" ? 1 : 0) + 
    (priceRange !== "all" ? 1 : 0) + 
    (inStockOnly ? 1 : 0) +
    (showSavedOnly ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0)

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      
      {/* 1. Archive Header */}
      <div className="py-6 sm:py-10 mb-8 border-b border-[#D8D1C5]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-mono font-bold text-[#C85A17]">/</span>
          <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#11161B]">
            {showSavedOnly ? "SAVED TIMEPIECES" : collectionTitle}
          </h1>
        </div>
        <p className="font-mono text-xs sm:text-sm text-[#5C646D] max-w-2xl leading-relaxed">
          {showSavedOnly 
            ? "Your curated collection of bookmarked horological references." 
            : collectionSubtitle || "Explore our authenticated archive. Physically inspected, movement regulated, and packaged in Chennai."}
        </p>
      </div>

      {/* 2. Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#D8D1C5] mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#F8F5EE] border border-[#D8D1C5] text-xs font-mono font-bold uppercase tracking-wider text-[#11161B]"
          >
            <Filter className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>FILTERS {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
          </button>

          <span className="font-mono text-xs text-[#5C646D] uppercase tracking-wider">
            SHOWING <strong className="text-[#11161B]">{watches.length}</strong> PIECES
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-red-200"
            >
              <X className="w-3 h-3" />
              <span>CLEAR FILTERS</span>
            </button>
          )}
        </div>

        {/* Search Input & Sort Dropdown */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <input
            type="text"
            placeholder="Search reference or caliber..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-2 bg-[#F8F5EE] border border-[#D8D1C5] text-xs font-mono text-[#11161B] placeholder-[#5C646D] focus:outline-none focus:border-[#0E1620] w-full sm:w-56"
          />

          <div className="relative flex items-center shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort timepieces"
              className="appearance-none pl-3 pr-8 py-2 bg-[#F8F5EE] border border-[#D8D1C5] text-xs font-mono font-bold uppercase tracking-wider text-[#11161B] focus:outline-none focus:border-[#0E1620] cursor-pointer"
            >
              <option value="featured">SORT: FEATURED</option>
              <option value="price_asc">PRICE: LOW TO HIGH</option>
              <option value="price_desc">PRICE: HIGH TO LOW</option>
              <option value="newest">NEWEST IN ARCHIVE</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-[#5C646D] absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className={`lg:block ${showFiltersMobile ? "block" : "hidden"} space-y-6 bg-[#F8F5EE] p-5 border border-[#D8D1C5] h-fit`}>
          <div className="flex items-center justify-between pb-3 border-b border-[#D8D1C5]">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#11161B] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C85A17]" />
              <span>FILTER ARCHIVE</span>
            </span>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="font-mono text-[10px] text-[#C85A17] font-bold uppercase hover:underline">
                RESET
              </button>
            )}
          </div>

          {/* Quick Toggle: In-Stock Only */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono font-bold uppercase tracking-wider text-[#11161B]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#C85A17] cursor-pointer"
              />
              <span>IN-STOCK ONLY</span>
            </label>
          </div>

          {/* Quick Toggle: Saved Only */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono font-bold uppercase tracking-wider text-[#11161B]">
              <input
                type="checkbox"
                checked={showSavedOnly}
                onChange={(e) => setShowSavedOnly(e.target.checked)}
                className="w-4 h-4 accent-[#C85A17] cursor-pointer"
              />
              <span>SAVED BOOKMARKS</span>
            </label>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3 pt-4 border-t border-[#D8D1C5]">
            <h3 className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#5C646D]">
              MANUFACTURER / BRAND
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedBrand("all")}
                className={`px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                  selectedBrand === "all"
                    ? "bg-[#0E1620] text-white font-bold"
                    : "bg-[#EAE4D9] text-[#11161B] hover:bg-[#D8D1C5]"
                }`}
              >
                ALL
              </button>
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                    selectedBrand.toLowerCase() === brand.toLowerCase()
                      ? "bg-[#0E1620] text-white font-bold"
                      : "bg-[#EAE4D9] text-[#11161B] hover:bg-[#D8D1C5]"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5 pt-4 border-t border-[#D8D1C5]">
            <h3 className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#5C646D]">
              PRICE BAND
            </h3>
            <div className="flex flex-col space-y-2 text-xs font-mono text-[#11161B]">
              {[
                { label: "ALL PRICES", value: "all" },
                { label: "UNDER ₹ 5,000", value: "under_5k" },
                { label: "₹ 5,000 – ₹ 15,000", value: "5k_15k" },
                { label: "₹ 15,000 – ₹ 35,000", value: "15k_35k" },
                { label: "ABOVE ₹ 35,000", value: "above_35k" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer py-0.5 hover:text-[#C85A17] transition-colors">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === opt.value}
                    onChange={() => setPriceRange(opt.value)}
                    className="accent-[#C85A17] w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2.5 pt-4 border-t border-[#D8D1C5]">
            <h3 className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#5C646D]">
              HOROLOGIST GRADE
            </h3>
            <div className="flex flex-col space-y-2 text-xs font-mono text-[#11161B]">
              {[
                { label: "ALL GRADES", value: "all" },
                { label: "MINT RESTORED", value: "mint" },
                { label: "EXCELLENT", value: "excellent" },
                { label: "VERY GOOD (PATINA)", value: "very_good" },
                { label: "BRAND NEW / SEALED", value: "new" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer py-0.5 hover:text-[#C85A17] transition-colors">
                  <input
                    type="radio"
                    name="conditionGrade"
                    checked={selectedCondition === opt.value}
                    onChange={() => setSelectedCondition(opt.value)}
                    className="accent-[#C85A17] w-3.5 h-3.5 cursor-pointer"
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
            <div className="bg-[#F8F5EE] border border-[#D8D1C5] p-12 text-center flex flex-col items-center justify-center space-y-4">
              <span className="font-mono text-2xl text-[#C85A17]">/</span>
              <h3 className="font-heading text-2xl font-bold text-[#11161B]">No timepieces match criteria</h3>
              <p className="font-mono text-xs text-[#5C646D] max-w-sm">
                Try clearing your search query or relaxing your filter selections to see the available horological archive.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-[#0E1620] hover:bg-[#16212E] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {watches.map((product) => (
                <WatchCard key={product.id} watch={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export function WatchCatalogGrid(props: WatchCatalogGridProps) {
  return (
    <React.Suspense fallback={
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 text-center font-mono text-xs text-[#5C646D]">
        Loading horological archive...
      </div>
    }>
      <WatchCatalogGridContent {...props} />
    </React.Suspense>
  )
}
