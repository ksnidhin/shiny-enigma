import React from "react"
import Link from "next/link"
import { ShieldCheck, Search, Wrench, Verified, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Authenticity Guarantee | RetroTimeCo",
  description: "Learn about our rigorous 3-step authentication process for all vintage timepieces.",
}

export default function AuthenticityPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <div className="text-center space-y-6 mb-16">
          <div className="w-16 h-16 bg-[var(--color-brand)]/10 rounded-full flex items-center justify-center mx-auto text-[var(--color-brand)]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
            100% Authenticity Guaranteed
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Every vintage timepiece at RetroTimeCo undergoes a rigorous inspection by expert horologists before it reaches your wrist. We do not sell replicas, franken-watches, or unverified pieces.
          </p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[var(--color-brand)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Search className="w-5 h-5" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white shadow-[var(--shadow-custom)] border border-[var(--color-border)]">
              <h3 className="font-bold text-xl mb-2 text-[var(--color-text-primary)]">Step 1: Provenance & Sourcing</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                We source directly from vetted dealers in Tokyo and Geneva. Each piece's serial numbers and reference codes are cross-referenced with manufacturer archives to establish a clear history.
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[var(--color-brand)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white shadow-[var(--shadow-custom)] border border-[var(--color-border)]">
              <h3 className="font-bold text-xl mb-2 text-[var(--color-text-primary)]">Step 2: Movement Inspection</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Our watchmakers open the caseback to inspect the caliber. We verify that the movement matches the reference, check for original parts, and regulate the escapement for optimal timekeeping.
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[var(--color-brand)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Verified className="w-5 h-5" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white shadow-[var(--shadow-custom)] border border-[var(--color-border)]">
              <h3 className="font-bold text-xl mb-2 text-[var(--color-text-primary)]">Step 3: Final Certification</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Once the case, dial, hands, and movement pass inspection, the watch receives its RetroTimeCo Authenticity Guarantee. You can buy with absolute confidence.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center bg-white p-10 rounded-3xl shadow-xl border border-[var(--color-border)]">
          <h2 className="text-2xl font-bold mb-4">Ready to start your collection?</h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
            Browse our authenticated vintage archive and find your perfect timepiece today.
          </p>
          <Link href="/collections/all" className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-full hover:bg-[var(--color-brand-hover)] transition-all">
            Shop All Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
