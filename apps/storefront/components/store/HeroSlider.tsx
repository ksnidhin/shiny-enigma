"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

interface HeroSlide {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  linkText: string
  linkUrl: string
}

export function HeroSlider({ initialSlides = [] }: { initialSlides?: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // If not provided from server, fetch from client
    if (initialSlides.length === 0) {
      fetch("/api/hero")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data.length > 0) {
            setSlides(data.data)
          }
        })
    }
  }, [initialSlides])

  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  if (slides.length === 0) {
    return (
      <section className="relative w-full bg-[#111] text-white overflow-hidden py-20 lg:py-32 flex items-center justify-center">
        <p className="text-white/50">Loading Hero...</p>
      </section>
    )
  }

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  return (
    <section className="relative w-full bg-[#111] text-white overflow-hidden h-[80vh] min-h-[500px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
            {slide.imageUrl && (
              <Image 
                src={slide.imageUrl} 
                alt={slide.title} 
                fill 
                className="object-cover object-center"
                priority={index === 0}
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          
          <div className="container relative mx-auto px-4 md:px-6 lg:px-8 flex flex-col justify-center h-full max-w-3xl">
            {slide.subtitle && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 max-w-fit">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <span className="text-xs font-medium tracking-wider uppercase">{slide.subtitle}</span>
              </div>
            )}
            
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              {slide.title || "The Perfect Destination for Timeless Watches"}
            </h1>
            
            {slide.linkUrl && slide.linkText && (
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link 
                  href={slide.linkUrl}
                  className="px-8 py-4 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-medium rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-sm tracking-wider uppercase"
                >
                  <span>{slide.linkText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {slides.length > 1 && (
        <>
          <button 
            onClick={handlePrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 border border-white/10 backdrop-blur flex items-center justify-center text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 border border-white/10 backdrop-blur flex items-center justify-center text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? "bg-white w-8" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
