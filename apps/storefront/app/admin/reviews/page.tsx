"use client"

import React, { useEffect, useState } from "react"
import { Trash2, Star, CheckCircle2, MessageCircle } from "lucide-react"

interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
  verified_purchase: boolean
  avatar_url?: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  
  const [newReview, setNewReview] = useState({
    author: "",
    rating: 5,
    text: "",
    date: new Date().toISOString(),
    verified_purchase: true
  })

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/reviews")
      const data = await res.json()
      if (data.success) {
        setReviews(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return
    try {
      await fetch(`http://localhost:9000/api/reviews/${id}`, { method: "DELETE" })
      fetchReviews()
    } catch (err) {
      alert("Failed to delete")
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      await fetch("http://localhost:9000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview)
      })
      setNewReview({
        author: "",
        rating: 5,
        text: "",
        date: new Date().toISOString(),
        verified_purchase: true
      })
      fetchReviews()
    } catch (err) {
      alert("Failed to add review")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#202223] mb-1">Customer Reviews</h1>
        <p className="text-sm text-[#5C5F62]">Manage community voices and testimonials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Review Form */}
        <div className="md:col-span-1">
          <form onSubmit={handleAdd} className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-[#202223]">Add New Review</h2>
            
            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={newReview.author}
                onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Rating (1-5)</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm bg-white focus:border-[#008060]"
              >
                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202223] mb-1">Review Text</label>
              <textarea
                required
                rows={4}
                value={newReview.text}
                onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                className="w-full border border-[#D2D5D9] rounded-md px-3 py-2 text-sm focus:border-[#008060]"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newReview.verified_purchase}
                onChange={(e) => setNewReview(prev => ({ ...prev, verified_purchase: e.target.checked }))}
                className="w-4 h-4 text-[#008060] border-[#D2D5D9] rounded"
              />
              <span className="text-sm text-[#202223]">Verified Purchase</span>
            </label>

            <button
              type="submit"
              disabled={adding}
              className="w-full bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
            >
              {adding ? "Adding..." : "Add Review"}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center p-8 text-[#5C5F62]">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-[#D2D5D9] text-center">
              <MessageCircle className="w-8 h-8 text-[#8C9196] mx-auto mb-3" />
              <p className="text-[#202223] font-medium">No reviews yet</p>
              <p className="text-sm text-[#5C5F62]">Add your first customer review using the form.</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-white p-5 rounded-lg border border-[#D2D5D9] shadow-sm flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-[#202223]">{review.author}</span>
                    {review.verified_purchase && (
                      <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Verified</span>
                    )}
                    <span className="text-xs text-[#5C5F62]">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-[#202223] italic">"{review.text}"</p>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 text-[#5C5F62] hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
