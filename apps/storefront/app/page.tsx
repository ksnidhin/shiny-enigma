import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Wrench, Package, ArrowRight, ArrowUpRight } from "lucide-react"
import { HeroSlider } from "@/components/store/HeroSlider"
import { WatchCard } from "@/components/store/WatchCard"
import { DynamicReviews } from "@/components/store/DynamicReviews"
import { InstagramFeed } from "@/components/store/InstagramFeed"
import { fetchWatches, fetchStats } from "@/lib/api"

async function getHeroSlides() {
  try {
    const res = await fetch("http://localhost:9000/api/hero", { next: { revalidate: 60 } })
    const json = await res.json()
    if (json.success && json.data.length > 0) return json.data
  } catch {}
  return []
}

const TYPE_CATEGORIES = [
  {
    title: "Japanese",
    image: "/brand_japanese_hq.png",
    href: "/collections/japanese-vintage",
  },
  {
    title: "Swiss",
    image: "/brand_swiss_hq.png",
    href: "/collections/swiss-vintage",
  },
  {
    title: "Indian",
    image: "/brand_indian_hq.png",
    href: "/collections/hmt-watches",
  },
  {
    title: "Digital",
    image: "/brand_digital_hq.png",
    href: "/collections/casio",
  },
]

export default async function Home() {
  const [slides, watchesRes] = await Promise.all([
    getHeroSlides(),
    fetchWatches({ in_stock: true, sort: "newest" }),
  ])

  // Prioritize recently added unsold watches first
  const getWatchTimestamp = (w: any): number => {
    const match = (w.id || "").match(/\d{10,13}/)
    return match ? parseInt(match[0], 10) : 0
  }

  const latestWatches = watchesRes.success && Array.isArray(watchesRes.data)
    ? watchesRes.data
        .filter((w) => w.in_stock)
        .sort((a, b) => {
          const tA = getWatchTimestamp(a)
          const tB = getWatchTimestamp(b)
          if (tB !== tA) return tB - tA
          return b.id.localeCompare(a.id)
        })
        .slice(0, 8)
    : []

  return (
    <div className="flex flex-col min-h-screen bg-[#F4EFE6]">
      {/* 1. Hero Showcase Slider */}
      <HeroSlider initialSlides={slides} />

      {/* 2. Trust & Standards Strip (Reference 1 3-column divided layout) */}
      <section className="border-b border-[#D8D1C5] bg-[#F4EFE6] py-5">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8D1C5] text-center">
            
            <div className="flex items-center justify-center gap-3 py-3 md:py-1 px-4">
              <ShieldCheck className="w-5 h-5 text-[#C85A17] shrink-0" />
              <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#11161B]">
                AUTHENTICITY CHECKED
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 py-3 md:py-1 px-4">
              <Wrench className="w-5 h-5 text-[#C85A17] shrink-0" />
              <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#11161B]">
                SERVICED BEFORE DISPATCH
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 py-3 md:py-1 px-4">
              <Package className="w-5 h-5 text-[#C85A17] shrink-0" />
              <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#11161B]">
                TRACKED INDIA-WIDE
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Browse By Type Section (Reference 1) */}
      <section className="py-12 md:py-16 border-b border-[#D8D1C5]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight uppercase text-[#11161B]">
              BROWSE BY TYPE
            </h2>
            <Link 
              href="/collections/all"
              className="font-mono text-xs font-bold uppercase tracking-wider text-[#11161B] hover:text-[#C85A17] flex items-center gap-1 transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4 Brand Cards in 1 Row (4 columns on all devices matching design reference) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3.5 md:gap-4">
            {TYPE_CATEGORIES.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative aspect-[5/4] sm:aspect-[4/3] overflow-hidden bg-[#16212E] border border-[#D8D1C5] hover:border-[#11161B] transition-all shadow-sm"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 25vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 right-1">
                  <h3 className="font-heading text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-[#C85A17] transition-colors leading-tight">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Latest Drops / JUST ENTERED THE ARCHIVE (Reference 1) */}
      <section className="py-12 md:py-16 border-b border-[#D8D1C5]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Section Header with Burnt Orange Slash */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#C85A17]">/</span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight uppercase text-[#11161B]">
                JUST ENTERED THE ARCHIVE
              </h2>
            </div>
            <Link 
              href="/collections/all"
              className="font-mono text-xs font-bold uppercase tracking-wider text-[#11161B] hover:text-[#C85A17] flex items-center gap-1 transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Grid (2 columns on mobile, 4 columns on desktop) */}
          {latestWatches.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {latestWatches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#F8F5EE] border border-[#D8D1C5] p-8">
              <p className="font-mono text-sm text-[#5C646D]">No newly added archive timepieces found.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Workshop Feature Split Banner ("BEFORE IT REACHES YOU.") */}
      <section className="border-b border-[#D8D1C5] bg-[#0E1620] text-white">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
          {/* Left: Movement Macro Photography */}
          <div className="md:col-span-6 relative h-64 md:h-auto min-h-[260px] bg-[#16212E] overflow-hidden">
            <Image
              src="/hero_vintage_watch_1785170825322.jpg"
              alt="Horological regulation and movement inspection"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0E1620]/60 hidden md:block" />
          </div>

          {/* Right: Inspection Standards */}
          <div className="md:col-span-6 p-8 md:p-14 lg:p-16 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#C85A17]" />
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#C85A17] uppercase">
                HOROLOGICAL WORKSHOP STANDARDS
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight uppercase leading-tight">
              BEFORE IT REACHES YOU<span className="text-[#C85A17]">.</span>
            </h2>

            <p className="font-mono text-sm sm:text-base text-gray-300 font-medium tracking-wide">
              Inspect. Regulate. Photograph. Dispatch.
            </p>

            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed max-w-lg">
              Every mechanical and quartz vintage piece is physically opened, demagnetized, timed on a digital timegrapher, and checked for authentic parts before being certified.
            </p>

            <div className="pt-2">
              <Link
                href="/pages/authenticity"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#C85A17] hover:text-white transition-colors"
              >
                <span>SEE HOW WE CHECK EACH WATCH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Horological Archive Blueprint ("More Than a Store.") */}
      <section className="py-12 md:py-16 border-b border-[#D8D1C5] bg-[#F4EFE6]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Archive Technical Blueprint Card */}
            <div className="md:col-span-5 bg-[#EAE4D9] border border-[#D8D1C5] p-6 relative">
              <div className="border border-dashed border-[#5C646D]/40 p-6 flex flex-col justify-between h-56">
                <div>
                  <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#11161B] block">
                    THE ARCHIVE
                  </span>
                  <div className="font-mono text-[11px] text-[#5C646D] mt-2 space-y-0.5">
                    <p>Ref. 7009 / Calibre 7009A</p>
                    <p>Automatic 17 Jewels</p>
                    <p>c. 1970s Golden Era</p>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-[#C85A17] font-bold tracking-wider uppercase">
                  VERIFIED INDEPENDENT HOROLOGY
                </div>
              </div>
            </div>

            {/* Right: Story & Mission */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-[3px] h-14 bg-[#D8D1C5] shrink-0" />
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#11161B]">
                    More Than a Store<span className="text-[#C85A17]">.</span>
                  </h2>
                  <p className="text-sm text-[#5C646D] leading-relaxed mt-2 max-w-xl">
                    A curated archive of vintage timepieces for collectors, enthusiasts and new explorers. We believe in preserving mechanical heritage, giving storied watches second lives on appreciative wrists.
                  </p>
                </div>
              </div>

              <div className="pt-2 pl-5">
                <Link
                  href="/policies/contact"
                  className="font-mono text-xs font-bold uppercase tracking-wider text-[#C85A17] hover:text-[#11161B] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>ABOUT RETROTIMECO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Community Reviews */}
      <section className="py-14 md:py-18 bg-[#F4EFE6] border-b border-[#D8D1C5]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#C85A17] uppercase block mb-2">
              COMMUNITY VOICES
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#11161B]">
              Trusted by Collectors
            </h2>
          </div>
          <DynamicReviews />
        </div>
      </section>

      {/* 8. Instagram Showcase */}
      <InstagramFeed />
    </div>
  )
}
