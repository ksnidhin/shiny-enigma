"use client"

import React, { useRef } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const INSTAGRAM_POST_IDS = [
  "DYj2lSlFNKZ",
  "DYj2bHzFA3S",
  "DYj2SKIlEh-",
  "DYjyrSElH5Q",
  "DYjyaXMFLcW",
  "DYjyQwsFA5o",
  "DYjyHQ0lGV8",
  "DYjxwXDFAzy",
  "DYcQHKzFIxU",
  "DX9RPpOlHWS"
]

export function InstagramFeed() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-16 md:py-20 bg-[#F4EFE6] border-b border-[#D8D1C5] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-mono font-bold text-[#C85A17]">/</span>
              <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#C85A17] uppercase">
                COMMUNITY &amp; DISPATCHES
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#11161B] tracking-tight uppercase">
              Follow The Workshop
            </h2>
            <p className="mt-2 text-[#5C646D] text-xs sm:text-sm font-mono max-w-xl">
              Daily vintage arrivals, movement timing graphs, and restoration stories live from Chennai.
            </p>
          </div>
          <Link
            href="https://www.instagram.com/retrotimeco.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-3 bg-[#0E1620] hover:bg-[#16212E] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all w-fit"
          >
            <InstagramIcon className="w-4 h-4 text-[#C85A17]" />
            <span>@retrotimeco.in</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative group">
          <button 
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0E1620] text-white shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-2"
          >
            {INSTAGRAM_POST_IDS.map((postId, idx) => (
              <div 
                key={idx}
                className="snap-start shrink-0 relative w-[280px] sm:w-[320px] h-[430px] overflow-hidden border border-[#D8D1C5] bg-[#F8F5EE]"
              >
                <iframe
                  src={`https://www.instagram.com/p/${postId}/embed/`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="w-full h-full border-none"
                />
              </div>
            ))}
          </div>

          <button 
            onClick={scrollRight}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0E1620] text-white shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
