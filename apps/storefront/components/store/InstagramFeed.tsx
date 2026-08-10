"use client"

import React, { useState, useEffect, useRef } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

// We use Instagram embed iframes here so the posts are live and don't rely on expiring Facebook CDN image tokens!
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
    <section className="py-24 bg-white border-t border-[var(--color-border)] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-[var(--color-text-primary)] tracking-tight">
              Join the Club
            </h2>
            <p className="mt-4 text-[var(--color-text-secondary)] text-lg">
              Follow our daily horological discoveries and behind-the-scenes restoration work on Instagram.
            </p>
          </div>
          <Link
            href="https://www.instagram.com/retrotimeco.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-bold text-sm tracking-wider uppercase shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all w-fit"
          >
            <InstagramIcon className="w-5 h-5" />
            <span>@retrotimeco.in</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative group">
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#202223] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {INSTAGRAM_POST_IDS.map((postId, idx) => (
              <div 
                key={idx}
                className="snap-start shrink-0 relative w-[320px] h-[450px] rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] bg-[#fafafa]"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-[#202223] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
