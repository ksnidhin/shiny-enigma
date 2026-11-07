import Link from "next/link"
import { MobileMenu } from "./MobileMenu"
import { CartNavIcon } from "./CartNavIcon"
import { Search, ChevronDown, Truck } from "lucide-react"
import { fetchCollections } from "@/lib/api"

export async function Nav() {
  const collectionsRes = await fetchCollections()
  const activeCollections = collectionsRes.success && collectionsRes.data.length > 0 
    ? collectionsRes.data 
    : []

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D8D1C5] bg-[#F4EFE6]/95 backdrop-blur-md transition-all">
      {/* Top Announcement Banner - Dark Archive Navy */}
      <div className="bg-[#0E1620] text-white/90 text-[10px] sm:text-xs font-semibold py-2 px-4 text-center tracking-[0.18em] uppercase flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5 text-[#C85A17]" />
        <span>COMPLIMENTARY EXPRESS SHIPPING • INDIA-WIDE</span>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Mobile menu & Brand */}
        <div className="flex items-center gap-3 md:gap-6">
          <MobileMenu collections={activeCollections} />
          
          <Link 
            href="/" 
            className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-[#0E1622] hover:opacity-95 transition-opacity"
          >
            RetroTimeCo<span className="text-[#C85A17]">.</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            href="/collections/all"
            className="text-xs font-bold tracking-[0.15em] uppercase text-[#11161B] hover:text-[#C85A17] transition-colors py-2"
          >
            SHOP ALL
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-1.5 text-xs font-bold tracking-[0.15em] uppercase text-[#11161B] hover:text-[#C85A17] transition-colors py-2">
              COLLECTIONS
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-250 group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#F8F5EE] border border-[#D8D1C5] shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50 flex flex-col py-2">
              <Link
                href="/collections/all"
                className="px-5 py-2.5 text-xs font-bold tracking-wider text-[#11161B] hover:bg-[#EAE4D9] hover:text-[#C85A17] transition-colors border-b border-[#D8D1C5]"
              >
                VIEW COMPLETE ARCHIVE
              </Link>
              {activeCollections.map((col: any) => (
                <Link
                  key={col.href}
                  href={col.href}
                  className="px-5 py-2.5 text-xs font-medium tracking-wide text-[#11161B] hover:bg-[#EAE4D9] hover:text-[#C85A17] transition-colors"
                >
                  {col.title}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/pages/authenticity"
            className="text-xs font-bold tracking-[0.15em] uppercase text-[#11161B] hover:text-[#C85A17] transition-colors py-2"
          >
            AUTHENTICITY
          </Link>

          <Link
            href="/policies/shipping"
            className="text-xs font-bold tracking-[0.15em] uppercase text-[#11161B] hover:text-[#C85A17] transition-colors py-2"
          >
            SHIPPING
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <Link 
            href="/search" 
            className="p-2 text-[#0E1622] hover:text-[#C85A17] focus-ring rounded-full transition-colors" 
            aria-label="Search Timepieces"
          >
            <Search className="h-5 w-5" />
          </Link>

          <CartNavIcon />
        </div>
      </div>
    </header>
  )
}
