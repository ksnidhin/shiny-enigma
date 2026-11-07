"use client"

import React, { useEffect, useState } from "react"
import { Save, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2, UploadCloud, RotateCcw, Image as ImageIcon } from "lucide-react"
import { saveHeroSlides } from "../../admin-actions"
import { uploadImage } from "@/lib/api"
import Image from "next/image"

interface HeroSlide {
  id: string
  imageUrl: string
  categoryTag?: string
  title: string
  subtitle: string
  linkText: string
  linkUrl: string
}

const PRESET_HIGH_RES_IMAGES = [
  { label: "Seiko Vintage Macro (High Quality)", url: "/watch_seiko_vintage_1785170846705.jpg" },
  { label: "Swiss Vintage Classic (High Quality)", url: "/watch_swiss_vintage_1785170866472.jpg" },
  { label: "HMT Mechanical Dial (High Quality)", url: "/hmt_vintage_watch_1785257285844.jpg" },
  { label: "Casio Classic Release (High Quality)", url: "/watch_casio_edifice_1785170834699.jpg" },
  { label: "RetroTimeCo Macro Dial (High Quality)", url: "/hero_vintage_watch_1785170825322.jpg" },
  { label: "Vintage Tank Dial (High Quality)", url: "/watch_s23_tank_1785170876386.jpg" },
]

const CURATED_DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "vintage-archive-01",
    imageUrl: "/watch_seiko_vintage_1785170846705.jpg",
    categoryTag: "VINTAGE WATCHES",
    title: "REAL VINTAGE WATCHES.",
    subtitle: "Authentic mechanical watches, tested and ready for daily wear.",
    linkText: "EXPLORE VINTAGE ↗",
    linkUrl: "/collections/all"
  },
  {
    id: "swiss-japanese-02",
    imageUrl: "/watch_swiss_vintage_1785170866472.jpg",
    categoryTag: "SWISS & JAPANESE",
    title: "TIMELESS CLASSICS.",
    subtitle: "Hand-wound and automatic watches with original character and history.",
    linkText: "VIEW COLLECTION ↗",
    linkUrl: "/collections/swiss-vintage"
  },
  {
    id: "hmt-heritage-03",
    imageUrl: "/hmt_vintage_watch_1785257285844.jpg",
    categoryTag: "INDIAN HERITAGE",
    title: "AUTHENTIC HMT.",
    subtitle: "Classic hand-wound watches made in India. Serviced and running smoothly.",
    linkText: "BROWSE HMT ↗",
    linkUrl: "/collections/hmt-watches"
  },
  {
    id: "casio-classics-04",
    imageUrl: "/watch_casio_edifice_1785170834699.jpg",
    categoryTag: "CASIO RELEASES",
    title: "EVERYDAY RELIABILITY.",
    subtitle: "Original Casio digital and quartz watches. Simple, tough, and genuine.",
    linkText: "SHOP CASIO ↗",
    linkUrl: "/collections/casio"
  }
]

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/hero")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSlides(data.data)
        } else {
          setSlides(CURATED_DEFAULT_SLIDES)
        }
      })
      .catch(() => {
        setSlides(CURATED_DEFAULT_SLIDES)
      })
  }, [])

  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        id: Date.now().toString(),
        imageUrl: "/hero_vintage_watch_1785170825322.jpg",
        categoryTag: "FEATURED COLLECTION",
        title: "NEW ARRIVAL.",
        subtitle: "Verified vintage timepiece ready for daily wear.",
        linkText: "VIEW WATCH ↗",
        linkUrl: "/collections/all"
      }
    ])
  }

  const handleResetDefaults = () => {
    if (confirm("Reset all hero slides to the curated high-quality default images and simple wording?")) {
      setSlides(CURATED_DEFAULT_SLIDES)
    }
  }

  const handleRemoveSlide = (index: number) => {
    const newSlides = [...slides]
    newSlides.splice(index, 1)
    setSlides(newSlides)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[index - 1]
    newSlides[index - 1] = temp
    setSlides(newSlides)
  }

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return
    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[index + 1]
    newSlides[index + 1] = temp
    setSlides(newSlides)
  }

  const handleChange = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    setSlides(newSlides)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadingImageIndex(index)
    const res = await uploadImage(files[0])
    if (res.success && res.url) {
      handleChange(index, "imageUrl", res.url)
    } else {
      alert("Failed to upload image: " + res.message)
    }
    setUploadingImageIndex(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    const res = await saveHeroSlides(slides)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert("Failed to save: " + res.message)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#202223]">Edit Hero Section</h1>
          <p className="text-xs text-[#5C5F62] mt-0.5">
            Configure mobile-first slides, high-quality images, simple words, and direct links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            type="button"
            className="px-3 py-2 text-xs font-medium text-[#5C5F62] hover:text-[#202223] bg-white border border-[#D2D5D9] rounded-md transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#C85A17] hover:bg-[#B34E12] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Hero Slides"}
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-md bg-[#F1F8F5] border border-[#008060] text-[#008060] flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Hero slides updated and live on storefront!</span>
        </div>
      )}

      <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#E1E3E5]">
          <div>
            <h2 className="text-sm font-semibold text-[#202223]">Active Slides ({slides.length})</h2>
            <span className="text-xs text-[#5C5F62]">Slides auto-advance on the homepage and support swipe on mobile devices.</span>
          </div>
          <button
            onClick={handleAddSlide}
            className="text-xs font-bold text-[#C85A17] hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        <div className="space-y-6">
          {slides.length === 0 && (
            <p className="text-sm text-[#5C5F62] text-center py-8">No slides added yet. Click &ldquo;Add Slide&rdquo; or &ldquo;Load Defaults&rdquo; to begin.</p>
          )}

          {slides.map((slide, index) => (
            <div key={slide.id || index} className="border border-[#D2D5D9] rounded-md p-4 sm:p-5 flex flex-col md:flex-row gap-5 bg-[#F9FAFB]">
              
              {/* Image Preview / Upload Area */}
              <div className="w-full md:w-1/3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202223]">
                    Slide {index + 1} Image
                  </label>
                  <span className="text-[10px] text-[#5C5F62] font-mono">HQ Visual</span>
                </div>

                <div className="relative aspect-[4/3] bg-black/90 border border-[#D2D5D9] rounded-md overflow-hidden flex items-center justify-center group shadow-xs">
                  {slide.imageUrl ? (
                    <>
                      <Image 
                        src={slide.imageUrl} 
                        alt={slide.title || "Slide Preview"} 
                        fill 
                        className="object-cover" 
                        unoptimized 
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
                        <label className="cursor-pointer text-white text-xs font-medium bg-[#C85A17] hover:bg-[#B34E12] px-3 py-1.5 rounded flex items-center gap-1.5 shadow">
                          <UploadCloud className="w-3.5 h-3.5" /> Change Photo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                        </label>
                        <span className="text-[10px] text-white/80 truncate max-w-full px-2">
                          {slide.imageUrl}
                        </span>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-[#5C5F62] hover:bg-[#F4F6F8] transition-colors p-4 text-center">
                      {uploadingImageIndex === index ? (
                        <span className="text-xs font-medium text-[#C85A17]">Uploading...</span>
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6 mb-1 text-[#8C9196]" />
                          <span className="text-xs font-bold text-[#202223]">Upload High-Res Photo</span>
                          <span className="text-[10px] text-[#8C9196] mt-0.5">Click or select preset below</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                        </>
                      )}
                    </label>
                  )}
                </div>

                {/* Preset Picker Dropdown */}
                <div>
                  <label className="block text-[11px] font-medium text-[#5C5F62] mb-1">
                    Quick Preset Image:
                  </label>
                  <select
                    value={slide.imageUrl}
                    onChange={(e) => handleChange(index, "imageUrl", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded bg-white px-2.5 py-1.5 text-xs text-[#202223] focus:outline-none focus:border-[#C85A17]"
                  >
                    <option value="">-- Choose High-Res Preset --</option>
                    {PRESET_HIGH_RES_IMAGES.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom URL Input */}
                <input
                  type="text"
                  value={slide.imageUrl}
                  onChange={(e) => handleChange(index, "imageUrl", e.target.value)}
                  placeholder="Or paste image URL (/image.jpg)"
                  className="w-full border border-[#D2D5D9] rounded px-2.5 py-1 text-xs text-[#5C5F62] bg-white"
                />
              </div>

              {/* Text Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Category Tag */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202223] mb-1">
                    Top Category Pill
                  </label>
                  <input
                    type="text"
                    value={slide.categoryTag || ""}
                    onChange={(e) => handleChange(index, "categoryTag", e.target.value)}
                    placeholder="e.g. VINTAGE WATCHES, SWISS & JAPANESE"
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-xs font-mono bg-white text-[#202223] focus:outline-none focus:border-[#C85A17]"
                  />
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202223] mb-1">
                    Headline (Simple Words)
                  </label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    placeholder="e.g. REAL VINTAGE WATCHES."
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-sm font-bold text-[#202223] bg-white focus:outline-none focus:border-[#C85A17]"
                  />
                </div>

                {/* Subtitle */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202223] mb-1">
                    Subtitle (Simple, Direct Language)
                  </label>
                  <textarea
                    rows={2}
                    value={slide.subtitle}
                    onChange={(e) => handleChange(index, "subtitle", e.target.value)}
                    placeholder="e.g. Authentic mechanical watches, tested and ready for daily wear."
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-xs text-[#202223] bg-white focus:outline-none focus:border-[#C85A17]"
                  />
                </div>

                {/* Button Text */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202223] mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={slide.linkText}
                    onChange={(e) => handleChange(index, "linkText", e.target.value)}
                    placeholder="e.g. EXPLORE VINTAGE ↗"
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-xs font-mono font-bold text-[#202223] bg-white focus:outline-none focus:border-[#C85A17]"
                  />
                </div>

                {/* Button Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#202223] mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={slide.linkUrl}
                    onChange={(e) => handleChange(index, "linkUrl", e.target.value)}
                    placeholder="e.g. /collections/all"
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-xs font-mono text-[#202223] bg-white focus:outline-none focus:border-[#C85A17]"
                  />
                </div>

              </div>

              {/* Actions: Reorder & Delete */}
              <div className="flex md:flex-col items-center justify-between md:justify-start gap-2 pt-1 border-t md:border-t-0 md:border-l border-[#E1E3E5] md:pl-3">
                <div className="flex md:flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 text-[#5C5F62] hover:text-[#202223] disabled:opacity-30 hover:bg-white rounded transition-colors"
                    title="Move Slide Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === slides.length - 1}
                    className="p-1.5 text-[#5C5F62] hover:text-[#202223] disabled:opacity-30 hover:bg-white rounded transition-colors"
                    title="Move Slide Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSlide(index)}
                  className="p-1.5 text-[#DE3618] hover:bg-red-50 border border-transparent hover:border-red-200 rounded transition-all"
                  title="Remove Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
