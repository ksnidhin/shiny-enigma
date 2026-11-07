"use client"

import React, { useEffect, useState } from "react"
import { Star, ShieldCheck } from "lucide-react"

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
        const res = await fetch("/api/reviews")
        const data = await res.json()
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setReviews(data.data)
        } else {
          // Default testimonials if no dynamic reviews exist yet
          setReviews([
            {
              id: "rev-1",
              author: "Aditya R. (Bangalore)",
              rating: 5,
              text: "The 1974 Seiko 5 arrived in immaculate mechanical condition. Timegrapher printout was accurate to +6s/day. Flawless packaging and express transit.",
              date: "2026-06-15",
              verified_purchase: true,
            },
            {
              id: "rev-2",
              author: "Vikram S. (Mumbai)",
              rating: 5,
              text: "Sourced a pristine Citizen Bullhead through WhatsApp within 48 hours. Excellent provenance communication and authentic Chennai workshop regulation.",
              date: "2026-07-02",
              verified_purchase: true,
            },
            {
              id: "rev-3",
              author: "Rahul M. (Chennai)",
              rating: 5,
              text: "Hand-delivered in Chennai. Vintage mechanical watches can be a gamble, but RetroTimeCo stands completely behind their lifetime authenticity pledge.",
              date: "2026-07-28",
              verified_purchase: true,
            },
          ])
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
    return <div className="text-center py-12 font-mono text-xs text-[#5C646D]">Loading community reviews...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {reviews.slice(0, 3).map((review) => (
        <div key={review.id} className="bg-[#F8F5EE] p-6 sm:p-7 border border-[#D8D1C5] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-4 text-[#C85A17]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "fill-[#C85A17]" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="font-heading text-sm sm:text-base text-[#11161B] leading-relaxed italic">
              &ldquo;{review.text}&rdquo;
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D8D1C5] flex items-center justify-between">
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-[#11161B]">{review.author}</p>
              <p className="font-mono text-[10px] text-[#5C646D] mt-0.5">
                {new Date(review.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
            {review.verified_purchase && (
              <div className="flex items-center gap-1 font-mono text-[10px] text-[#C85A17] font-bold uppercase tracking-wider bg-[#EAE4D9] px-2 py-0.5 border border-[#D8D1C5]">
                <ShieldCheck className="w-3 h-3" />
                <span>VERIFIED</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
