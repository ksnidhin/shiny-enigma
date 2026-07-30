"use client"

import React, { useEffect, useState } from "react"
import { Save, Plus, Trash2, GripVertical, CheckCircle2, UploadCloud } from "lucide-react"
import { saveCollectionsConfig } from "../../admin-actions"
import { uploadImage } from "@/lib/api"
import Image from "next/image"

interface CollectionItem {
  id: string
  title: string
  subtitle: string
  image: string
  href: string
  badge: string
}

export default function CollectionsAdminPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/collections")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCollections(data.data)
        }
      })
      .catch(() => {})
  }, [])

  const handleAddCollection = () => {
    setCollections([...collections, { 
      id: "new-collection-" + Date.now(), 
      title: "New Collection", 
      subtitle: "", 
      image: "", 
      href: "/collections/new-collection", 
      badge: "" 
    }])
  }

  const handleRemoveCollection = (index: number) => {
    const newCols = [...collections]
    newCols.splice(index, 1)
    setCollections(newCols)
  }

  const handleChange = (index: number, field: keyof CollectionItem, value: string) => {
    const newCols = [...collections]
    newCols[index][field] = value
    setCollections(newCols)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadingImageIndex(index)
    const res = await uploadImage(files[0])
    if (res.success && res.url) {
      handleChange(index, "image", res.url)
    } else {
      alert("Failed to upload image: " + res.message)
    }
    setUploadingImageIndex(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    const res = await saveCollectionsConfig(collections)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert("Failed to save: " + res.message)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#202223]">Curated Collections</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Config"}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-md bg-[#F1F8F5] border border-[#008060] text-[#008060] flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">Collections updated successfully!</span>
        </div>
      )}

      <div className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold text-[#202223]">Manage Homepage Collections</h2>
          <button
            onClick={handleAddCollection}
            className="text-sm font-medium text-[#008060] hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Collection
          </button>
        </div>

        <div className="space-y-6">
          {collections.length === 0 && (
            <p className="text-sm text-[#5C5F62] text-center py-8">No collections added yet. Click "Add Collection" to begin.</p>
          )}
          {collections.map((col, index) => (
            <div key={col.id} className="border border-[#D2D5D9] rounded-md p-5 flex flex-col md:flex-row gap-6 bg-[#F9FAFB]">
              {/* Image Preview / Upload Area */}
              <div className="w-full md:w-1/3 flex flex-col gap-2">
                <label className="block text-xs font-medium text-[#202223]">Cover Image</label>
                <div className="relative aspect-square bg-white border border-[#D2D5D9] rounded-md overflow-hidden flex items-center justify-center">
                  {col.image ? (
                    <>
                      <Image src={col.image} alt="Preview" fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded flex items-center gap-2">
                          <UploadCloud className="w-4 h-4" /> Change Image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-[#5C5F62] hover:bg-[#F4F6F8] transition-colors">
                      {uploadingImageIndex === index ? (
                        <span className="text-xs font-medium">Uploading...</span>
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 mb-2" />
                          <span className="text-xs font-medium">Upload Image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                        </>
                      )}
                    </label>
                  )}
                </div>
                <input
                  type="text"
                  value={col.image}
                  onChange={(e) => handleChange(index, "image", e.target.value)}
                  placeholder="Or paste image URL"
                  className="w-full border border-[#D2D5D9] rounded-md px-3 py-1.5 text-xs text-[#5C5F62]"
                />
              </div>

              {/* Text Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#202223] mb-1">Collection ID (used for matching products)</label>
                  <input
                    type="text"
                    value={col.id}
                    onChange={(e) => handleChange(index, "id", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202223] mb-1">Title</label>
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202223] mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={col.subtitle}
                    onChange={(e) => handleChange(index, "subtitle", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202223] mb-1">Badge Text (e.g., Rare Finds)</label>
                  <input
                    type="text"
                    value={col.badge}
                    onChange={(e) => handleChange(index, "badge", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202223] mb-1">Link URL</label>
                  <input
                    type="text"
                    value={col.href}
                    onChange={(e) => handleChange(index, "href", e.target.value)}
                    className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center justify-start gap-4 pt-2">
                <div className="cursor-grab p-1.5 hover:bg-[#EBEBEB] rounded">
                  <GripVertical className="w-5 h-5 text-[#8C9196]" />
                </div>
                <button
                  onClick={() => handleRemoveCollection(index)}
                  className="p-1.5 text-[#DE3618] hover:bg-white border border-transparent hover:border-[#D2D5D9] rounded transition-all shadow-sm"
                  title="Remove Collection"
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
