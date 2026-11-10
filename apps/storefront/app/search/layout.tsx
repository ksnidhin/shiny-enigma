import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Archive",
  description: "Search curated authentic vintage timepieces at RetroTimeCo.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
