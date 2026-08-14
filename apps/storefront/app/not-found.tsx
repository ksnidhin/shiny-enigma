import Link from "next/link"
import { Clock, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[var(--color-bg-primary)] px-4 text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--color-accent)]/10 mb-8">
        <Clock className="w-12 h-12 text-[var(--color-accent)] animate-pulse" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4 font-serif">
        404 — Lost to History
      </h1>
      
      <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
        We searched our archives, but it seems the page or collection you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-medium rounded-md hover:bg-[var(--color-accent)]/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Home
        </Link>
        <Link 
          href="/collections/all"
          className="inline-flex items-center justify-center px-8 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium rounded-md hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          Browse Collection
        </Link>
      </div>
    </div>
  )
}
