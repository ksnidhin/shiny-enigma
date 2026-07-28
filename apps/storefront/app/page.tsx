import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Star, Heart } from "lucide-react"
import { FeaturedWatchesSection } from "@/components/store/FeaturedWatchesSection"

const COLLECTIONS = [
  {
    title: "New Casio Watches",
    subtitle: "199+ Models Online",
    image: "/watch_casio_edifice_1785170834699.jpg",
    href: "/collections/casio",
    badge: "Official & Authenticated"
  },
  {
    title: "Japanese Vintage",
    subtitle: "Seiko, Citizen & Orient from Tokyo",
    image: "/watch_seiko_vintage_1785170846705.jpg",
    href: "/collections/japanese-vintage",
    badge: "Rare Finds"
  },
  {
    title: "Swiss Vintage",
    subtitle: "Maison Horlogère — 81 Authenticated Pieces",
    image: "/watch_swiss_vintage_1785170866472.jpg",
    href: "/collections/swiss-vintage",
    badge: "Collector Grade"
  },
  {
    title: "Luxury Chronographs",
    subtitle: "Precision Racing & Pilot Timepieces",
    image: "/watch_casio_edifice_1785170834699.jpg",
    href: "/collections/all",
    badge: "Bestseller"
  },
  {
    title: "Straps & Clasps",
    subtitle: "Premium Leather, NATO & Butterfly Clasps",
    image: "/watch_accessories_1785170889478.jpg",
    href: "/collections/straps-accessories",
    badge: "From Rs. 349"
  }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-[#111] text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <Image 
            src="/hero_vintage_watch_1785170825322.jpg" 
            alt="Vintage Japanese Automatic Watch" 
            fill 
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        
        <div className="container relative mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-start max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-xs font-medium tracking-wider uppercase">India&apos;s Premier Watch Haven</span>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            The Perfect Destination for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">Timeless Watches</span>.
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 font-light max-w-2xl mb-10 leading-relaxed">
            Explore rare Japanese &amp; Swiss vintage timepieces sourced directly from Tokyo &amp; Geneva, alongside the complete lineup of new Casio models and premium straps. Every piece 100% authenticated.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              href="/collections/japanese-vintage"
              className="px-8 py-4 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-sm tracking-wider uppercase"
            >
              <span>Explore Vintage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/collections/casio"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full backdrop-blur-md border border-white/20 transition-all text-sm tracking-wider uppercase"
            >
              Shop New Casio (199+)
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">100% Authenticity Guaranteed</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">Verified by expert watchmakers</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)]">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">Express Shipping Across India</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">Free on orders above Rs. 499</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">Fully Serviced &amp; Restored</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">Vintage pieces regulated for accuracy</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">Curated Horological Archive</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">Handpicked for collectors &amp; enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories Grid */}
      <section className="py-20 container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase mb-2">Curated Worlds</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[var(--color-text-primary)]">
            Explore Our Collections
          </h2>
          <div className="w-12 h-0.5 bg-[var(--color-accent)] mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COLLECTIONS.map((col, idx) => (
            <Link 
              key={col.href}
              href={col.href}
              className={`group relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white shadow-[var(--shadow-custom)] hover:shadow-2xl transition-all duration-500 flex flex-col ${
                idx === 0 || idx === 1 ? "md:col-span-1 lg:col-span-1" : ""
              }`}
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#EBE5DC]">
                <Image 
                  src={col.image} 
                  alt={col.title} 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[var(--color-brand)] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {col.badge}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1 justify-between bg-white group-hover:bg-[#FCFAFA] transition-colors">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">
                    {col.subtitle}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between text-xs font-bold tracking-wider text-[var(--color-brand)] uppercase pt-4 border-t border-black/5">
                  <span>Explore Collection</span>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center group-hover:bg-[var(--color-brand)] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dynamic Featured Watches Section */}
      <FeaturedWatchesSection />

      {/* Sell / Consign Spotlight */}
      <section className="py-20 container mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#173528] to-[#0F241B] rounded-3xl p-8 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-xl space-y-6 relative z-10">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase block">Horological Consignment</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold leading-tight">
              Looking to Sell Your Vintage Timepiece?
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-light">
              We offer instant fair valuations and direct purchase for vintage Seiko, Citizen, HMT, and Swiss luxury timepieces. Turn your collector items into instant cash or store credit with verified horologists.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/pages/sell"
                className="px-8 py-4 bg-[var(--color-accent)] hover:bg-[#b88c47] text-white font-bold rounded-xl text-xs tracking-widest uppercase transition-all shadow-xl"
              >
                Get Watch Valuation
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-amber-300">
              <Star className="w-5 h-5 fill-amber-300" />
              <Star className="w-5 h-5 fill-amber-300" />
              <Star className="w-5 h-5 fill-amber-300" />
              <Star className="w-5 h-5 fill-amber-300" />
              <Star className="w-5 h-5 fill-amber-300" />
              <span className="text-white font-bold ml-1 text-sm">4.9 / 5.0</span>
            </div>
            <p className="text-xs text-white/90 italic leading-relaxed">
              &quot;I bought a 1972 King Seiko from RetroTimeCo. Not only was the condition pristine, but the timekeeping after their in-house regulation was spot on (+2 sec/day). Best vintage watch experience in India!&quot;
            </p>
            <div className="text-[11px] text-white/60 font-semibold uppercase tracking-wider">
              — Siddharth R., Collector from Bangalore
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
