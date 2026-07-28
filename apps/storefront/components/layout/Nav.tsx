import Link from "next/link"
import { MobileMenu } from "./MobileMenu"
import { ShoppingBag, Search, User } from "lucide-react"

const NAV_LINKS = [
  { label: "CASIO", href: "/collections/casio" },
  { label: "JAPANESE VINTAGE", href: "/collections/japanese-vintage" },
  { label: "SWISS VINTAGE", href: "/collections/swiss-vintage" },
  { label: "LUXURY CHRONOGRAPHS", href: "/collections/all" },
  { label: "STRAPS & ACCESSORIES", href: "/collections/straps-accessories" },
  { label: "SELL YOUR WATCH", href: "/pages/sell" },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md transition-all">
      {/* Top Banner */}
      <div className="bg-[var(--color-brand)] text-white text-xs font-medium py-1.5 px-4 text-center tracking-wider uppercase">
        ⚡ All-India Express Delivery Ready To Ship — Verified Horological Pieces ⚡
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MobileMenu />
          <Link 
            href="/" 
            className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-brand)] focus-ring rounded-[var(--radius)] px-2 -ml-2"
          >
            RetroTimeCo<span className="text-[var(--color-accent)]">.</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center space-x-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-primary)] hover:text-[var(--color-accent)] focus-ring rounded-[var(--radius)] px-2 py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <button className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-full transition-colors" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/account/login" className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-full transition-colors hidden sm:block" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-full transition-colors relative" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
