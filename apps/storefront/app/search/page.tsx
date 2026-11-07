"use client"

import React, { useState, useEffect, Suspense, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { fetchWatches, WatchProduct } from "@/lib/api"
import { WatchCard } from "@/components/store/WatchCard"
import { Search as SearchIcon, Loader2, ArrowLeft, ArrowUpDown } from "lucide-react"
import Link from "next/link"

const ITEMS_PER_PAGE_STORAGE_KEY = "rtc_items_per_page"
const ALLOWED_LIMITS = [12, 24, 50, 100]

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const urlPage = parseInt(searchParams.get("page") || "", 10) || 1
  const urlLimit = parseInt(searchParams.get("limit") || "", 10) || 50

  const [searchTerm, setSearchTerm] = useState(query)
  const [results, setResults] = useState<WatchProduct[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(urlPage)
  const [limit, setLimit] = useState(ALLOWED_LIMITS.includes(urlLimit) ? urlLimit : 50)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const resultsTopRef = useRef<HTMLDivElement>(null)

  const updateSearchUrl = useCallback((term: string, pageNum: number, limitNum: number) => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    if (term) url.searchParams.set("q", term)
    else url.searchParams.delete("q")

    if (pageNum > 1) url.searchParams.set("page", pageNum.toString())
    else url.searchParams.delete("page")

    if (limitNum !== 50) url.searchParams.set("limit", limitNum.toString())
    else url.searchParams.delete("limit")

    window.history.pushState({}, "", url.pathname + url.search)
  }, [])

  const executeSearch = useCallback(async (term: string, pageNum: number, limitNum: number) => {
    if (!term.trim()) return
    setLoading(true)
    setSearched(true)

    try {
      const res = await fetchWatches({
        search: term,
        page: pageNum,
        limit: limitNum,
      })

      if (res.success && res.data) {
        setResults(res.data)
        setTotalCount(res.total)
        setTotalPages(res.total_pages || Math.max(1, Math.ceil(res.total / limitNum)))
        setCurrentPage(res.page || pageNum)
      } else {
        setResults([])
        setTotalCount(0)
        setTotalPages(1)
      }
    } catch (err) {
      console.error("Search error:", err)
      setResults([])
      setTotalCount(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial mount: load visitor preference from localStorage if URL doesn't specify limit
  useEffect(() => {
    let activeLimit = limit
    const hasUrlLimit = searchParams.has("limit")

    if (!hasUrlLimit && typeof window !== "undefined") {
      const savedPref = localStorage.getItem(ITEMS_PER_PAGE_STORAGE_KEY)
      if (savedPref) {
        const parsed = parseInt(savedPref, 10)
        if (ALLOWED_LIMITS.includes(parsed)) {
          activeLimit = parsed
          setLimit(parsed)
        }
      }
    }

    if (query) {
      executeSearch(query, urlPage, activeLimit)
    }

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const q = params.get("q") || ""
      const p = Math.max(1, parseInt(params.get("page") || "1", 10) || 1)
      const l = parseInt(params.get("limit") || "50", 10) || 50
      const validatedLimit = ALLOWED_LIMITS.includes(l) ? l : 50

      setSearchTerm(q)
      setCurrentPage(p)
      setLimit(validatedLimit)
      if (q) {
        executeSearch(q, p, validatedLimit)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [query, urlPage, searchParams, executeSearch, limit])

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchTerm.trim()) return

    setCurrentPage(1)
    updateSearchUrl(searchTerm, 1, limit)
    executeSearch(searchTerm, 1, limit)
  }

  const handleLimitChange = (newLimit: number) => {
    if (!ALLOWED_LIMITS.includes(newLimit) || newLimit === limit) return

    setLimit(newLimit)
    if (typeof window !== "undefined") {
      localStorage.setItem(ITEMS_PER_PAGE_STORAGE_KEY, newLimit.toString())
    }

    setCurrentPage(1)
    updateSearchUrl(searchTerm, 1, newLimit)
    executeSearch(searchTerm, 1, newLimit)
  }

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage || loading) return

    setCurrentPage(newPage)
    updateSearchUrl(searchTerm, newPage, limit)
    executeSearch(searchTerm, newPage, limit)

    if (resultsTopRef.current) {
      const topOffset = resultsTopRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" })
    }
  }

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, totalCount)

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
    <main className="min-h-screen bg-[#F4EFE6] py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="max-w-xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl font-mono font-bold text-[#C85A17]">/</span>
            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#5C646D]">
              ARCHIVE QUERY
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase text-[#11161B] mb-6">
            Search Timepieces
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference, caliber, or brand (e.g. Seiko, 7009)..."
              className="w-full bg-[#F8F5EE] border border-[#D8D1C5] px-4 py-3.5 pl-11 text-[#11161B] font-mono text-xs focus:outline-none focus:border-[#0E1620] transition-colors"
            />
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C646D] w-4 h-4" />
            <button 
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#C85A17] hover:bg-[#B34E12] text-white px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors"
            >
              SEARCH
            </button>
          </form>
        </div>

        {/* Results Container */}
        <div ref={resultsTopRef}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#C85A17]" />
            </div>
          ) : searched ? (
            <div className="space-y-6">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D1C5] font-mono text-xs text-[#5C646D] uppercase">
                <div className="flex items-center gap-2">
                  <span>FOUND <strong className="text-[#11161B]">{totalCount}</strong> PIECES FOR &ldquo;{searchTerm}&rdquo;</span>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {/* Items per page selector */}
                  {totalCount > 0 && (
                    <div className="flex items-center gap-2">
                      <label htmlFor="search-items-per-page" className="font-mono text-xs font-bold uppercase text-[#5C646D]">
                        SHOW:
                      </label>
                      <div className="relative">
                        <select
                          id="search-items-per-page"
                          value={limit}
                          onChange={(e) => handleLimitChange(Number(e.target.value))}
                          aria-label="Items per page"
                          className="appearance-none pl-3 pr-8 py-1.5 bg-[#F8F5EE] border border-[#D8D1C5] text-xs font-mono font-bold uppercase tracking-wider text-[#11161B] focus:outline-none focus:border-[#0E1620] cursor-pointer"
                        >
                          <option value={12}>12 products</option>
                          <option value={24}>24 products</option>
                          <option value={50}>50 products</option>
                          <option value={100}>100 products</option>
                        </select>
                        <ArrowUpDown className="w-3 h-3 text-[#5C646D] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <Link href="/collections/all" className="hover:text-[#C85A17] flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" />
                    <span>VIEW ALL ARCHIVES</span>
                  </Link>
                </div>
              </div>
              
              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                    {results.map((watch) => (
                      <WatchCard key={watch.id} watch={watch} />
                    ))}
                  </div>

                  {/* Bottom Pagination Strip */}
                  <div className="mt-12 pt-8 border-t border-[#D8D1C5] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                    <div className="text-[#5C646D] uppercase tracking-wider">
                      Showing <strong className="text-[#11161B]">{startItem}–{endItem}</strong> of{" "}
                      <strong className="text-[#11161B]">{totalCount}</strong> products.
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
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
                </>
              ) : (
                <div className="text-center py-16 bg-[#F8F5EE] border border-[#D8D1C5] space-y-3 p-8">
                  <span className="font-mono text-2xl text-[#C85A17]">/</span>
                  <p className="font-heading text-xl font-bold text-[#11161B]">No timepieces found.</p>
                  <p className="font-mono text-xs text-[#5C646D] max-w-sm mx-auto">
                    Try adjusting your search terms or explore our complete horological archive.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/collections/all"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E1620] hover:bg-[#16212E] text-white text-xs font-mono font-bold uppercase tracking-wider"
                    >
                      <span>BROWSE COMPLETE ARCHIVE</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4EFE6] py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C85A17]" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
