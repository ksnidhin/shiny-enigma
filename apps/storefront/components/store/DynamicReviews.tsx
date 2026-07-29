"use client"

import React, { useEffect, useState } from "react"
import { Star, ShieldCheck, MessageCircle } from "lucide-react"

interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
  verified_purchase: boolean
  avatar_url?: string
}

export function DynamicReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("http://localhost:9000/api/reviews")
        const data = await res.json()
        if (data.success) {
          setReviews(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-[var(--color-text-secondary)]">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold font-heading text-[var(--color-text-primary)]">Be the first to review!</h3>
        <p className="text-[var(--color-text-secondary)] mt-2">Purchase a timepiece and share your experience with the community.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-8 rounded-3xl border border-[var(--color-border)] shadow-sm hover:shadow-xl transition-shadow flex flex-col">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-200"}`}
              />
            ))}
          </div>
          <p className="text-[var(--color-text-primary)] leading-relaxed flex-1 font-medium text-lg italic">
            "{review.text}"
          </p>
          <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-6">
            <div>
              <p className="font-bold text-[var(--color-text-primary)] font-heading">{review.author}</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">{new Date(review.date).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            {review.verified_purchase && (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-[var(--color-brand)] bg-green-50 px-2 py-1 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Verified Buyer</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
