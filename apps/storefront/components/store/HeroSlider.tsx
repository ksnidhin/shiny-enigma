"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"

export interface HeroSlide {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  linkText: string
  linkUrl: string
  categoryTag?: string
}

export const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "vintage-archive-01",
    imageUrl: "/watch_seiko_vintage_1785170846705.jpg",
    categoryTag: "VINTAGE WATCHES",
    title: "REAL VINTAGE WATCHES.",
    subtitle: "Authentic mechanical watches, tested and ready for daily wear.",
    linkText: "EXPLORE VINTAGE ↗",
    linkUrl: "/collections/all",
  },
  {
    id: "swiss-japanese-02",
    imageUrl: "/watch_swiss_vintage_1785170866472.jpg",
    categoryTag: "SWISS & JAPANESE",
    title: "TIMELESS CLASSICS.",
    subtitle: "Hand-wound and automatic watches with original character and history.",
    linkText: "VIEW COLLECTION ↗",
    linkUrl: "/collections/swiss-vintage",
  },
  {
    id: "hmt-heritage-03",
    imageUrl: "/hmt_vintage_watch_1785257285844.jpg",
    categoryTag: "INDIAN HERITAGE",
    title: "AUTHENTIC HMT.",
    subtitle: "Classic hand-wound watches made in India. Serviced and running smoothly.",
    linkText: "BROWSE HMT ↗",
    linkUrl: "/collections/hmt-watches",
  },
  {
    id: "casio-classics-04",
    imageUrl: "/watch_casio_edifice_1785170834699.jpg",
    categoryTag: "CASIO RELEASES",
    title: "EVERYDAY RELIABILITY.",
    subtitle: "Original Casio digital and quartz watches. Simple, tough, and genuine.",
    linkText: "SHOP CASIO ↗",
    linkUrl: "/collections/casio",
  },
]

export function HeroSlider({ initialSlides = [] }: { initialSlides?: HeroSlide[] }) {
  const slides = initialSlides.length > 0 ? initialSlides : DEFAULT_SLIDES
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  // Touch swipe support for mobile
  const touchStartX = React.useRef<number | null>(null)
  const touchEndX = React.useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
    setIsPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current
      if (diff > 45) {
        // Swiped left -> next slide
        nextSlide()
      } else if (diff < -45) {
        // Swiped right -> prev slide
        prevSlide()
      }
    }
    touchStartX.current = null
    touchEndX.current = null
    setIsPaused(false)
  }

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }, [slides.length])

  const prevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setProgress(0)
  }, [slides.length])

  // Progress timer for auto-advance
  React.useEffect(() => {
    if (slides.length <= 1 || isPaused) return

    const tickInterval = 50 // ms
    const slideDuration = 6000 // 6s per slide

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + (tickInterval / slideDuration) * 100
      })
    }, tickInterval)

    return () => clearInterval(timer)
  }, [isPaused, nextSlide, slides.length])

  const slide = slides[currentSlide] || slides[0]
  const currentFormatted = String(currentSlide + 1).padStart(2, "0")
  const totalFormatted = String(slides.length).padStart(2, "0")

  return (
    <section 
      className="relative w-full bg-[#0E1620] text-white overflow-hidden border-b border-[#1C2736]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Timepieces"
    >
      {/* Background radial gradient subtle highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1C2736]/60 via-[#0E1620] to-[#0E1620] pointer-events-none" />

      {/* Subtle vintage grid texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-10 md:py-16 relative z-10">
        
        {/* MOBILE VIEW FIRST LAYOUT */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          
          {/* Top Status Bar on Mobile (Tag + Counter) */}
          <div className="w-full flex items-center justify-between md:hidden pb-1 border-b border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C85A17] animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.18em] text-[#C85A17] uppercase">
                {slide.categoryTag || "VINTAGE WATCHES"}
              </span>
            </div>
            <span className="text-white/60 font-bold tracking-wider">
              {currentFormatted} / {totalFormatted}
            </span>
          </div>

          {/* Watch Image Box: Appears FIRST on Mobile for visual impact */}
          <div className="w-full md:col-span-5 md:order-2 relative">
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-sm overflow-hidden border border-white/15 shadow-2xl bg-[#141E2B] group">
              
              {/* High Quality Watch Image */}
              <Image
                key={slide.imageUrl}
                src={slide.imageUrl || "/hero_vintage_watch_1785170825322.jpg"}
                alt={slide.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 550px"
                className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
              />

              {/* Horological subtle vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1620]/80 via-[#0E1620]/20 to-transparent pointer-events-none" />

              {/* Corner crosshairs for vintage horological precision feel */}
              <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-white/30 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-white/30 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-white/30 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-white/30 pointer-events-none" />

              {/* Verification Badge overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#0E1620]/85 backdrop-blur-sm border border-white/15 text-[10px] font-mono font-bold tracking-wider text-white uppercase rounded-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C85A17]" />
                <span>AUTHENTICATED</span>
              </div>

              {/* Mobile Swipe / Arrow Controls on Image */}
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                aria-label="Previous slide"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0E1620]/70 hover:bg-[#0E1620] border border-white/20 text-white flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                aria-label="Next slide"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0E1620]/70 hover:bg-[#0E1620] border border-white/20 text-white flex items-center justify-center transition-all md:opacity-0 md:group-hover:opacity-100 shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Left / Below Column: Simple Words, Bold Heading & Direct CTA */}
          <div className="w-full md:col-span-7 md:order-1 flex flex-col justify-center space-y-4 sm:space-y-5">
            
            {/* Desktop Category Pill */}
            <div className="hidden md:flex items-center gap-2.5">
              <span className="w-6 h-[2px] bg-[#C85A17]" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#C85A17] uppercase">
                {slide.categoryTag || "VINTAGE WATCHES"}
              </span>
            </div>

            {/* Simple, Punchy Main Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] uppercase">
              {slide.title.includes(".") ? (
                <>
                  <span>{slide.title.split(".")[0]}.</span>
                  {slide.title.split(".")[1]?.trim() && (
                    <>
                      <br className="hidden sm:inline" />
                      <span className="text-white/90"> {slide.title.split(".")[1]?.trim()}</span>
                    </>
                  )}
                </>
              ) : (
                slide.title
              )}
            </h1>

            {/* Simple, Clear Subtitle */}
            <p className="text-sm sm:text-base text-[#D8D1C5] font-normal leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            {/* CTA Buttons: Full width on mobile, inline on desktop */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={slide.linkUrl || "/collections/all"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#C85A17] hover:bg-[#B34E12] active:scale-[0.98] text-white text-xs font-bold font-mono tracking-widest uppercase transition-all duration-200 shadow-lg shadow-[#C85A17]/25 text-center"
              >
                <span>{slide.linkText || "EXPLORE VINTAGE ↗"}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>

              <Link
                href="/collections/all"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white/90 text-xs font-bold font-mono tracking-wider uppercase transition-colors text-center"
              >
                <span>VIEW ALL WATCHES</span>
              </Link>
            </div>

            {/* Slide Navigation & Progress Bar */}
            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-white/60">
              
              {/* Progress Bars for all slides */}
              <div className="flex items-center gap-2 flex-1 max-w-md">
                {slides.map((_, idx) => {
                  const isActive = idx === currentSlide
                  const isPassed = idx < currentSlide
                  return (
                    <button
                      key={idx}
                      onClick={() => { setCurrentSlide(idx); setProgress(0); }}
                      aria-label={`Go to slide ${idx + 1}`}
                      className="group flex-1 py-2 cursor-pointer focus:outline-none"
                    >
                      <div className="h-[3px] w-full bg-white/20 rounded-full overflow-hidden transition-colors group-hover:bg-white/40">
                        <div
                          className={`h-full bg-white transition-all duration-100 ease-linear ${
                            isActive ? "bg-[#C85A17]" : isPassed ? "w-full bg-white/70" : "w-0"
                          }`}
                          style={{
                            width: isActive ? `${progress}%` : isPassed ? "100%" : "0%"
                          }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Desktop Slide Counter & Prev/Next Buttons */}
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <span className="font-bold tracking-wider text-white">
                  {currentFormatted} / {totalFormatted}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="p-1.5 hover:bg-white/10 rounded transition-colors text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="p-1.5 hover:bg-white/10 rounded transition-colors text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
