import * as React from "react"
import { cn } from "@/lib/utils"

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
}

const Heading = React.forwardRef<HTMLHeadingElement, TypographyProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ className, level = 1, ...props }, ref) => {
    const Tag = `h${level}` as React.ElementType
    return (
      <Tag
        ref={ref}
        className={cn(
          "font-heading text-[var(--color-text-primary)] tracking-tight",
          level === 1 && "text-4xl md:text-5xl lg:text-6xl font-bold",
          level === 2 && "text-3xl md:text-4xl font-semibold",
          level === 3 && "text-2xl md:text-3xl font-semibold",
          level === 4 && "text-xl md:text-2xl font-semibold",
          level === 5 && "text-lg md:text-xl font-medium",
          level === 6 && "text-base md:text-lg font-medium",
          className
        )}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

const Body = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "leading-7 text-[var(--color-text-primary)] font-body",
          className
        )}
        {...props}
      />
    )
  }
)
Body.displayName = "Body"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--color-text-primary)] font-body",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Heading, Body, Label }
