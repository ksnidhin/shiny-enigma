"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { fetchWatches, WatchProduct } from "@/lib/api"
import { WatchCard } from "@/components/store/WatchCard"
import { Search as SearchIcon, Loader2 } from "lucide-react"

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
    
    // We update the URL without refreshing to keep it copyable
    window.history.pushState(null, '', `?q=${encodeURIComponent(searchTerm)}`)
    
    const res = await fetchWatches({ search: searchTerm })
    if (res.success && res.data) {
      setResults(res.data)
    }
    setLoading(false)
  }

  // Load initial query if present
  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [query])

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-center mb-6 text-[var(--color-brand)]">Search Timepieces</h1>
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand, model, era..."
              className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-full px-6 py-4 pl-12 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors text-lg"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-6 h-6" />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--color-brand)] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[var(--color-accent)] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-brand)]" />
          </div>
        ) : searched ? (
          <div className="space-y-6">
            <p className="text-[var(--color-text-muted)] text-center">
              Found {results.length} {results.length === 1 ? 'result' : 'results'} for "{searchTerm}"
            </p>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {results.map((watch) => (
                  <WatchCard key={watch.id} watch={watch} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border)]">
                <p className="text-[var(--color-text-primary)] font-medium text-lg">No timepieces found.</p>
                <p className="text-[var(--color-text-muted)] mt-2">Try adjusting your search terms or browse our collections.</p>
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
      <div className="min-h-screen bg-[var(--color-bg-primary)] py-12 md:py-20 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-brand)]" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
