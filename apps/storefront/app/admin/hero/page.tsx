"use client"

import React, { useEffect, useState } from "react"
import { Save, Plus, Trash2, GripVertical, CheckCircle2 } from "lucide-react"

interface HeroSlide {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  linkText: string
  linkUrl: string
}

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch("http://localhost:9000/api/hero")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSlides(data.data)
        }
      })
  }, [])

  const handleAddSlide = () => {
    setSlides([...slides, { id: Date.now().toString(), imageUrl: "", title: "", subtitle: "", linkText: "Shop Now", linkUrl: "/collections/all" }])
  }

  const handleRemoveSlide = (index: number) => {
    const newSlides = [...slides]
    newSlides.splice(index, 1)
    setSlides(newSlides)
  }

  const handleChange = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...slides]
    newSlides[index][field] = value
    setSlides(newSlides)
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      const res = await fetch("http://localhost:9000/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides })
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      alert("Failed to save")
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#202223]">Hero Carousel</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save slides"}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-md bg-[#F1F8F5] border border-[#008060] text-[#008060] flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Hero carousel updated successfully!</span>
        </div>
      )}

      <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold text-[#202223]">Manage Slides</h2>
          <button
            onClick={handleAddSlide}
            className="text-sm font-medium text-[#008060] hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        <div className="space-y-4">
          {slides.length === 0 && (
            <p className="text-sm text-[#5C5F62] text-center py-8">No slides added yet. Click "Add Slide" to begin.</p>
          )}
          {slides.map((slide, index) => (
            <div key={slide.id} className="border border-[#D2D5D9] rounded-md p-4 flex gap-4 bg-[#F9FAFB]">
              <div className="pt-2 cursor-grab">
                <GripVertical className="w-5 h-5 text-[#8C9196]" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#202223] mb-1">Image URL</label>
                  <input
                    type="text"
                    value={slide.imageUrl}
                    onChange={(e) => handleChange(index, "imageUrl", e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202223] mb-1">Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202223] mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={slide.subtitle}
                    onChange={(e) => handleChange(index, "subtitle", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202223] mb-1">Button Text</label>
                  <input
                    type="text"
                    value={slide.linkText}
                    onChange={(e) => handleChange(index, "linkText", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202223] mb-1">Button Link</label>
                  <input
                    type="text"
                    value={slide.linkUrl}
                    onChange={(e) => handleChange(index, "linkUrl", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleRemoveSlide(index)}
                  className="p-1.5 text-[#DE3618] hover:bg-white rounded transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
