import Link from "next/link"
import { Camera, Mail, MapPin } from "lucide-react"

const EXPLORE_LINKS = [
  { label: "Casio Watches", href: "/collections/casio" },
  { label: "Japanese Vintage Timepieces", href: "/collections/japanese-vintage" },
  { label: "Swiss Vintage Timepieces", href: "/collections/swiss-vintage" },
  { label: "HMT Watches", href: "/collections/hmt-watches" },
  { label: "Straps & Accessories", href: "/collections/straps-accessories" },
]

const POLICY_LINKS = [
  { label: "Refund Policy", href: "/policies/refund" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms of Service", href: "/policies/terms" },
  { label: "Shipping Policy", href: "/policies/shipping" },
  { label: "Contact Information", href: "/policies/contact" },
  { label: "Authenticity Guarantee", href: "/pages/authenticity" },
]

export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-[var(--color-border)] bg-[var(--color-brand)] text-white mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-heading text-3xl font-bold tracking-tight">RetroTimeCo<span className="text-[var(--color-accent)]">.</span></h2>
            <p className="text-white/80 max-w-md text-sm leading-relaxed">
              The Perfect Destination for New & Pre-owned Watches. Curated rare Japanese & Swiss vintage timepieces, new Casio releases, and premium watch accessories. 100% authentic, verified by expert horologists. Fast shipping across India.
            </p>
            <div className="text-xs text-white/60 flex items-start gap-2 mt-2">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
               372 Beach View,<br/>
                CHENNAI, Tamil Nadu-600019
              </span>
            </div>
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs tracking-wider uppercase font-semibold px-2.5 py-1 bg-white/10 rounded border border-white/20">100% Authentic</span>
              <span className="text-xs tracking-wider uppercase font-semibold px-2.5 py-1 bg-white/10 rounded border border-white/20">All-India Express Delivery</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white uppercase text-xs tracking-wider">Explore Collections</h3>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
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
            <h3 className="font-semibold mb-4 text-white uppercase text-xs tracking-wider">Policies & Help</h3>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
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
          <div className="flex items-center gap-6 text-xs text-white/60">
            <a href="https://instagram.com/retrotimeco.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              <Camera className="w-4 h-4" />
              <span>@retrotimeco.in</span>
            </a>
            <a href="mailto:help@retrotimeco.in" className="hover:text-white transition-colors flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>help@retrotimeco.in</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
