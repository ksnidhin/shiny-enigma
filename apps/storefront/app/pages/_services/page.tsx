import * as React from "react"
import Link from "next/link"
import { ShieldCheck, Award, CheckCircle2, ArrowRight, Phone, Mail, MapPin, Sparkles } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sell & Consign Your Watch — RetroTimeCo",
  description: "Get instant valuations for your vintage timepieces or list them on consignment with our Chennai collectors network.",
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase">Horological Consignment Network</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Sell &amp; Consign Your Timepiece
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed font-light">
            Whether you are looking to part with a treasured heirloom or liquidate a vintage Seiko, Citizen, HMT, or Swiss chronometer, our collectors network offers instant transparent valuations and direct purchasing across India.
          </p>
        </div>

        {/* Two Columns: Direct Sell vs Consignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Direct Sell Column */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-custom)] flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[var(--color-brand)] transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:bg-amber-200 transition-colors" />
            
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>Instant Cash Valuation</span>
              </span>
              <h2 className="font-heading text-3xl font-bold text-[var(--color-text-primary)]">
                Direct Watch Buyout
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                We actively purchase rare Japanese vintage timepieces (King Seiko, Grand Seiko, Citizen Chronographs), HMT collectors&apos; pieces, and Swiss luxury mechanical watches directly for immediate cash or bank transfer.
              </p>
              
              <ul className="space-y-2.5 pt-2 text-xs font-medium text-[var(--color-text-primary)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Free insured door-step pickup across India</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Same-day NEFT / IMPS transfer upon inspection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Zero hidden valuation or processing charges</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-black/5 relative z-10">
              <Link 
                href="https://wa.me/919171988875?text=Hi!%20I%20would%20like%20to%20sell%20my%20watch%20to%20you." 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Submit Watch for Valuation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Consignment Column */}
          <div className="bg-[#173528] text-white p-8 md:p-10 rounded-3xl border border-[var(--color-brand)] shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Collectors Network</span>
              </span>
              <h2 className="font-heading text-3xl font-bold">
                Consignment Listing
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Showcase your premium timepieces directly to our audience of 35,000+ passionate collectors across India. Maximize your return with professional photography and verification by our team.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs font-medium text-white/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Achieve top market value for rare collector models</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>We handle all customer inquiries, shipping &amp; insurance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Transparent low 10% commission fee upon sale</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 relative z-10">
              <Link 
                href="https://wa.me/919171988875?text=Hi!%20I%20would%20like%20to%20list%20my%20watch%20on%20consignment%20with%20you." 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-[var(--color-accent)] hover:bg-[#b88c47] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>List Watch on Consignment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left text-xs font-semibold text-[var(--color-text-primary)]">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[var(--color-brand)] flex-shrink-0" />
            <span>Workshop &amp; Storage: Bandra West, Chennai 400050</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-[var(--color-brand)] flex-shrink-0" />
            <span>Direct WhatsApp: +91 91719 88875</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[var(--color-brand)] flex-shrink-0" />
            <span>Consignment Desk: sell@retrotimeco.in</span>
          </div>
        </div>
      </div>
    </div>
  )
}
