"use server"

const API_BASE = process.env.INTERNAL_API_URL || "http://localhost:9000/api";

export async function saveHeroSlides(slides: any) {
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
