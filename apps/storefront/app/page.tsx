import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Star, Heart } from "lucide-react"
import { FeaturedWatchesSection } from "@/components/store/FeaturedWatchesSection"
import { HeroSlider } from "@/components/store/HeroSlider"
import { DynamicReviews } from "@/components/store/DynamicReviews"
import { InstagramFeed } from "@/components/store/InstagramFeed"
import { fetchStats } from "@/lib/api"

async function getHeroSlides() {
  try {
    const res = await fetch("http://localhost:9000/api/hero", { next: { revalidate: 60 } })
    const json = await res.json()
    if (json.success && json.data.length > 0) return json.data
  } catch (e) {
    // fallback
  }
  return [
    {
      id: "default",
      imageUrl: "/hero_vintage_watch_1785170825322.jpg",
      title: "The Perfect Destination for Timeless Watches.",
      subtitle: "India's Premier Watch Haven",
      linkText: "Explore Vintage",
      linkUrl: "/store"
    }
  ]
}

const COLLECTIONS = [
  {
    id: "casio",
    title: "Casio Watches",
    subtitle: "New & Retro Models",
    image: "/watch_casio_edifice_1785170834699.jpg",
    href: "/collections/casio",
    badge: "Official & Authenticated"
  },
  {
    id: "japanese-vintage",
    title: "Japanese Vintage",
    subtitle: "Seiko, Citizen & Orient",
    image: "/watch_seiko_vintage_1785170846705.jpg",
    href: "/collections/japanese-vintage",
    badge: "Rare Finds"
  },
  {
    id: "swiss-vintage",
    title: "Swiss Vintage",
    subtitle: "Maison Horlogère",
    image: "/watch_swiss_vintage_1785170866472.jpg",
    href: "/collections/swiss-vintage",
    badge: "Collector Grade"
  },
  {
    id: "hmt-watches",
    title: "HMT Watches",
    subtitle: "Heritage Indian Timepieces",
    image: "/hmt_vintage_watch_1785257285844.jpg",
    href: "/collections/hmt-watches",
    badge: "Bestseller"
  },
  {
    id: "straps-accessories",
    title: "Straps & Clasps",
    subtitle: "Premium Leather & NATO",
    image: "/watch_accessories_1785170889478.jpg",
    href: "/collections/straps-accessories",
    badge: "From Rs. 349"
  },
  {
    id: "storage",
    title: "Watch Boxes & Storage",
    subtitle: "Solid Wood & Travel Cases",
    image: "/watch_accessories_1785170889478.jpg",
    href: "/collections/storage",
    badge: "Coming Soon"
  }
]

export default async function Home() {
  const statsRes = await fetchStats()
  const breakdown = statsRes?.data?.collection_breakdown || {}
  const slides = await getHeroSlides()

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider initialSlides={slides} />


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
                  <h3 className="font-heading font-bold text-[var(--color-text-primary)] text-xl mb-1 group-hover:text-[var(--color-brand)] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                    {breakdown[col.id] > 0 ? `${breakdown[col.id]} Pieces` : col.subtitle}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between text-xs font-bold tracking-wider text-[var(--color-brand)] uppercase pt-4 border-t border-black/5">
                  <span>Join Waitlist</span>
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
      {/* <FeaturedWatchesSection /> - Disabled for Waitlist Phase */}

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
            <h3 className="font-heading text-xl font-bold text-white mb-2">Sell your collection</h3>
            <p className="text-xs text-white/90 leading-relaxed">
              We specialize in sourcing and restoring vintage timepieces. If you have a collection or a single piece you'd like to part with, our horologists will offer you a fair market valuation.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Community Reviews Section */}
      <section className="py-20 bg-[var(--color-bg-primary)]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[var(--color-brand)] font-bold tracking-widest uppercase text-xs">Community Voices</span>
            <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mt-3">
              Trusted by Collectors
            </h2>
          </div>
          <DynamicReviews />
        </div>
      </section>

      {/* Instagram Integration */}
      <InstagramFeed />
    </div>
  );
}
