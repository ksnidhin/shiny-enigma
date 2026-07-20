import Link from "next/link"
import { MobileMenu } from "./MobileMenu"

const NAV_LINKS = [
  { label: "Live Watches", href: "/watches" },
  { label: "Archive", href: "/archive" },
  { label: "Brands", href: "/brands" },
  { label: "Authenticity", href: "/authenticity" },
  { label: "Contact", href: "/contact" },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-heading text-2xl font-bold tracking-tight text-[var(--color-brand)] focus-ring rounded-[var(--radius)] px-2 -ml-2"
        >
          RetroTimeCo
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-[var(--radius)] px-3 py-2 -mx-3 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Nav */}
        <MobileMenu />
      </div>
    </header>
  )
}
