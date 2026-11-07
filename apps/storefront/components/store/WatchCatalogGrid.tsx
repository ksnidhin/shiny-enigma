"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { fetchWatches, WatchProduct } from "@/lib/api"
import { WatchCard } from "./WatchCard"
import { Filter, SlidersHorizontal, ArrowUpDown, X, Loader2 } from "lucide-react"
import { getSavedIds } from "@/lib/wishlist"

export interface WatchCatalogGridProps {
  initialWatches: WatchProduct[];
  initialTotal?: number;
  initialPage?: number;
  initialLimit?: number;
  initialTotalPages?: number;
  collectionSlug: string;
  availableBrands: string[];
  collectionTitle: string;
  collectionSubtitle?: string;
}

const ITEMS_PER_PAGE_STORAGE_KEY = "rtc_items_per_page"
const ALLOWED_LIMITS = [12, 24, 50, 100]

function WatchCatalogGridContent({
  initialWatches,
  initialTotal,
  initialPage = 1,
  initialLimit = 50,
  initialTotalPages,
  collectionSlug,
  availableBrands,
  collectionTitle,
  collectionSubtitle,
}: WatchCatalogGridProps) {
  const searchParams = useSearchParams()
  const filterQuery = searchParams.get("filter")
  const catalogTopRef = React.useRef<HTMLDivElement>(null)

  // Determine initial limit and page from URL or props
  const urlPage = parseInt(searchParams.get("page") || "", 10) || initialPage
  const urlLimit = parseInt(searchParams.get("limit") || "", 10) || initialLimit

  const [watches, setWatches] = React.useState<WatchProduct[]>(initialWatches)
  const [totalCount, setTotalCount] = React.useState<number>(initialTotal ?? initialWatches.length)
  const [currentPage, setCurrentPage] = React.useState<number>(urlPage)
  const [limit, setLimit] = React.useState<number>(ALLOWED_LIMITS.includes(urlLimit) ? urlLimit : 50)
  const [totalPages, setTotalPages] = React.useState<number>(
    initialTotalPages ?? Math.max(1, Math.ceil((initialTotal ?? initialWatches.length) / (ALLOWED_LIMITS.includes(urlLimit) ? urlLimit : 50)))
  )
  const [loading, setLoading] = React.useState<boolean>(false)

  // Filters
  const [selectedBrand, setSelectedBrand] = React.useState<string>("all")
  const [selectedCondition, setSelectedCondition] = React.useState<string>("all")
  const [priceRange, setPriceRange] = React.useState<string>("all")
  const [inStockOnly, setInStockOnly] = React.useState<boolean>(false)
  const [showSavedOnly, setShowSavedOnly] = React.useState<boolean>(filterQuery === "saved")
  const [sortBy, setSortBy] = React.useState<string>("featured")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("")
  const [showFiltersMobile, setShowFiltersMobile] = React.useState<boolean>(false)

  const isFirstMount = React.useRef(true)

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Helper to update URL params
  const updateUrl = React.useCallback((pageVal: number, limitVal: number) => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    if (pageVal > 1) {
      url.searchParams.set("page", pageVal.toString())
    } else {
      url.searchParams.delete("page")
    }
    if (limitVal !== 50) {
      url.searchParams.set("limit", limitVal.toString())
    } else {
      url.searchParams.delete("limit")
    }
    window.history.pushState({}, "", url.pathname + url.search)
  }, [])

  // Core fetch function
  const fetchCatalogData = React.useCallback(async (
    pageVal: number,
    limitVal: number,
    brandVal: string,
    conditionVal: string,
    priceVal: string,
    inStockVal: boolean,
    savedVal: boolean,
    sortVal: string,
    searchVal: string
  ) => {
    setLoading(true)
    try {
      if (savedVal) {
        // Saved bookmarks require client-side matching with local storage IDs
        const savedIds = getSavedIds()
        const res = await fetchWatches({
          collection: collectionSlug === "all" ? undefined : collectionSlug,
          brand: brandVal !== "all" ? brandVal : undefined,
          condition: conditionVal !== "all" ? conditionVal : undefined,
          in_stock: inStockVal || undefined,
          sort: sortVal,
          search: searchVal.trim() || undefined,
          limit: "all",
        })

        if (res.success && res.data) {
          const matched = res.data.filter(w => savedIds.includes(w.id))
          const total = matched.length
          const pages = Math.max(1, Math.ceil(total / limitVal))
          const actualPage = Math.min(pageVal, pages)
          const start = (actualPage - 1) * limitVal
          const paginated = matched.slice(start, start + limitVal)

          setWatches(paginated)
          setTotalCount(total)
          setTotalPages(pages)
          setCurrentPage(actualPage)
        }
      } else {
        // Pure server-side pagination
        let min_price: number | undefined
        let max_price: number | undefined

        if (priceVal === "under_5k") {
          max_price = 5000
        } else if (priceVal === "5k_15k") {
          min_price = 5001
          max_price = 15000
        } else if (priceVal === "15k_35k") {
          min_price = 15001
          max_price = 35000
        } else if (priceVal === "above_35k") {
          min_price = 35001
        }

        const res = await fetchWatches({
          collection: collectionSlug === "all" ? undefined : collectionSlug,
          brand: brandVal !== "all" ? brandVal : undefined,
          condition: conditionVal !== "all" ? conditionVal : undefined,
          min_price,
          max_price,
          in_stock: inStockVal || undefined,
          sort: sortVal,
          search: searchVal.trim() || undefined,
          page: pageVal,
          limit: limitVal,
        })

        if (res.success && res.data) {
          setWatches(res.data)
          setTotalCount(res.total)
          setTotalPages(res.total_pages || Math.max(1, Math.ceil(res.total / limitVal)))
          setCurrentPage(res.page || pageVal)
        }
      }
    } catch (err) {
      console.error("Error fetching watch catalog:", err)
    } finally {
      setLoading(false)
    }
  }, [collectionSlug])

  // Mount effect: check visitor's localStorage preference and popstate navigation
  React.useEffect(() => {
    // If URL did not specify a limit, check visitor's saved preference
    const hasUrlLimit = searchParams.has("limit")
    let activeLimit = limit

    if (!hasUrlLimit && typeof window !== "undefined") {
      const savedPref = localStorage.getItem(ITEMS_PER_PAGE_STORAGE_KEY)
      if (savedPref) {
        const parsed = parseInt(savedPref, 10)
        if (ALLOWED_LIMITS.includes(parsed) && parsed !== limit) {
          activeLimit = parsed
          setLimit(parsed)
          // Fetch page 1 with user preference
          fetchCatalogData(
            1,
            parsed,
            selectedBrand,
            selectedCondition,
            priceRange,
            inStockOnly,
            showSavedOnly,
            sortBy,
            debouncedSearch
          )
          updateUrl(1, parsed)
        }
      }
    }

    // Handle browser back and forward button navigation
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const p = Math.max(1, parseInt(params.get("page") || "1", 10) || 1)
      const l = parseInt(params.get("limit") || "50", 10) || 50
      const validatedLimit = ALLOWED_LIMITS.includes(l) ? l : 50

      setCurrentPage(p)
      setLimit(validatedLimit)
      fetchCatalogData(
        p,
        validatedLimit,
        selectedBrand,
        selectedCondition,
        priceRange,
        inStockOnly,
        showSavedOnly,
        sortBy,
        debouncedSearch
      )
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [fetchCatalogData, updateUrl])

  // Filter or sort change effect -> Resets to Page 1 and keeps selected limit
  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    setCurrentPage(1)
    updateUrl(1, limit)
    fetchCatalogData(
      1,
      limit,
      selectedBrand,
      selectedCondition,
      priceRange,
      inStockOnly,
      showSavedOnly,
      sortBy,
      debouncedSearch
    )
  }, [
    selectedBrand,
    selectedCondition,
    priceRange,
    inStockOnly,
    showSavedOnly,
    sortBy,
    debouncedSearch,
  ])

  // Handle Items Per Page (SHOW) change
  const handleLimitChange = (newLimit: number) => {
    if (!ALLOWED_LIMITS.includes(newLimit) || newLimit === limit) return

    setLimit(newLimit)
    if (typeof window !== "undefined") {
      localStorage.setItem(ITEMS_PER_PAGE_STORAGE_KEY, newLimit.toString())
    }

    // Reset to page 1 upon changing display count
    setCurrentPage(1)
    updateUrl(1, newLimit)
    fetchCatalogData(
      1,
      newLimit,
      selectedBrand,
      selectedCondition,
      priceRange,
      inStockOnly,
      showSavedOnly,
      sortBy,
      debouncedSearch
    )
  }

  // Handle Page navigation
  const goToPage = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage || loading) return

    setCurrentPage(targetPage)
    updateUrl(targetPage, limit)
    fetchCatalogData(
      targetPage,
      limit,
      selectedBrand,
      selectedCondition,
      priceRange,
      inStockOnly,
      showSavedOnly,
      sortBy,
      debouncedSearch
    )

    // Scroll smoothly back to top of catalog section
    if (catalogTopRef.current) {
      const topOffset = catalogTopRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" })
    }
  }

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

  // Calculate dynamic display numbers
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, totalCount)

  // Generate pagination items
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | string)[] = []
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push("...")
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(1)
      pages.push("...")
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push("...")
      pages.push(currentPage - 1)
      pages.push(currentPage)
      pages.push(currentPage + 1)
      pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div ref={catalogTopRef} className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      
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
            : collectionSubtitle || "Explore our authenticated archive. Physically inspected, movement regulated, and securely packaged."}
        </p>
      </div>

      {/* 2. Control Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-[#D8D1C5] mb-8">
        
        {/* Left: Mobile Filter & Status Counters */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#F8F5EE] border border-[#D8D1C5] text-xs font-mono font-bold uppercase tracking-wider text-[#11161B]"
          >
            <Filter className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>FILTERS {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
          </button>

          <span className="font-mono text-xs text-[#5C646D] uppercase tracking-wider">
            SHOWING <strong className="text-[#11161B]">{totalCount === 0 ? 0 : `${startItem}–${endItem}`}</strong> OF <strong className="text-[#11161B]">{totalCount}</strong> PIECES
          </span>

          {loading && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#C85A17]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>UPDATING...</span>
            </div>
          )}

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

        {/* Right: Search, SHOW Selector & Sort Dropdown */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search reference or caliber..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-2 bg-[#F8F5EE] border border-[#D8D1C5] text-xs font-mono text-[#11161B] placeholder-[#5C646D] focus:outline-none focus:border-[#0E1620] w-full sm:w-48 lg:w-56"
          />

          {/* Items Per Page (SHOW) Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="items-per-page-select" className="font-mono text-xs font-bold uppercase tracking-wider text-[#5C646D]">
              SHOW:
            </label>
            <div className="relative">
              <select
                id="items-per-page-select"
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                aria-label="Items per page"
                className="appearance-none pl-3 pr-8 py-2 bg-[#F8F5EE] border border-[#D8D1C5] text-xs font-mono font-bold uppercase tracking-wider text-[#11161B] focus:outline-none focus:border-[#0E1620] cursor-pointer"
              >
                <option value={12}>12 products</option>
                <option value={24}>24 products</option>
                <option value={50}>50 products</option>
                <option value={100}>100 products</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-[#5C646D] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sort Dropdown */}
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
            <ArrowUpDown className="w-3 h-3 text-[#5C646D] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

        {/* Product Cards Grid & Bottom Pagination */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div>
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

          {/* Bottom Pagination Strip */}
          {totalCount > 0 && (
            <div className="mt-12 pt-8 border-t border-[#D8D1C5] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              
              {/* Dynamic Range Counter */}
              <div className="text-[#5C646D] uppercase tracking-wider">
                Showing <strong className="text-[#11161B]">{startItem}–{endItem}</strong> of{" "}
                <strong className="text-[#11161B]">{totalCount}</strong> products.
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    aria-label="Previous page"
                    className={`px-3.5 py-2 font-bold uppercase tracking-wider border transition-colors ${
                      currentPage <= 1 || loading
                        ? "bg-[#EAE4D9]/50 border-[#D8D1C5] text-[#5C646D]/40 cursor-not-allowed"
                        : "bg-[#F8F5EE] border-[#D8D1C5] text-[#11161B] hover:bg-[#0E1620] hover:text-white hover:border-[#0E1620]"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 py-2 text-[#5C646D]">
                          …
                        </span>
                      )
                    }
                    const num = Number(p)
                    const isActive = num === currentPage
                    return (
                      <button
                        key={`page-${num}`}
                        onClick={() => goToPage(num)}
                        disabled={loading}
                        aria-label={`Page ${num}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`min-w-[38px] px-3 py-2 font-bold border transition-colors ${
                          isActive
                            ? "bg-[#0E1620] text-white border-[#0E1620]"
                            : "bg-[#F8F5EE] border-[#D8D1C5] text-[#11161B] hover:bg-[#EAE4D9]"
                        }`}
                      >
                        {num}
                      </button>
                    )
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    aria-label="Next page"
                    className={`px-3.5 py-2 font-bold uppercase tracking-wider border transition-colors ${
                      currentPage >= totalPages || loading
                        ? "bg-[#EAE4D9]/50 border-[#D8D1C5] text-[#5C646D]/40 cursor-not-allowed"
                        : "bg-[#F8F5EE] border-[#D8D1C5] text-[#11161B] hover:bg-[#0E1620] hover:text-white hover:border-[#0E1620]"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
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
