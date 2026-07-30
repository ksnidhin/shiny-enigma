"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { fetchWatches, fetchAdminStats, deleteWatch, updateWatch, WatchProduct } from "@/lib/api"
import { Trash2, Edit3, Plus, Search, CheckCircle2, AlertTriangle, Package, DollarSign, Layers } from "lucide-react"

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
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return
    
    setDeletingId(id)
    const res = await deleteWatch(id)
    setDeletingId(null)

    if (res.success) {
      setWatches(prev => prev.filter(w => w.id !== id))
      setNotification({ type: "success", message: `Successfully deleted "${name}".` })
      loadData()
    } else {
      setNotification({ type: "error", message: res.message || "Failed to delete product." })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#202223]">Products</h1>
        <div className="flex gap-3">
          <Link href="/admin/import" className="px-3 py-1.5 text-sm font-medium text-[#202223] bg-white border border-[#D2D5D9] rounded-md hover:bg-[#F4F6F8]">
            Import
          </Link>
          <Link href="/admin/new" className="px-3 py-1.5 text-sm font-medium text-white bg-[#008060] rounded-md hover:bg-[#006e52]">
            Add product
          </Link>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-md flex items-center justify-between shadow-sm border ${
          notification.type === "success" 
            ? "bg-[#F1F8F5] border-[#008060] text-[#008060]" 
            : "bg-[#FFF4F4] border-[#DE3618] text-[#DE3618]"
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-sm font-medium hover:underline">Dismiss</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#D2D5D9]">
          <p className="text-xs font-medium text-[#5C5F62] mb-1">Total Products</p>
          <p className="text-xl font-bold text-[#202223]">{stats?.total_timepieces ?? watches.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#D2D5D9]">
          <p className="text-xs font-medium text-[#5C5F62] mb-1">Inventory Value</p>
          <p className="text-xl font-bold text-[#202223]">Rs. {(stats?.total_inventory_value_rs ?? 0).toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#D2D5D9]">
          <p className="text-xs font-medium text-[#5C5F62] mb-1">In Stock</p>
          <p className="text-xl font-bold text-[#202223]">{stats?.in_stock_count ?? watches.filter(w => w.in_stock).length}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#D2D5D9] overflow-hidden">
        {/* Filters */}
        <div className="p-3 border-b border-[#D2D5D9] flex flex-wrap gap-3 bg-[#F9FAFB]">
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5F62]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-[#D2D5D9] rounded-md focus:outline-none focus:border-[#008060]"
            />
          </form>
          
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="text-sm border border-[#D2D5D9] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#008060] bg-white"
          >
            <option value="all">All Collections</option>
            <option value="casio">Casio Watches</option>
            <option value="japanese-vintage">Japanese Vintage</option>
            <option value="swiss-vintage">Swiss Vintage</option>
            <option value="hmt-watches">HMT Watches</option>
            <option value="straps-accessories">Straps & Accessories</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#202223]">
            <thead className="bg-[#F9FAFB] border-b border-[#D2D5D9] text-[#5C5F62]">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Inventory</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D2D5D9]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#5C5F62]">Loading products...</td>
                </tr>
              ) : watches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#5C5F62]">No products found matching your criteria.</td>
                </tr>
              ) : (
                watches.map(watch => (
                  <tr key={watch.id} className="hover:bg-[#F4F6F8] transition-colors group">
                    <td className="px-4 py-3 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-[#D2D5D9] overflow-hidden bg-[#F4F6F8] flex-shrink-0 relative">
                          {watch.image ? (
                            <Image src={watch.image} alt={watch.name} fill className="object-cover" sizes="40px" />
                          ) : (
                            <Package className="w-5 h-5 text-[#8C9196] m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/edit/${watch.slug || watch.id}`} className="font-semibold text-[#202223] hover:underline line-clamp-1">
                            {watch.name}
                          </Link>
                          <div className="text-xs text-[#5C5F62]">{watch.collection_title || watch.collection}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        watch.in_stock ? "bg-[#AEE9D1] text-[#008060]" : "bg-[#FBEAE5] text-[#D82C0D]"
                      }`}>
                        {watch.in_stock ? "Active" : "Sold out"}
                      </span>
                      {watch.featured && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFEA8A] text-[#8A6116]">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      Rs. {watch.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-[#5C5F62] whitespace-nowrap">
                      {watch.brand}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/edit/${watch.slug || watch.id}`}
                          className="p-2 text-[#5C5F62] hover:bg-white border border-[#D2D5D9] lg:border-transparent lg:hover:border-[#D2D5D9] rounded transition-all shadow-sm bg-white lg:bg-transparent"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(watch.id, watch.name)}
                          disabled={deletingId === watch.id}
                          className="p-2 text-[#DE3618] hover:bg-white border border-[#D2D5D9] lg:border-transparent lg:hover:border-[#D2D5D9] rounded transition-all shadow-sm disabled:opacity-50 bg-white lg:bg-transparent"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
