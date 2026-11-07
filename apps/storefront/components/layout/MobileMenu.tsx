"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Menu, X, ArrowRight, ShieldCheck, Truck } from "lucide-react"

const BASE_LINKS = [
  { label: "SHOP ALL TIMEPIECES", href: "/collections/all" },
  { label: "100% AUTHENTICITY PLEDGE", href: "/pages/authenticity" },
  { label: "ALL-INDIA SHIPPING & LOGISTICS", href: "/policies/shipping" },
  { label: "7-DAY REPLACEMENT POLICY", href: "/policies/refund" },
  { label: "CONTACT & WORKSHOP DESK", href: "/policies/contact" },
]

export function MobileMenu({ collections }: { collections: any[] }) {
  const [open, setOpen] = React.useState(false)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger className="lg:hidden p-2 -ml-2 text-[#0E1622] hover:text-[#C85A17] focus-ring rounded-md transition-colors">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open navigation menu</span>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed inset-y-0 left-0 z-50 w-full max-w-xs sm:max-w-sm border-r border-[#D8D1C5] bg-[#F4EFE6] p-6 shadow-2xl outline-none overflow-y-auto flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#D8D1C5]">
                    <span className="font-heading text-2xl font-bold tracking-tight text-[#0E1622]">
                      RetroTimeCo<span className="text-[#C85A17]">.</span>
                    </span>
                    <DialogPrimitive.Close className="p-2 -mr-2 text-[#0E1622] hover:text-[#C85A17] focus-ring rounded-md transition-colors">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </DialogPrimitive.Close>
                  </div>

                  <div className="text-[10px] font-bold tracking-[0.2em] text-[#5C646D] uppercase mb-3">
                    Curated Archives
                  </div>
                  <nav className="flex flex-col space-y-1 mb-8">
                    <Link
                      href="/collections/all"
                      onClick={() => setOpen(false)}
                      className="text-sm font-bold tracking-wider text-[#11161B] hover:text-[#C85A17] py-2.5 flex items-center justify-between border-b border-[#D8D1C5]/50 transition-colors"
                    >
                      <span>ALL TIMEPIECES</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C85A17]" />
                    </Link>
                    {collections.map((col) => (
                      <Link
                        key={col.href}
                        href={col.href}
                        onClick={() => setOpen(false)}
                        className="text-sm font-semibold tracking-wide text-[#11161B] hover:text-[#C85A17] py-2 flex items-center justify-between transition-colors"
                      >
                        <span>{col.title}</span>
                      </Link>
                    ))}
                  </nav>

                  <div className="text-[10px] font-bold tracking-[0.2em] text-[#5C646D] uppercase mb-3 pt-4 border-t border-[#D8D1C5]">
                    Horological Standards
                  </div>
                  <nav className="flex flex-col space-y-2">
                    {BASE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-xs font-medium text-[#5C646D] hover:text-[#11161B] py-1.5 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="pt-6 mt-6 border-t border-[#D8D1C5] text-[11px] text-[#5C646D] space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C85A17]" />
                    <span>Master Watchmaker Regulated &amp; Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C85A17]" />
                    <span>Insured Courier Transit Across India</span>
                  </div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
