"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { importWatchesBulk, WatchProduct } from "@/lib/api"
import { ArrowLeft, UploadCloud, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react"
import Papa from "papaparse"

export default function BulkImportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<Partial<WatchProduct>[]>([])
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setError(null)
    setParsedData([])
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setError(`CSV Parsing Error: ${results.errors[0].message}`)
          return
        }
        
        // Map CSV fields to WatchProduct
        const mapped: Partial<WatchProduct>[] = results.data.map((row: any) => ({
          name: row.name || "",
          brand: row.brand || "",
          model_name: row.model_name || "",
          reference_number: row.reference_number || "",
          era_label: row.era_label || "Vintage",
          price: parseFloat(row.price) || 0,
          original_price: parseFloat(row.original_price) || 0,
          collection: row.collection || "japanese-vintage",
          collection_title: row.collection_title || "Japanese Vintage",
          condition_grade: row.condition_grade || "excellent",
          condition_label: row.condition_label || "Excellent",
          condition_notes: row.condition_notes || "",
          image: row.image || "/hero_vintage_watch_1785170825322.jpg",
          badge: row.badge || "",
          in_stock: row.in_stock?.toLowerCase() === 'true',
          featured: row.featured?.toLowerCase() === 'true',
          description: row.description || "",
          specs: {
            movement_caliber: row.movement_caliber || "",
            case_material: row.case_material || "",
            case_size_mm: parseFloat(row.case_size_mm) || 0,
            lug_width_mm: parseFloat(row.lug_width_mm) || 0,
            crystal_type: row.crystal_type || "mineral",
            measured_accuracy_sec_per_day: row.measured_accuracy_sec_per_day || "",
            strap_original: row.strap_original?.toLowerCase() === 'true',
            water_resistance: row.water_resistance || "",
          },
          authenticity_guarantee: true,
          service_history: "Verified and tested at RetroTimeCo Workshop, Chennai.",
        }))

        // Validation check for required fields
        const invalid = mapped.find(w => !w.name || !w.brand || !w.price)
        if (invalid) {
          setError("Validation Error: All rows must have name, brand, and price.")
          return
        }
        
        setParsedData(mapped)
      },
      error: (err) => {
        setError("Error reading file: " + err.message)
      }
    })
  }

  const handleImport = async () => {
    if (parsedData.length === 0) return
    setLoading(true)
    setError(null)
    
    const res = await importWatchesBulk(parsedData)
    setLoading(false)
    
    if (res.success) {
      setSuccess(`Successfully imported ${parsedData.length} timepieces!`)
      setTimeout(() => router.push("/admin"), 2000)
    } else {
      setError(res.message || "Bulk import failed")
    }
  }

  const downloadTemplate = () => {
    const headers = "name,brand,model_name,reference_number,era_label,price,original_price,collection,collection_title,condition_grade,condition_label,condition_notes,image,badge,in_stock,featured,description,movement_caliber,case_material,case_size_mm,lug_width_mm,crystal_type,measured_accuracy_sec_per_day,strap_original,water_resistance\n"
    const example = "Seiko Lord Marvel,Seiko,Lord Marvel,5740-8000,1960s,35000,,japanese-vintage,Japanese Vintage,excellent,Excellent Original,,https://example.com/image.jpg,,true,false,Beautiful watch.,Seiko 5740C,Stainless Steel,35,19,acrylic,+5s,false,Splash\n"
    const blob = new Blob([headers + example], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rtc_watches_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory Archive</span>
        </Link>
        <div className="text-xs font-mono text-[#d4af37]">CSV Bulk Import</div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-bold">{success}</span>
        </div>
      )}

      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="border-b border-gray-800 pb-5 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
              <UploadCloud className="w-6 h-6 text-[#d4af37]" />
              <span>Bulk Product Import</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">Upload a CSV file to add multiple timepieces at once.</p>
          </div>
          <button onClick={downloadTemplate} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Download Template
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer bg-[#0d1117] hover:bg-[#1a212c] hover:border-[#d4af37] transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 text-gray-500 mb-3" />
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">CSV files only</p>
              </div>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {parsedData.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Previewing {parsedData.length} records</h2>
              <button
                onClick={handleImport}
                disabled={loading}
                className="px-6 py-2 bg-[#d4af37] hover:bg-[#c5a02e] text-black font-bold rounded-xl text-sm shadow-lg shadow-[#d4af37]/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Import"}
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-[#0d1117]">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Collection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-[#161b22]">
                  {parsedData.slice(0, 5).map((w, i) => (
                    <tr key={i} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3 font-medium text-white">{w.name}</td>
                      <td className="px-4 py-3">{w.brand}</td>
                      <td className="px-4 py-3">Rs. {w.price}</td>
                      <td className="px-4 py-3">{w.collection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedData.length > 5 && (
                <div className="p-3 text-center text-xs text-gray-500 bg-[#0d1117]">
                  ...and {parsedData.length - 5} more records
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
