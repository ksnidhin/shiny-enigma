import { redirect } from "next/navigation"

export default function AdminLegacyRedirectPage() {
  const target = process.env.ADMIN_REDIRECT_URL || "https://accounts.shopify.com"
  redirect(target)
}
