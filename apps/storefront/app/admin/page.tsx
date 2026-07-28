"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { fetchWatches, fetchAdminStats, deleteWatch, updateWatch, WatchProduct } from "@/lib/api"
import { Trash2, Edit3, Plus, Search, RefreshCw, CheckCircle2, XCircle, DollarSign, Layers, Package, AlertTriangle, ShieldCheck, Star } from "lucide-react"

export default function AdminDashboardPage() {
  const [watches, setWatches] = useState<WatchProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCollection, setSelectedCollection] = useState<string>("all")
  const [stats, setStats] = useState<{
    total_timepieces: number;
    in_stock_count: number;
    total_inventory_value_rs: number;
    brands_count: number;
    collections_count: number;
  } | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    const [watchesRes, statsRes] = await Promise.all([
      fetchWatches({ search: searchQuery, collection: selectedCollection === "all" ? undefined : selectedCollection }),
      fetchAdminStats()
    ])
    if (watchesRes?.success && watchesRes.data) {
      setWatches(watchesRes.data)
    }
    if (statsRes?.success && statsRes.data) {
      setStats(statsRes.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [selectedCollection])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadData()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from your catalog and storage?`)) return
    
    setDeletingId(id)
    const res = await deleteWatch(id)
    setDeletingId(null)

    if (res.success) {
      setWatches(prev => prev.filter(w => w.id !== id))
      setNotification({ type: "success", message: `Successfully deleted "${name}" from storage.` })
      loadData()
    } else {
      setNotification({ type: "error", message: res.message || "Failed to delete timepiece." })
    }
  }

  const handleToggleStock = async (watch: WatchProduct) => {
    const updatedStatus = !watch.in_stock
    const res = await updateWatch(watch.id, { in_stock: updatedStatus })
    if (res.success) {
      setWatches(prev => prev.map(w => w.id === watch.id ? { ...w, in_stock: updatedStatus } : w))
      setNotification({ type: "success", message: `Marked "${watch.name}" as ${updatedStatus ? "In Stock" : "Sold Out"}.` })
      loadData()
    } else {
      setNotification({ type: "error", message: "Could not update stock status on server." })
    }
  }

  const handleToggleFeatured = async (watch: WatchProduct) => {
    const updatedStatus = !watch.featured
    const res = await updateWatch(watch.id, { featured: updatedStatus })
    if (res.success) {
      setWatches(prev => prev.map(w => w.id === watch.id ? { ...w, featured: updatedStatus } : w))
      setNotification({ type: "success", message: `Marked "${watch.name}" as ${updatedStatus ? "⭐️ Featured on Homepage" : "Standard Product"}.` })
      loadData()
    } else {
      setNotification({ type: "error", message: "Could not update featured status on server." })
    }
  }

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg ${
          notification.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
            : "bg-red-500/10 border-red-500/30 text-red-300"
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs opacity-70 hover:opacity-100 underline">Dismiss</button>
        </div>
      )}

      {/* Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-gray-800 p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Total Timepieces</span>
            <div className="text-2xl font-black text-white mt-1">{stats?.total_timepieces ?? watches.length}</div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-gray-800 p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Active Archive Value</span>
            <div className="text-2xl font-black text-[#d4af37] mt-1">
              Rs. {(stats?.total_inventory_value_rs ?? 0).toLocaleString("en-IN")}
            </div>
          </div>
          <div className="p-3 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-gray-800 p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">In Stock / Ready</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{stats?.in_stock_count ?? watches.filter(w => w.in_stock).length}</div>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-gray-800 p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Curated Collections</span>
            <div className="text-2xl font-black text-purple-400 mt-1">{stats?.collections_count ?? 5}</div>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-[#161b22] border border-gray-800 p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search reference no, brand, model caliber..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-colors border border-gray-700">
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#d4af37] w-full md:w-auto"
          >
            <option value="all">All Collections (14)</option>
            <option value="japanese-vintage">Japanese Vintage (Seiko/Citizen)</option>
            <option value="swiss-vintage">Swiss Vintage Timepieces</option>
            <option value="casio">New Casio Watches (199+)</option>
            <option value="luxury-chronographs">Luxury Chronographs</option>
            <option value="straps-accessories">Straps & Accessories</option>
          </select>

          <button onClick={loadData} title="Refresh Inventory" className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl border border-gray-700 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/admin/new"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#d4af37] hover:bg-[#c5a02e] text-black rounded-xl text-sm font-bold shadow-lg shadow-[#d4af37]/20 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Watch</span>
          </Link>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Timepiece Catalog Archive</span>
            <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-0.5 rounded-full font-mono">{watches.length} items</span>
          </h2>
          <span className="text-xs text-gray-400 font-mono">Bandra West, Mumbai Storage</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 font-mono">Loading horological records from server...</div>
        ) : watches.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mx-auto mb-4 text-gray-500">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No timepieces found</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">Your search or filter did not match any stored records in the custom backend.</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCollection("all") }} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-[#0d1117]/50 text-[11px] uppercase tracking-wider text-gray-400 font-mono">
                  <th className="py-3.5 px-6">Timepiece / Ref</th>
                  <th className="py-3.5 px-4">Collection</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Price (Rs.)</th>
                  <th className="py-3.5 px-4 text-center">Homepage Showcase</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {watches.map((watch) => (
                  <tr key={watch.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 flex-shrink-0">
                          <Image
                            src={watch.image || "/hero_vintage_watch_1785170825322.jpg"}
                            alt={watch.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/products/${watch.slug}`} target="_blank" className="font-bold text-white hover:text-[#d4af37] transition-colors line-clamp-1">
                            {watch.name}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 font-mono">
                            <span className="text-[#d4af37] font-semibold">{watch.brand}</span>
                            <span>•</span>
                            <span>Ref: {watch.reference_number}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700 font-mono">
                        {watch.collection}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                        watch.condition_grade === "new" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        watch.condition_grade === "mint" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {watch.condition_grade.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-mono font-bold text-white">
                      Rs. {watch.price.toLocaleString("en-IN")}
                      {watch.original_price && watch.original_price > watch.price && (
                        <span className="block text-[11px] text-gray-500 line-through">Rs. {watch.original_price.toLocaleString("en-IN")}</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(watch)}
                        title="Click to toggle Homepage Showcase status"
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm ${
                          watch.featured
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30"
                            : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${watch.featured ? "fill-amber-300 text-amber-300" : ""}`} />
                        <span>{watch.featured ? "⭐️ Featured" : "☆ Standard"}</span>
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/edit/${watch.id}`}
                          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors border border-gray-700"
                          title="Edit Watch Attributes"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(watch.id, watch.name)}
                          disabled={deletingId === watch.id}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20 disabled:opacity-50"
                          title="Delete from Storage"
                        >
                          <Trash2 className={`w-4 h-4 ${deletingId === watch.id ? "animate-pulse" : ""}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
