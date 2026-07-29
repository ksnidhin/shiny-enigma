import React from "react"
import Link from "next/link"
import { ShieldCheck, Truck, RotateCcw, Lock, Phone, MapPin, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react"
import { Metadata } from "next"

type PolicyType = "refund" | "shipping" | "privacy" | "terms" | "contact"

interface PolicyData {
  title: string;
  subtitle: string;
  icon: string;
  content: React.ReactNode;
}

const POLICIES: Record<string, PolicyData> = {
  shipping: {
    title: "All-India Express Shipping & Logistics Policy",
    subtitle: "Verified courier partners, transit insurance, and delivery guidelines across 28,000+ Indian PIN codes.",
    icon: "truck",
    content: (
      <div className="space-y-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-900 text-xs font-semibold flex items-start gap-3">
          <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm mb-1">100% Insured All-India Delivery</span>
            Every timepiece dispatched from our Chennai workshop is fully insured against transit damage, loss, or theft until it is safely signed for at your doorstep.
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-2">Authorized Courier &amp; Postal Partners</h3>
          <p className="mb-4">
            We partner exclusively with premier domestic logistics networks to ensure your mechanical timepiece experiences smooth, vibration-free transit:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium text-xs text-[var(--color-text-primary)]">
            <div className="p-3.5 bg-white border border-[var(--color-border)] rounded-xl flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="block">India Post (Speed Post)</strong>
                <span className="text-[11px] text-gray-500">Government-verified reach to every remote PIN code</span>
              </div>
            </div>
            <div className="p-3.5 bg-white border border-[var(--color-border)] rounded-xl flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="block">Blue Dart Express</strong>
                <span className="text-[11px] text-gray-500">Priority air transit for high-value Swiss chronometers</span>
              </div>
            </div>
            <div className="p-3.5 bg-white border border-[var(--color-border)] rounded-xl flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="block">Delhivery &amp; DTDC Express</strong>
                <span className="text-[11px] text-gray-500">Fast 2-4 day express metro &amp; tier-2 delivery</span>
              </div>
            </div>
            <div className="p-3.5 bg-white border border-[var(--color-border)] rounded-xl flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="block">Ecom Express &amp; XpressBees</strong>
                <span className="text-[11px] text-gray-500">Secure OTP-verified doorstep handover</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-2">Dispatch Timelines &amp; Tracking</h3>
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
    icon: "rotate",
    content: (
      <div className="space-y-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-900 text-xs font-semibold flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm text-red-700 mb-1">STRICT NO-REFUND POLICY</span>
            Under no circumstances do we issue cash or monetary refunds once a timepiece has been purchased. Due to the rare, collectible, and pre-owned nature of vintage horology, all sales are final subject only to our 7-Day Replacement Guarantee below.
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-2">7-Day Replacement Eligibility</h3>
          <p className="mb-4">
            We offer a strict <strong>7-Day Replacement Guarantee</strong> from the recorded date and time of courier delivery. A replacement watch of equivalent value or store credit will only be authorized under these specific conditions:
          </p>
          
          <div className="space-y-3">
            <div className="p-4 bg-white border border-[var(--color-border)] rounded-xl shadow-sm">
              <strong className="text-sm font-bold text-[var(--color-text-primary)] block mb-1">1. Transit Damage or Shattered Crystal</strong>
              <p className="text-xs text-gray-600">
                If the timepiece suffered physical damage during courier transit. <strong>Mandatory Requirement:</strong> You must provide a continuous, unedited 360-degree unboxing video showing the sealed courier bag being opened and the damage being revealed. Without an unboxing video, transit damage claims cannot be processed with our insurance partners.
              </p>
            </div>

            <div className="p-4 bg-white border border-[var(--color-border)] rounded-xl shadow-sm">
              <strong className="text-sm font-bold text-[var(--color-text-primary)] block mb-1">2. Incorrect Model or Reference Delivered</strong>
              <p className="text-xs text-gray-600">
                In the rare event that our workshop dispatched a different model, dial color, or reference number than what was specified on your order invoice.
              </p>
            </div>

            <div className="p-4 bg-white border border-[var(--color-border)] rounded-xl shadow-sm">
              <strong className="text-sm font-bold text-[var(--color-text-primary)] block mb-1">3. Mechanical Movement Failure</strong>
              <p className="text-xs text-gray-600">
                If the mechanical movement fails to wind, tick, or hold basic power reserve upon arrival, and such mechanical deviation was not noted in the product&apos;s condition grading report.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-2">How to Request a Replacement</h3>
          <p>
            To initiate a replacement within 7 days of delivery, immediately message our horological support desk on WhatsApp at <strong>+91 91719 88875</strong> with your Order ID, clear photos/videos of the watch, and the mandatory unboxing video. Once approved, our courier partner (Blue Dart / India Post) will arrange a reverse pickup from your location.
          </p>
        </div>
      </div>
    )
  },
  privacy: {
    title: "Privacy Policy & Data Protection",
    subtitle: "How we secure your contact details, shipping addresses, and horological preferences.",
    icon: "lock",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <p>
          At RetroTimeCo, safeguarding the privacy of our collectors is a top priority. This Privacy Policy outlines how your personal information is collected, safeguarded, and utilized when you interact with our storefront or WhatsApp consignment network.
        </p>
        <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] pt-2">1. Information We Collect</h3>
        <p>
          When you place an inquiry or complete a checkout via WhatsApp, we collect basic logistics information required for fulfillment: your full name, shipping address, PIN code, and contact telephone number.
        </p>
        <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] pt-2">2. Zero Third-Party Data Selling</h3>
        <p>
          We never sell, rent, or trade customer contact lists to third-party marketing agencies. Your shipping details are shared strictly with our authorized logistics partners (India Post, Blue Dart, Delhivery, DTDC, Ecom Express) solely for delivering your timepiece.
        </p>
      </div>
    )
  },
  terms: {
    title: "Terms of Service & Horological Disclosure",
    subtitle: "Understanding vintage mechanical tolerances, water resistance, and warranty scope.",
    icon: "shield",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <p>
          By browsing or purchasing from RetroTimeCo, you agree to the following terms regarding the historical nature of vintage horology:
        </p>
        <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] pt-2">1. Vintage Mechanical Tolerances</h3>
        <p>
          Unless labeled as &quot;Brand New&quot; (such as modern Casio releases), our timepieces from the 1960s, 1970s, and 1980s (Seiko, Citizen, HMT, Swiss models) are historical mechanical devices. While our Chennai workshop regulates movements to high standards (+/- 2 to 15 seconds per day), vintage mechanical watches do not keep quartz-level atomic time.
        </p>
        <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] pt-2">2. Water Resistance Limitations</h3>
        <p>
          Vintage watches should be treated as splash-resistant only. Do not submerge, shower, or swim with vintage watches, as 40+ year old case gaskets cannot withstand high underwater water pressure. Water damage is strictly excluded from replacement guarantees.
        </p>
      </div>
    )
  },
  contact: {
    title: "Workshop & Customer Support Desk",
    subtitle: "Get in touch with our master horologists and logistics coordinators in Chennai.",
    icon: "phone",
    content: (
      <div className="space-y-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 bg-white border border-[var(--color-border)] rounded-2xl shadow-sm space-y-2">
            <Phone className="w-6 h-6 text-[var(--color-brand)]" />
            <h4 className="font-bold text-base text-[var(--color-text-primary)]">Direct WhatsApp Desk</h4>
            <p className="text-xs text-gray-500">Available Mon-Sat (11 AM - 8 PM IST) for instant valuation &amp; replacement requests.</p>
            <a href="https://wa.me/919171988875" target="_blank" className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg mt-2 hover:bg-emerald-100 transition-colors">
              +91 91719 88875
            </a>
          </div>

          <div className="p-6 bg-white border border-[var(--color-border)] rounded-2xl shadow-sm space-y-2">
            <MapPin className="w-6 h-6 text-[var(--color-brand)]" />
            <h4 className="font-bold text-base text-[var(--color-text-primary)]">Chennai Workshop</h4>
            <p className="text-xs text-gray-500">Our central inspection, restoration, and secure vault storage facility.</p>
            <address className="not-italic text-xs text-gray-700 font-medium">
              18, ABC AVENUE, IST FLOOR,<br />MARKET LANE, KALADIPET,<br />CHENNAI, Tamil Nadu-600019
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
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-brand)] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-custom)] p-8 md:p-12 space-y-8">
          <div className="border-b border-[var(--color-border)] pb-8 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[var(--color-accent)] uppercase">Official Horological Policy</span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">
              {policy.title}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {policy.subtitle}
            </p>
          </div>

          <div className="pt-2">
            {policy.content}
          </div>

          <div className="pt-8 border-t border-[var(--color-border)] flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
            <span>Related Policies:</span>
            <Link href="/policies/shipping" className="text-[var(--color-brand)] hover:underline">Shipping &amp; Couriers</Link>
            <span>•</span>
            <Link href="/policies/refund" className="text-[var(--color-brand)] hover:underline">7-Day Replacement Policy</Link>
            <span>•</span>
            <Link href="/policies/terms" className="text-[var(--color-brand)] hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/policies/privacy" className="text-[var(--color-brand)] hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
