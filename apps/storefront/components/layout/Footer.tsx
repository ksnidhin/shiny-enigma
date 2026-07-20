import Link from "next/link"

const FOOTER_LINKS = [
  { label: "Live Watches", href: "/watches" },
  { label: "Archive", href: "/archive" },
  { label: "Brands", href: "/brands" },
  { label: "Authenticity", href: "/authenticity" },
  { label: "Contact", href: "/contact" },
  { label: "Condition & Service", href: "/condition-service" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "FAQ", href: "/faq" },
]

export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-[var(--color-border)] bg-[var(--color-brand)] text-white mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight">RetroTimeCo</h2>
            <p className="text-white/80 max-w-sm text-sm leading-relaxed">
              Curated vintage timepieces, verified for authenticity and function. 
              Every watch is a specific physical piece with its own history.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Explore</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Policies</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.slice(5).map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} RetroTimeCo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
