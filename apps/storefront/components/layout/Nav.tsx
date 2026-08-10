import Link from "next/link"
import { MobileMenu } from "./MobileMenu"
import { ShoppingBag, Search, ChevronDown } from "lucide-react"
import { fetchCollections } from "@/lib/api"

export async function Nav() {
  const collectionsRes = await fetchCollections()
  const activeCollections = collectionsRes.success && collectionsRes.data.length > 0 
    ? collectionsRes.data 
    : []

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-all">
      {/* Top Banner */}
      <div className="bg-[var(--color-brand)] text-white text-xs font-medium py-1.5 px-4 text-center tracking-wider uppercase">
        ⚡ All-India Express Delivery Ready To Ship — Verified Horological Pieces ⚡
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MobileMenu collections={activeCollections} />
          <Link 
            href="/" 
            className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-brand)] focus-ring rounded-[var(--radius)] px-2 -ml-2"
          >
            RetroTimeCo<span className="text-[var(--color-accent)]">.</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center space-x-6">
          <div className="group relative">
            <button className="flex items-center gap-1 text-xs font-semibold tracking-wider uppercase text-[var(--color-text-primary)] hover:text-[var(--color-accent)] focus-ring rounded-[var(--radius)] px-2 py-2 transition-colors">
              COLLECTIONS
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
              <Link
                href="/collections/all"
                className="px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)] transition-colors border-b border-[var(--color-border)]"
              >
                VIEW ALL COLLECTIONS
              </Link>
              {activeCollections.map((col: any) => (
                <Link
                  key={col.href}
                  href={col.href}
                  className="px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {col.title}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <Link href="/search" className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-full transition-colors" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>

          <Link href="/cart" className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-full transition-colors relative" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
