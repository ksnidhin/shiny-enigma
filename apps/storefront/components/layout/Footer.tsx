import Link from "next/link"
import { Camera, Mail, MapPin, ShieldCheck, Truck, Clock } from "lucide-react"

const EXPLORE_LINKS = [
  { label: "Casio Watches", href: "/collections/casio" },
  { label: "Japanese Vintage Timepieces", href: "/collections/japanese-vintage" },
  { label: "Swiss Vintage Timepieces", href: "/collections/swiss-vintage" },
  { label: "HMT Heritage Watches", href: "/collections/hmt-watches" },
  { label: "Straps & Accessories", href: "/collections/straps-accessories" },
  { label: "Complete Horological Archive", href: "/collections/all" },
]

const POLICY_LINKS = [
  { label: "Authenticity Guarantee", href: "/pages/authenticity" },
  { label: "7-Day Replacement Policy", href: "/policies/refund" },
  { label: "Express Shipping & Insurance", href: "/policies/shipping" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms of Service", href: "/policies/terms" },
  { label: "Contact & Workshop Desk", href: "/policies/contact" },
]

export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-[#D8D1C5] bg-[#0E1620] text-white mt-auto pb-16 md:pb-0">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white">
              RetroTimeCo<span className="text-[#C85A17]">.</span>
            </h2>
            <p className="text-gray-300 max-w-md text-sm leading-relaxed font-light">
              Independent vintage horological archive based in Chennai. Specializing in curated 1960s–1990s Japanese mechanicals, Swiss chronometers, and iconic Casio references. Every piece physically inspected, regulated for timekeeping, and backed by our authenticity guarantee.
            </p>
            <div className="text-xs text-gray-400 flex items-start gap-2 pt-2">
              <MapPin className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" />
              <span>
                RetroTimeCo Horological Workshop<br />
                372 Beach View, Chennai, Tamil Nadu — 600019
              </span>
            </div>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-wider text-gray-300">
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">
                Authenticity Inspected
              </span>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-sm">
                Tracked India-Wide
              </span>
            </div>
          </div>

          {/* Explore Collections */}
          <div>
            <h3 className="font-bold mb-4 text-[#C85A17] uppercase text-xs tracking-[0.18em]">
              The Archive
            </h3>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Guarantees */}
          <div>
            <h3 className="font-bold mb-4 text-[#C85A17] uppercase text-xs tracking-[0.18em]">
              Standards &amp; Policies
            </h3>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-mono">
          <p>
            &copy; {new Date().getFullYear()} RetroTimeCo. Horological Archive India.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="https://instagram.com/retrotimeco.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>@retrotimeco.in</span>
            </a>
            <a 
              href="mailto:help@retrotimeco.in" 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>help@retrotimeco.in</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
