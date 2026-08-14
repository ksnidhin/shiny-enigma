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
      <div className="bg-[var(--color-brand)] text-white/90 text-[10px] sm:text-xs font-medium py-2 px-4 text-center tracking-[0.15em] uppercase">
        Complimentary express shipping across India on all vintage timepieces
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
        <nav className="hidden xl:flex items-center space-x-8">
          <Link
            href="/collections/all"
            className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-primary)] hover:text-[var(--color-accent)] focus-ring rounded-[var(--radius)] py-2 transition-colors"
          >
            SHOP ALL
          </Link>
          <div className="group relative">
            <button className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[var(--color-text-primary)] hover:text-[var(--color-accent)] focus-ring rounded-[var(--radius)] py-2 transition-colors">
              COLLECTIONS
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-4 w-64 bg-white border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-custom)] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50 flex flex-col py-2 overflow-hidden">
              <Link
                href="/collections/all"
                className="px-5 py-3 text-xs font-bold tracking-wider text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-accent)] transition-colors border-b border-[var(--color-border)]"
              >
                VIEW ALL COLLECTIONS
              </Link>
              {activeCollections.map((col: any) => (
                <Link
                  key={col.href}
                  href={col.href}
                  className="px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-accent)] transition-colors"
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
