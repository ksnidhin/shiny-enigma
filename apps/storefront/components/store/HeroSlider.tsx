"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface HeroSlide {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  linkText: string
  linkUrl: string
  categoryTag?: string
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "vintage-archive-01",
    imageUrl: "/watch_seiko_vintage_1785170846705.jpg",
    categoryTag: "VINTAGE WATCHES",
    title: "GOOD WATCHES. SECOND LIVES.",
    subtitle: "Authentic vintage timepieces, checked and ready for another wrist.",
    linkText: "BROWSE THE ARCHIVE ↗",
    linkUrl: "/collections/all",
  },
  {
    id: "swiss-vintage-02",
    imageUrl: "/watch_swiss_vintage_1785170866472.jpg",
    categoryTag: "MAISON HORLOGÈRE",
    title: "GENEVA HERITAGE. PRECISION REGULATED.",
    subtitle: "Collector-grade Swiss mechanicals and chronometers, inspected under magnification.",
    linkText: "EXPLORE SWISS ARCHIVE ↗",
    linkUrl: "/collections/swiss-vintage",
  },
  {
    id: "casio-japan-03",
    imageUrl: "/watch_casio_edifice_1785170834699.jpg",
    categoryTag: "DIGITAL & RETRO CLASSICS",
    title: "TIMELESS UTILITY. ICONIC DESIGN.",
    subtitle: "Official Casio Royale, Vintage Digital, and Edifice editions authenticated in-house.",
    linkText: "DISCOVER CASIO ↗",
    linkUrl: "/collections/casio",
  },
]

export function HeroSlider({ initialSlides = [] }: { initialSlides?: HeroSlide[] }) {
  const [slides] = React.useState<HeroSlide[]>(
    initialSlides.length > 0 ? initialSlides : DEFAULT_SLIDES
  )
  const [currentSlide, setCurrentSlide] = React.useState(0)

  // Auto-advance slides every 6 seconds
  React.useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  const slide = slides[currentSlide] || DEFAULT_SLIDES[0]
  const currentFormatted = String(currentSlide + 1).padStart(2, "0")
  const totalFormatted = String(slides.length).padStart(2, "0")

  return (
    <section className="relative w-full bg-[#0E1620] text-white overflow-hidden border-b border-[#1C2736]">
      {/* Background radial gradient subtle highlight */}
      <div className="absolute inset-0 bg-radial-gradient from-[#1A2636]/40 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-5 z-10">
            {/* Category Pill with burnt orange accent dash */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#C85A17]" />
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#C85A17] uppercase">
                {slide.categoryTag || "VINTAGE WATCHES"}
              </span>
            </div>

            {/* Main Headline (Multi-line high impact) */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] uppercase">
              {slide.title.includes(".") ? (
                <>
                  {slide.title.split(".")[0]}.<br />
                  <span className="text-white/95">{slide.title.split(".")[1]?.trim() || ""}</span>
                </>
              ) : (
                slide.title
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-300 font-light max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Link
                href={slide.linkUrl || "/collections/all"}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#C85A17] hover:bg-[#B34E12] text-white text-xs font-bold font-mono tracking-widest uppercase transition-all duration-200 shadow-lg shadow-[#C85A17]/20"
              >
                <span>{slide.linkText || "BROWSE THE ARCHIVE ↗"}</span>
              </Link>
            </div>

            {/* Slide Pagination Counter matching Reference 1 */}
            <div className="pt-6 flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="text-white font-bold tracking-wider">
                {currentFormatted} / {totalFormatted}
              </span>
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-[2px] transition-all duration-300 ${
                      idx === currentSlide ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Horological Watch Imagery */}
          <div className="md:col-span-5 relative">
            <div className="relative aspect-4/3 sm:aspect-square w-full rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-[#16212E]">
              <Image
                src={slide.imageUrl || "/hero_vintage_watch_1785170825322.jpg"}
                alt={slide.title}
                fill
                priority
                className="object-cover object-center transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1620]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
