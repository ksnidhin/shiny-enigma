"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { fetchWatchBySlug, updateWatch, WatchProduct } from "@/lib/api"
import { ArrowLeft, Save, ShieldCheck, Watch, AlertCircle, CheckCircle2 } from "lucide-react"

export default function EditTimepiecePage() {
  const router = useRouter()
  const params = useParams()
  const idOrSlug = (params?.id as string) || ""

  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>(null)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev: any) => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      setFormData((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else if (name.startsWith("specs.")) {
      const specKey = name.replace("specs.", "")
      setFormData((prev: any) => ({ ...prev, specs: { ...prev.specs, [specKey]: value } }))
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }))
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
      setError(res.message || "Failed to update watch on server.")
    }
  }

  if (loading) {
    return <div className="p-12 text-center font-mono text-gray-500">Loading timepiece details...</div>
  }

  if (!formData) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="text-red-400 font-bold">Timepiece not found in storage archive.</div>
        <Link href="/admin" className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm inline-block">Back to Archive</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory Archive</span>
        </Link>
        <div className="text-xs font-mono text-[#d4af37]">Editing Ref: {formData.reference_number}</div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="text-sm font-bold">Timepiece updated successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-8 shadow-xl">
        <div className="border-b border-gray-800 pb-5">
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Watch className="w-6 h-6 text-[#d4af37]" />
            <span>Edit Timepiece: {formData.name}</span>
          </h1>
        </div>

        {/* Identity & Pricing */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] font-mono">1. Identity & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Watch Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Brand *</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand || ""}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Price in Rupees (Rs.) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price || 0}
                  onChange={handleChange}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Original Price (Rs.)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price || 0}
                  onChange={handleChange}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Specs & Notes */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] font-mono">2. Horological Specs & Condition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Movement Caliber</label>
              <input
                type="text"
                name="specs.movement_caliber"
                value={formData.specs?.movement_caliber || ""}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Condition Grade</label>
              <select
                name="condition_grade"
                value={formData.condition_grade}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="new">Brand New / Sealed</option>
                <option value="mint">Mint Restored</option>
                <option value="excellent">Excellent Original</option>
                <option value="very_good">Very Good Patina</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 mb-1">Workshop Inspection Notes</label>
              <input
                type="text"
                name="condition_notes"
                value={formData.condition_notes || ""}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 mb-1">Full Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer bg-[#0d1117] border border-gray-700 p-4 rounded-xl hover:border-[#d4af37] transition-colors">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData((p: any) => ({ ...p, featured: e.target.checked }))}
                  className="w-5 h-5 accent-[#d4af37] rounded cursor-pointer"
                />
                <div>
                  <span className="block text-sm font-bold text-amber-300">⭐️ Showcase on Storefront Homepage (Featured Drop)</span>
                  <span className="block text-xs text-gray-400">If checked, this watch will immediately appear in the Featured Timepieces banner on the customer homepage.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-4">
          <Link href="/admin" className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#d4af37] hover:bg-[#c5a02e] text-black font-bold rounded-xl text-sm shadow-lg shadow-[#d4af37]/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Updating Server..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
