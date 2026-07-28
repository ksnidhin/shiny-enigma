"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createWatch, WatchProduct } from "@/lib/api"
import { ArrowLeft, Save, ShieldCheck, Watch, DollarSign, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react"

export default function AddTimepiecePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const [formData, setFormData] = useState<{
    name: string;
    brand: string;
    model_name: string;
    reference_number: string;
    era_label: string;
    price: number;
    original_price?: number;
    collection: WatchProduct["collection"];
    collection_title: string;
    condition_grade: WatchProduct["condition_grade"];
    condition_label: string;
    condition_notes: string;
    image: string;
    badge?: string;
    in_stock: boolean;
    featured: boolean;
    movement_caliber: string;
    case_material: string;
    case_size_mm: number;
    lug_width_mm: number;
    crystal_type: "sapphire" | "mineral" | "acrylic";
    measured_accuracy_sec_per_day: string;
    strap_original: boolean;
    water_resistance: string;
    description: string;
  }>({
    name: "",
    brand: "Seiko",
    model_name: "",
    reference_number: "",
    era_label: "Vintage Edition",
    price: 25000,
    original_price: 30000,
    collection: "japanese-vintage",
    collection_title: "Japanese Vintage Timepieces",
    condition_grade: "excellent",
    condition_label: "Excellent (Original Dial)",
    condition_notes: "Case in excellent unpolished condition with sharp edges.",
    image: "/hero_vintage_watch_1785170825322.jpg",
    badge: "Rare Vintage",
    in_stock: true,
    featured: true,
    movement_caliber: "Seiko Automatic (28,800 bph)",
    case_material: "316L Stainless Steel",
    case_size_mm: 36.5,
    lug_width_mm: 18,
    crystal_type: "mineral",
    measured_accuracy_sec_per_day: "+3 sec/day",
    strap_original: false,
    water_resistance: "Splash Resistant (Vintage)",
    description: "An authentic mechanical watch sourced and authenticated by RetroTimeCo.",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const col = e.target.value as WatchProduct["collection"]
    const titles: Record<string, string> = {
      "japanese-vintage": "Japanese Vintage Timepieces",
      "swiss-vintage": "Swiss Vintage Timepieces",
      "casio": "New Casio Watches (199+ Models)",
      "luxury-chronographs": "Luxury Chronographs",
      "straps-accessories": "Straps & Accessories",
    }
    setFormData(prev => ({ ...prev, collection: col, collection_title: titles[col] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.name || !formData.brand || !formData.price) {
      setError("Please fill in Watch Name, Brand, and Price in Rupees.")
      setLoading(false)
      return
    }

    const payload: Partial<WatchProduct> = {
      ...formData,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      gallery_images: [formData.image],
      rating: 5.0,
      reviews_count: 1,
      authenticity_guarantee: true,
      service_history: "Verified and tested at RetroTimeCo Bandra West Workshop, Mumbai.",
      specs: {
        movement_caliber: formData.movement_caliber,
        case_material: formData.case_material,
        case_size_mm: formData.case_size_mm,
        lug_width_mm: formData.lug_width_mm,
        crystal_type: formData.crystal_type,
        measured_accuracy_sec_per_day: formData.measured_accuracy_sec_per_day,
        strap_original: formData.strap_original,
        water_resistance: formData.water_resistance,
      }
    }

    const res = await createWatch(payload)
    setLoading(false)

    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin")
      }, 1500)
    } else {
      setError(res.message || "Failed to add watch to storage.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory Archive</span>
        </Link>
        <div className="text-xs font-mono text-gray-500">New Horological Record</div>
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
          <span className="text-sm font-bold">Timepiece added successfully! Redirecting to archive...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-8 shadow-xl">
        <div className="border-b border-gray-800 pb-5">
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Watch className="w-6 h-6 text-[#d4af37]" />
            <span>Add New Timepiece to Catalog</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Enter pricing in Indian Rupees (`Rs.`) and authentic horologist inspection details.
          </p>
        </div>

        {/* Section 1: General Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] font-mono">1. Identity & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Watch Full Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Seiko Lord Marvel 36000 Hi-Beat 1968"
                value={formData.name}
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
                placeholder="Seiko, Casio, Tissot, Omega..."
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Model Name</label>
              <input
                type="text"
                name="model_name"
                placeholder="e.g. Lord Marvel 36000"
                value={formData.model_name}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Reference Number *</label>
              <input
                type="text"
                name="reference_number"
                required
                placeholder="e.g. 5740-8000"
                value={formData.reference_number}
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
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Original MRP / Strikethrough Price (Rs.)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Collection Category *</label>
              <select
                name="collection"
                value={formData.collection}
                onChange={handleCollectionChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="japanese-vintage">Japanese Vintage Timepieces</option>
                <option value="swiss-vintage">Swiss Vintage Timepieces</option>
                <option value="casio">New Casio Watches (199+ Models)</option>
                <option value="luxury-chronographs">Luxury Chronographs</option>
                <option value="straps-accessories">Straps & Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Era / Release Tag</label>
              <input
                type="text"
                name="era_label"
                value={formData.era_label}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Horological Specs */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] font-mono">2. Horological Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 mb-1">Movement Caliber / Mechanism *</label>
              <input
                type="text"
                name="movement_caliber"
                required
                value={formData.movement_caliber}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Measured Accuracy (+/- sec/day)</label>
              <input
                type="text"
                name="measured_accuracy_sec_per_day"
                value={formData.measured_accuracy_sec_per_day}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Case Material</label>
              <input
                type="text"
                name="case_material"
                value={formData.case_material}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Case Diameter (mm)</label>
              <input
                type="number"
                step="0.5"
                name="case_size_mm"
                value={formData.case_size_mm}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Crystal Type</label>
              <select
                name="crystal_type"
                value={formData.crystal_type}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="mineral">Mineral Crystal</option>
                <option value="sapphire">Scratch-Resistant Sapphire</option>
                <option value="acrylic">Vintage Domed Acrylic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Condition & Description */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] font-mono">3. Condition Report & Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Condition Label</label>
              <input
                type="text"
                name="condition_label"
                value={formData.condition_label}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 mb-1">Horologist Workshop Notes</label>
              <input
                type="text"
                name="condition_notes"
                value={formData.condition_notes}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 mb-1">Image URL or Local Asset Path</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="flex-1 bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData(p => ({ ...p, image: "/hero_vintage_watch_1785170825322.jpg" }))} className="px-2.5 py-2 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg text-gray-300">Seiko</button>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, image: "/watch_swiss_vintage_1785170866472.jpg" }))} className="px-2.5 py-2 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg text-gray-300">Swiss</button>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, image: "/watch_casio_edifice_1785170834699.jpg" }))} className="px-2.5 py-2 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg text-gray-300">Casio</button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 mb-1">Full Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer bg-[#0d1117] border border-gray-700 p-4 rounded-xl hover:border-[#d4af37] transition-colors">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
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
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#d4af37] hover:bg-[#c5a02e] text-black font-bold rounded-xl text-sm shadow-lg shadow-[#d4af37]/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving to Server..." : "Save Timepiece"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
