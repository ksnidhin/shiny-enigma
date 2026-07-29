"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { fetchWatchBySlug, updateWatch, uploadImage, generateWatchDetails } from "@/lib/api"
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Image as ImageIcon, UploadCloud, X } from "lucide-react"

export default function EditTimepiecePage() {
  const router = useRouter()
  const params = useParams()
  const idOrSlug = (params?.id as string) || ""

  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState<boolean>(false)
  const [generatingAI, setGeneratingAI] = useState<boolean>(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const [newImageUrl, setNewImageUrl] = useState("")

  useEffect(() => {
    async function load() {
      if (!idOrSlug) return
      const res = await fetchWatchBySlug(idOrSlug)
      if (res.success && res.data) {
        setFormData(res.data)
      } else {
        setError("Could not find timepiece record.")
      }
      setLoading(false)
    }
    load()
  }, [idOrSlug])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadingImage(true)
    const currentImages = formData.gallery_images || [formData.image].filter(Boolean)
    
    for (let i = 0; i < files.length; i++) {
      const res = await uploadImage(files[i])
      if (res.success && res.url) {
        currentImages.push(res.url)
      } else {
        alert("Failed to upload an image: " + res.message)
      }
    }
    
    setFormData((prev: any) => ({
      ...prev,
      image: currentImages[0] || "",
      gallery_images: currentImages
    }))
    setUploadingImage(false)
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return
    const currentImages = formData.gallery_images || [formData.image].filter(Boolean)
    currentImages.push(newImageUrl.trim())
    setFormData((prev: any) => ({
      ...prev,
      image: currentImages[0] || "",
      gallery_images: currentImages
    }))
    setNewImageUrl("")
  }

  const handleRemoveImage = (index: number) => {
    const currentImages = [...(formData.gallery_images || [])]
    currentImages.splice(index, 1)
    setFormData((prev: any) => ({
      ...prev,
      image: currentImages[0] || "",
      gallery_images: currentImages
    }))
  }

  const handleAIGenerate = async () => {
    if (!formData?.name) {
      alert("Please enter a Title first!")
      return
    }
    setGeneratingAI(true)
    setAiError(null)
    const res = await generateWatchDetails(formData.name, "vintage")
    setGeneratingAI(false)
    if (res.success && res.data) {
      setFormData((prev: any) => ({ ...prev, ...res.data }))
    } else {
      setAiError(res.message || "Failed to generate specs.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (name.startsWith("specs.")) {
      const specKey = name.replace("specs.", "")
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked
        setFormData((prev: any) => ({ ...prev, specs: { ...prev.specs, [specKey]: checked } }))
      } else if (type === "number") {
        setFormData((prev: any) => ({ ...prev, specs: { ...prev.specs, [specKey]: parseFloat(value) || 0 } }))
      } else {
        setFormData((prev: any) => ({ ...prev, specs: { ...prev.specs, [specKey]: value } }))
      }
    } else {
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked
        setFormData((prev: any) => ({ ...prev, [name]: checked }))
      } else if (type === "number") {
        setFormData((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }))
      } else {
        setFormData((prev: any) => ({ ...prev, [name]: value }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    setSaving(true)
    setError(null)

    const res = await updateWatch(formData.id, formData)
    setSaving(false)

    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin")
      }, 1500)
    } else {
      setError(res.message || "Failed to save product.")
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-[#5C5F62]">Loading product details...</div>
  }

  if (!formData) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-red-500 font-medium">Product not found.</div>
        <Link href="/admin" className="px-4 py-2 bg-[#202223] text-white rounded-md text-sm inline-block">Back to Products</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 border border-[#D2D5D9] rounded-md hover:bg-[#F4F6F8] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#5C5F62]" />
          </Link>
          <h1 className="text-xl font-bold text-[#202223]">{formData.name}</h1>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-[#FFF4F4] border border-[#DE3618] text-[#DE3618] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-md bg-[#F1F8F5] border border-[#008060] text-[#008060] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Product saved successfully! Redirecting...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Main Info) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* AI Auto Fill */}
          <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#202223]">✨ AI Auto-Fill</h3>
              <p className="text-xs text-[#5C5F62] mt-1">Generate full specifications using Claude 3.5 Sonnet.</p>
              {aiError && <p className="text-xs text-red-500 mt-1">{aiError}</p>}
            </div>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={generatingAI}
              className="px-3 py-1.5 bg-[#F4F6F8] border border-[#D2D5D9] hover:bg-[#EBEBEB] text-[#202223] font-medium rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {generatingAI ? "Generating..." : "Auto-Fill"}
            </button>
          </div>

          {/* Title & Description */}
          <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Title</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223] focus:outline-none focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223] focus:outline-none focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060]"
              />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-[#202223]">Media</h2>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-4 gap-4">
              {(formData.gallery_images || []).map((imgUrl: string, idx: number) => (
                <div key={idx} className="relative aspect-square border border-[#D2D5D9] rounded-md overflow-hidden group">
                  <img src={imgUrl} alt="Product media" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-white rounded-md p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-[#202223]" />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-1 left-1 bg-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-[#D2D5D9]">
                      Main
                    </div>
                  )}
                </div>
              ))}
              
              {/* Upload Button */}
              <label className="aspect-square border border-dashed border-[#D2D5D9] rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-[#F4F6F8] transition-colors relative">
                {uploadingImage ? (
                  <span className="text-xs font-medium text-[#5C5F62]">Uploading...</span>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-[#5C5F62] mb-1" />
                    <span className="text-xs font-medium text-[#5C5F62]">Add files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </label>
            </div>

            {/* URL Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="url"
                placeholder="Add image from URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 border border-[#D2D5D9] rounded-md px-3 py-1.5 text-sm text-[#202223] focus:outline-none focus:border-[#008060]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-1.5 bg-[#F4F6F8] border border-[#D2D5D9] hover:bg-[#EBEBEB] text-[#202223] font-medium rounded-md text-sm transition-colors"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm">
            <h2 className="text-sm font-semibold text-[#202223] mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price || 0}
                  onChange={handleChange}
                  className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223] focus:outline-none focus:border-[#008060]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Compare-at price</label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price || ""}
                  onChange={handleChange}
                  className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223] focus:outline-none focus:border-[#008060]"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm">
            <h2 className="text-sm font-semibold text-[#202223] mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Era Label</label>
                <input type="text" name="era_label" value={formData.era_label || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Condition Grade</label>
                <select name="condition_grade" value={formData.condition_grade || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223] bg-white">
                  <option value="new">New / Unworn</option>
                  <option value="mint">Mint</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Movement Caliber</label>
                <input type="text" name="specs.movement_caliber" value={formData.specs?.movement_caliber || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Case Material</label>
                <input type="text" name="specs.case_material" value={formData.specs?.case_material || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Case Size (mm)</label>
                <input type="number" name="specs.case_size_mm" value={formData.specs?.case_size_mm || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Lug Width (mm)</label>
                <input type="number" name="specs.lug_width_mm" value={formData.specs?.lug_width_mm || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Crystal Type</label>
                <input type="text" name="specs.crystal_type" value={formData.specs?.crystal_type || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Water Resistance</label>
                <input type="text" name="specs.water_resistance" value={formData.specs?.water_resistance || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Measured Accuracy</label>
                <input type="text" name="specs.measured_accuracy_sec_per_day" value={formData.specs?.measured_accuracy_sec_per_day || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Badge (e.g., Rare)</label>
                <input type="text" name="badge" value={formData.badge || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#202223] mb-1">Condition Notes</label>
                <textarea name="condition_notes" rows={2} value={formData.condition_notes || ""} onChange={handleChange} className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]"></textarea>
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="specs.strap_original" checked={formData.specs?.strap_original || false} onChange={handleChange} className="w-4 h-4 text-[#008060] border-[#D2D5D9] rounded focus:ring-[#008060]" />
                  <span className="text-sm text-[#202223]">Strap is Original</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Status */}
          <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm">
            <h2 className="text-sm font-semibold text-[#202223] mb-4">Status</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={formData.in_stock !== false}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#008060] border-[#D2D5D9] rounded focus:ring-[#008060]"
                />
                <span className="text-sm text-[#202223]">In Stock (Available for purchase)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#008060] border-[#D2D5D9] rounded focus:ring-[#008060]"
                />
                <span className="text-sm text-[#202223]">Featured (Show on homepage)</span>
              </label>
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-[#202223]">Organization</h2>
            
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand || ""}
                onChange={handleChange}
                className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Collection</label>
              <select
                name="collection"
                value={formData.collection || ""}
                onChange={handleChange}
                className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223] bg-white"
              >
                <option value="casio">Casio Watches</option>
                <option value="japanese-vintage">Japanese Vintage</option>
                <option value="swiss-vintage">Swiss Vintage</option>
                <option value="hmt-watches">HMT Watches</option>
                <option value="straps-accessories">Straps & Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Reference Number</label>
              <input
                type="text"
                name="reference_number"
                value={formData.reference_number || ""}
                onChange={handleChange}
                className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm text-[#202223]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
