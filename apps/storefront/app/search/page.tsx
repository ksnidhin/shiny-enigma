"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { fetchWatches, WatchProduct } from "@/lib/api"
import { WatchCard } from "@/components/store/WatchCard"
import { Search as SearchIcon, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  
  const [searchTerm, setSearchTerm] = useState(query)
  const [results, setResults] = useState<WatchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchTerm.trim()) return
    
    setLoading(true)
    setSearched(true)
    
    window.history.pushState(null, '', `?q=${encodeURIComponent(searchTerm)}`)
    
    const res = await fetchWatches({ search: searchTerm })
    if (res.success && res.data) {
      setResults(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [query])

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
          
          <form onSubmit={handleSearch} className="relative">
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

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#C85A17]" />
          </div>
        ) : searched ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D1C5] font-mono text-xs text-[#5C646D] uppercase">
              <span>FOUND <strong className="text-[#11161B]">{results.length}</strong> PIECES FOR &ldquo;{searchTerm}&rdquo;</span>
              <Link href="/collections/all" className="hover:text-[#C85A17] flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                <span>VIEW ALL ARCHIVES</span>
              </Link>
            </div>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                {results.map((watch) => (
                  <WatchCard key={watch.id} watch={watch} />
                ))}
              </div>
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
