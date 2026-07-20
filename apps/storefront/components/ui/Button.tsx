import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "secondary"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-ring disabled:pointer-events-none disabled:opacity-50",
          "h-10 px-4 py-2",
          variant === "primary"
            ? "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] shadow-sm shadow-black/5"
            : "border border-[var(--color-brand)] text-[var(--color-brand)] bg-transparent hover:bg-[var(--color-surface)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
