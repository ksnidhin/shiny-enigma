import Link from "next/link"
import { Clock, ArrowLeft, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#F4EFE6] px-4 text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F8F5EE] border border-[#D8D1C5] mb-8">
        <Clock className="w-10 h-10 text-[#C85A17]" />
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl font-mono font-bold text-[#C85A17]">/</span>
        <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#5C646D]">
          PAGE NOT FOUND
        </span>
      </div>

      <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#11161B] mb-4 uppercase">
        404 — Lost to History
      </h1>
      
      <p className="font-mono text-xs sm:text-sm text-[#5C646D] mb-8 max-w-md mx-auto leading-relaxed">
        We searched our horological archives, but it seems the page, reference, or collection you are looking for does not exist or has moved.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#0E1620] hover:bg-[#16212E] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          <span>RETURN TO HOME</span>
        </Link>
        <Link 
          href="/collections/all"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#F8F5EE] border border-[#D8D1C5] text-[#11161B] hover:text-[#C85A17] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <span>BROWSE ARCHIVE</span>
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Link>
      </div>
    </div>
  )
}
