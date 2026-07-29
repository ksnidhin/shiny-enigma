"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { label: "SHOP ALL", href: "/collections/all" },
  { label: "CASIO", href: "/collections/casio" },
  { label: "JAPANESE VINTAGE", href: "/collections/japanese-vintage" },
  { label: "SWISS VINTAGE", href: "/collections/swiss-vintage" },
  { label: "HMT WATCHES", href: "/collections/hmt-watches" },
  { label: "STRAPS & ACCESSORIES", href: "/collections/straps-accessories" },
  { label: "SELL YOUR WATCH", href: "/pages/sell" },
]

export function MobileMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger className="md:hidden p-2 -mr-2 text-[var(--color-brand)] focus-ring rounded-[var(--radius)]">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed inset-0 z-40 bg-black/50"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-[var(--shadow-custom)] outline-none"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-heading text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    RetroTimeCo
                  </span>
                  <DialogPrimitive.Close className="p-2 -mr-2 text-[var(--color-brand)] focus-ring rounded-[var(--radius)] opacity-70 transition-opacity hover:opacity-100">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </DialogPrimitive.Close>
                </div>
                <nav className="flex flex-col space-y-6">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-[var(--radius)] px-2 -mx-2 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
