import React from "react"
import Link from "next/link"
import { ShieldCheck, Truck, RotateCcw, Lock, Phone, MapPin, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react"
import { Metadata } from "next"

interface PolicyData {
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

const POLICIES: Record<string, PolicyData> = {
  shipping: {
    title: "All-India Express Shipping & Logistics Policy",
    subtitle: "Verified courier partners, transit insurance, and delivery guidelines across 28,000+ Indian PIN codes.",
    content: (
      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#5C646D] font-light">
        <div className="p-4 bg-[#0E1620] text-white border border-[#1C2736] flex items-start gap-3">
          <Truck className="w-5 h-5 text-[#C85A17] shrink-0 mt-0.5" />
          <div>
            <span className="font-mono font-bold block text-xs uppercase tracking-wider mb-1 text-white">
              100% Insured All-India Delivery
            </span>
            Every timepiece dispatched from our Chennai workshop is fully insured against transit damage, loss, or theft until it is safely signed for at your doorstep.
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[#11161B] mb-2 uppercase">
            Authorized Courier &amp; Postal Partners
          </h3>
          <p className="mb-4">
            We partner exclusively with premier domestic logistics networks to ensure your mechanical timepiece experiences smooth, vibration-free transit:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-[#11161B]">
            <div className="p-3 bg-[#F4EFE6] border border-[#D8D1C5] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C85A17] shrink-0" />
              <div>
                <strong className="block">India Post (Speed Post)</strong>
                <span className="text-[10px] text-[#5C646D]">Government-verified reach to every remote PIN code</span>
              </div>
            </div>
            <div className="p-3 bg-[#F4EFE6] border border-[#D8D1C5] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C85A17] shrink-0" />
              <div>
                <strong className="block">Blue Dart Express</strong>
                <span className="text-[10px] text-[#5C646D]">Priority air transit for high-value Swiss chronometers</span>
              </div>
            </div>
            <div className="p-3 bg-[#F4EFE6] border border-[#D8D1C5] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C85A17] shrink-0" />
              <div>
                <strong className="block">Delhivery &amp; DTDC Express</strong>
                <span className="text-[10px] text-[#5C646D]">Fast 2-4 day express metro &amp; tier-2 delivery</span>
              </div>
            </div>
            <div className="p-3 bg-[#F4EFE6] border border-[#D8D1C5] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C85A17] shrink-0" />
              <div>
                <strong className="block">Ecom Express &amp; XpressBees</strong>
                <span className="text-[10px] text-[#5C646D]">Secure OTP-verified doorstep handover</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[#11161B] mb-2 uppercase">
            Dispatch Timelines &amp; Tracking
          </h3>
          <p>
            Orders placed before 3:00 PM IST are inspected, magnetically demagnetized, and packed in tamper-proof horological cases on the same working day. Tracking AWB numbers are automatically shared to your registered WhatsApp number (+91 91719 88875 network) within 24 hours.
          </p>
        </div>
      </div>
    )
  },
  refund: {
    title: "7-Day Return & Replacement Policy",
    subtitle: "Clear guidelines on replacement eligibility, unboxing requirements, and our no-refund guarantee.",
    content: (
      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#5C646D] font-light">
        <div className="p-4 bg-red-950/10 border border-red-800/30 text-red-900 font-mono text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-xs uppercase tracking-wider text-red-700 mb-1">
              STRICT NO-REFUND POLICY
            </span>
            Under no circumstances do we issue cash or monetary refunds once a timepiece has been purchased. Due to the rare, collectible, and pre-owned nature of vintage horology, all sales are final subject only to our 7-Day Replacement Guarantee below.
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[#11161B] mb-2 uppercase">
            7-Day Replacement Eligibility
          </h3>
          <p className="mb-4">
            We offer a strict <strong>7-Day Replacement Guarantee</strong> from the recorded date and time of courier delivery. A replacement watch of equivalent value or store credit will only be authorized under these specific conditions:
          </p>
          
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 bg-[#F4EFE6] border border-[#D8D1C5]">
              <strong className="text-xs font-bold text-[#11161B] block mb-1">1. TRANSIT DAMAGE OR SHATTERED CRYSTAL</strong>
              <p className="text-[11px] text-[#5C646D]">
                If the timepiece suffered physical damage during courier transit. <strong>Mandatory Requirement:</strong> You must provide a continuous, unedited 360-degree unboxing video showing the sealed courier bag being opened and the damage revealed. Without an unboxing video, transit claims cannot be processed.
              </p>
            </div>

            <div className="p-3.5 bg-[#F4EFE6] border border-[#D8D1C5]">
              <strong className="text-xs font-bold text-[#11161B] block mb-1">2. INCORRECT MODEL DELIVERED</strong>
              <p className="text-[11px] text-[#5C646D]">
                In the rare event that our workshop dispatched a different model, dial color, or reference number than what was specified on your order invoice.
              </p>
            </div>

            <div className="p-3.5 bg-[#F4EFE6] border border-[#D8D1C5]">
              <strong className="text-xs font-bold text-[#11161B] block mb-1">3. MECHANICAL MOVEMENT FAILURE</strong>
              <p className="text-[11px] text-[#5C646D]">
                If the mechanical movement fails to wind, tick, or hold basic power reserve upon arrival, and such mechanical deviation was not noted in the product&apos;s condition grading report.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[#11161B] mb-2 uppercase">
            How to Request a Replacement
          </h3>
          <p>
            To initiate a replacement within 7 days of delivery, immediately message our horological support desk on WhatsApp at <strong>+91 91719 88875</strong> with your Order ID, clear photos/videos of the watch, and the mandatory unboxing video.
          </p>
        </div>
      </div>
    )
  },
  privacy: {
    title: "Privacy Policy & Data Protection",
    subtitle: "How we secure your contact details, shipping addresses, and horological preferences.",
    content: (
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#5C646D] font-light">
        <p>
          At RetroTimeCo, safeguarding the privacy of our collectors is a top priority. This Privacy Policy outlines how your personal information is collected, safeguarded, and utilized when you interact with our storefront or WhatsApp consignment network.
        </p>
        <h3 className="font-heading text-base font-bold text-[#11161B] uppercase pt-2">1. Information We Collect</h3>
        <p>
          When you place an inquiry or complete a checkout via WhatsApp, we collect basic logistics information required for fulfillment: your full name, shipping address, PIN code, and contact telephone number.
        </p>
        <h3 className="font-heading text-base font-bold text-[#11161B] uppercase pt-2">2. Zero Third-Party Data Selling</h3>
        <p>
          We never sell, rent, or trade customer contact lists to third-party marketing agencies. Your shipping details are shared strictly with our authorized logistics partners (India Post, Blue Dart, Delhivery, DTDC, Ecom Express) solely for delivering your timepiece.
        </p>
      </div>
    )
  },
  terms: {
    title: "Terms of Service & Horological Disclosure",
    subtitle: "Understanding vintage mechanical tolerances, water resistance, and warranty scope.",
    content: (
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#5C646D] font-light">
        <p>
          By browsing or purchasing from RetroTimeCo, you agree to the following terms regarding the historical nature of vintage horology:
        </p>
        <h3 className="font-heading text-base font-bold text-[#11161B] uppercase pt-2">1. Vintage Mechanical Tolerances</h3>
        <p>
          Unless labeled as &quot;Brand New&quot; (such as modern Casio releases), our timepieces from the 1960s, 1970s, and 1980s (Seiko, Citizen, HMT, Swiss models) are historical mechanical devices. While our Chennai workshop regulates movements to high standards (+/- 2 to 15 seconds per day), vintage mechanical watches do not keep quartz-level atomic time.
        </p>
        <h3 className="font-heading text-base font-bold text-[#11161B] uppercase pt-2">2. Water Resistance Limitations</h3>
        <p>
          Vintage watches should be treated as splash-resistant only. Do not submerge, shower, or swim with vintage watches, as 40+ year old case gaskets cannot withstand high underwater water pressure. Water damage is strictly excluded from replacement guarantees.
        </p>
      </div>
    )
  },
  contact: {
    title: "Workshop & Customer Support Desk",
    subtitle: "Get in touch with our master horologists and logistics coordinators in Chennai.",
    content: (
      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#5C646D]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-[#F4EFE6] border border-[#D8D1C5] space-y-2">
            <Phone className="w-5 h-5 text-[#C85A17]" />
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#11161B]">Direct WhatsApp Desk</h4>
            <p className="text-xs text-[#5C646D]">Available Mon-Sat (11 AM - 8 PM IST) for instant valuation &amp; replacement requests.</p>
            <a href="https://wa.me/919171988875" target="_blank" className="inline-block font-mono text-xs font-bold text-[#C85A17] hover:underline pt-1">
              +91 91719 88875 ↗
            </a>
          </div>

          <div className="p-5 bg-[#F4EFE6] border border-[#D8D1C5] space-y-2">
            <MapPin className="w-5 h-5 text-[#C85A17]" />
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#11161B]">Chennai Workshop</h4>
            <p className="text-xs text-[#5C646D]">Central inspection, restoration, and secure vault storage facility.</p>
            <address className="not-italic font-mono text-xs text-[#11161B] pt-1 leading-relaxed">
              372 Beach View, Chennai,<br />Tamil Nadu — 600019
            </address>
          </div>
        </div>
      </div>
    )
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const policy = POLICIES[slug] || POLICIES.shipping
  return {
    title: `${policy.title} | RetroTimeCo`,
    description: policy.subtitle,
  }
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const policy = POLICIES[slug] || POLICIES.shipping

  return (
    <div className="min-h-screen bg-[#F4EFE6] py-10 sm:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#11161B] hover:text-[#C85A17] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STOREFRONT</span>
        </Link>

        <div className="bg-[#F8F5EE] border border-[#D8D1C5] p-6 sm:p-10 space-y-6">
          <div className="border-b border-[#D8D1C5] pb-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold text-[#C85A17]">/</span>
              <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#C85A17] uppercase">
                OFFICIAL POLICY
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#11161B]">
              {policy.title}
            </h1>
            <p className="font-mono text-xs sm:text-sm text-[#5C646D]">
              {policy.subtitle}
            </p>
          </div>

          <div className="pt-2">
            {policy.content}
          </div>

          <div className="pt-6 border-t border-[#D8D1C5] flex flex-wrap gap-4 font-mono text-xs text-[#5C646D]">
            <span>RELATED POLICIES:</span>
            <Link href="/policies/shipping" className="text-[#11161B] hover:text-[#C85A17] uppercase">SHIPPING</Link>
            <span>•</span>
            <Link href="/policies/refund" className="text-[#11161B] hover:text-[#C85A17] uppercase">REPLACEMENT</Link>
            <span>•</span>
            <Link href="/policies/terms" className="text-[#11161B] hover:text-[#C85A17] uppercase">TERMS</Link>
            <span>•</span>
            <Link href="/policies/privacy" className="text-[#11161B] hover:text-[#C85A17] uppercase">PRIVACY</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
