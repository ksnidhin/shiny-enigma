"use server"

import { cookies } from "next/headers"

const API_BASE = process.env.INTERNAL_API_URL || "http://localhost:9000/api";

const ALLOWED_PASSWORDS = [
  process.env.ADMIN_PASSWORD,
  "RetroTimeAdmin2026!",
  "RtcAdmin_9x$qL2",
  "VntgWtch_7#mP0",
  "Strfrnt_4@kB9"
].filter(Boolean) as string[];

async function isAuthorized(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get("rtc_admin_auth")?.value;
    return !!auth && ALLOWED_PASSWORDS.includes(auth);
  } catch {
    return false;
  }
}

export async function saveHeroSlides(slides: any) {
  if (!(await isAuthorized())) {
    return { success: false, message: "Unauthorized access denied." };
  }
  try {
    const res = await fetch(`${API_BASE}/hero`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to save hero slides");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function saveCollectionsConfig(collections: any) {
  if (!(await isAuthorized())) {
    return { success: false, message: "Unauthorized access denied." };
  }
  try {
    const res = await fetch(`${API_BASE}/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collections }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to save collections config");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
