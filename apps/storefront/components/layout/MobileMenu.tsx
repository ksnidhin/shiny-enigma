"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Menu, X } from "lucide-react"



export function MobileMenu({ collections }: { collections: any[] }) {
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
                className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-[var(--shadow-custom)] outline-none overflow-y-auto"
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
                  <Link
                    href="/collections/all"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-[var(--radius)] px-2 -mx-2 transition-colors"
                  >
                    SHOP ALL
                  </Link>
                  <div className="text-sm font-bold tracking-widest text-[var(--color-text-secondary)] uppercase pt-4 border-t border-[var(--color-border)]">
                    Collections
                  </div>
                  {collections.map((col) => (
                    <Link
                      key={col.href}
                      href={col.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand)] focus-ring rounded-[var(--radius)] px-2 -mx-2 transition-colors"
                    >
                      {col.title}
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
