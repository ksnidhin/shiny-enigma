import React from "react"
import Link from "next/link"
import { ShieldCheck, Search, Wrench, Award, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Authenticity Guarantee | RetroTimeCo",
  description: "Learn about our rigorous 3-step authentication and regulation process for all vintage timepieces.",
}

export default function AuthenticityPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE6] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-mono font-bold text-[#C85A17]">/</span>
            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#5C646D]">
              HOROLOGICAL STANDARDS
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase text-[#11161B]">
            100% Authenticity Guaranteed
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#5C646D] max-w-2xl mx-auto leading-relaxed">
            Every vintage timepiece at RetroTimeCo undergoes physical caseback opening, caliber examination, and multi-position timegrapher regulation by expert horologists.
          </p>
        </div>

        {/* 3 Step Timeline */}
        <div className="space-y-6">
          
          {/* Step 1 */}
          <div className="bg-[#F8F5EE] border border-[#D8D1C5] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-12 h-12 bg-[#0E1620] text-white flex items-center justify-center shrink-0 border border-white/10 font-mono font-bold text-sm">
              01
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[11px] font-bold text-[#C85A17] uppercase tracking-widest block">
                PHASE 1 • PROVENANCE &amp; SERIAL VERIFICATION
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#11161B]">
                Cross-Referenced Manufacturer Archives
              </h2>
              <p className="text-xs sm:text-sm text-[#5C646D] leading-relaxed font-light">
                We cross-check caseback serial numbers, dial reference codes, and production date stamps against historic manufacturer archives in Japan and Switzerland. We never accept franken-watches, aftermarket dials without disclosure, or unverified movements.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#F8F5EE] border border-[#D8D1C5] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-12 h-12 bg-[#0E1620] text-white flex items-center justify-center shrink-0 border border-white/10 font-mono font-bold text-sm">
              02
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[11px] font-bold text-[#C85A17] uppercase tracking-widest block">
                PHASE 2 • CALIBRE INSPECTION &amp; REGULATION
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#11161B]">
                In-House Workshop Regulation
              </h2>
              <p className="text-xs sm:text-sm text-[#5C646D] leading-relaxed font-light">
                Our watchmakers physically open every watch to verify original escapements, rotor assemblies, and balance springs. Pieces are demagnetized and regulated on digital timegraphers for daily beat rate and amplitude.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#F8F5EE] border border-[#D8D1C5] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-12 h-12 bg-[#0E1620] text-white flex items-center justify-center shrink-0 border border-white/10 font-mono font-bold text-sm">
              03
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[11px] font-bold text-[#C85A17] uppercase tracking-widest block">
                PHASE 3 • DISPATCH &amp; PACKAGING
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#11161B]">
                Sealed Transit Protection
              </h2>
              <p className="text-xs sm:text-sm text-[#5C646D] leading-relaxed font-light">
                Once certified, the timepiece is recorded on video, packaged in a shock-damped horological travel case, sealed in tamper-evident security bags, and handed directly to India Post Speed Post or Blue Dart air couriers with full transit insurance.
              </p>
            </div>
          </div>

        </div>

        {/* CTA Box */}
        <div className="mt-14 p-8 sm:p-12 bg-[#0E1620] text-white text-center border border-[#1C2736] space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-[2px] bg-[#C85A17]" />
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#C85A17] uppercase">
              BUY WITH CONFIDENCE
            </span>
            <span className="w-6 h-[2px] bg-[#C85A17]" />
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold">
            Ready to Begin Your Horological Journey?
          </h2>
          <p className="font-mono text-xs text-gray-300 max-w-lg mx-auto">
            Browse our authenticated collection of verified vintage timepieces.
          </p>
          <div className="pt-2">
            <Link 
              href="/collections/all" 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C85A17] hover:bg-[#B34E12] text-white font-mono text-xs font-bold uppercase tracking-widest transition-colors shadow-lg shadow-[#C85A17]/20"
            >
              <span>EXPLORE ALL PIECES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
