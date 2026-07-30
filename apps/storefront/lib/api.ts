export interface WatchProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  model_name: string;
  reference_number: string;
  era_label: string;
  price: number;
  original_price?: number;
  collection: string;
  collection_title: string;
  condition_grade: "mint" | "excellent" | "very_good" | "new";
  condition_label: string;
  condition_notes: string;
  image: string;
  gallery_images: string[];
  badge?: string;
  in_stock: boolean;
  featured: boolean;
  rating: number;
  reviews_count: number;
  specs: {
    movement_caliber: string;
    case_material: string;
    case_size_mm: number;
    lug_width_mm: number;
    crystal_type: "sapphire" | "mineral" | "acrylic";
    measured_accuracy_sec_per_day: string;
    strap_original: boolean;
    water_resistance: string;
  };
  authenticity_guarantee: boolean;
  service_history: string;
  description: string;
}

// Empty fallback catalog ready for user's manual inventory addition
export const LOCAL_WATCH_CATALOG: WatchProduct[] = [];

const isServer = typeof window === 'undefined';
const isDev = process.env.NODE_ENV === 'development';
const API_BASE = isServer 
  ? (process.env.INTERNAL_API_URL || "http://localhost:9000/api")
  : (process.env.NEXT_PUBLIC_API_URL || (isDev ? "http://localhost:9000/api" : "/api"));

export async function fetchWatches(filters?: {
  collection?: string;
  brand?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  search?: string;
  in_stock?: boolean;
}): Promise<{
  success: boolean;
  count: number;
  total: number;
  available_brands: string[];
  available_collections: string[];
  data: WatchProduct[];
}> {
  try {
    const params = new URLSearchParams()
    if (filters?.collection && filters.collection !== "all") params.set("collection", filters.collection)
    if (filters?.brand && filters.brand !== "all") params.set("brand", filters.brand)
    if (filters?.condition && filters.condition !== "all") params.set("condition", filters.condition)
    if (filters?.min_price !== undefined) params.set("min_price", filters.min_price.toString())
    if (filters?.max_price !== undefined) params.set("max_price", filters.max_price.toString())
    if (filters?.sort) params.set("sort", filters.sort)
    if (filters?.search) params.set("search", filters.search)
    if (filters?.in_stock) params.set("in_stock", "true")

    const res = await fetch(`${API_BASE}/watches?${params.toString()}`, {
      next: { revalidate: 0 },
      cache: "no-store",
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
    // Backend offline fallback to local catalog
  }

  let filtered = [...LOCAL_WATCH_CATALOG]
  if (filters?.collection && filters.collection !== "all") {
    filtered = filtered.filter(w => w.collection.toLowerCase() === filters.collection?.toLowerCase())
  }
  if (filters?.brand && filters.brand !== "all") {
    filtered = filtered.filter(w => w.brand.toLowerCase() === filters.brand?.toLowerCase())
  }
  if (filters?.condition && filters.condition !== "all") {
    filtered = filtered.filter(w => w.condition_grade.toLowerCase() === filters.condition?.toLowerCase())
  }
  if (filters?.min_price !== undefined && !isNaN(filters.min_price)) {
    filtered = filtered.filter(w => w.price >= (filters.min_price || 0))
  }
  if (filters?.max_price !== undefined && !isNaN(filters.max_price)) {
    filtered = filtered.filter(w => w.price <= (filters.max_price || Infinity))
  }
  if (filters?.in_stock) {
    filtered = filtered.filter(w => w.in_stock)
  }
  if (filters?.search && filters.search.trim() !== "") {
    const term = filters.search.toLowerCase().trim()
    filtered = filtered.filter(w => 
      w.name.toLowerCase().includes(term) ||
      w.brand.toLowerCase().includes(term) ||
      w.model_name.toLowerCase().includes(term) ||
      w.description.toLowerCase().includes(term)
    )
  }
  if (filters?.sort) {
    if (filters.sort === "price_asc") filtered.sort((a, b) => a.price - b.price)
    if (filters.sort === "price_desc") filtered.sort((a, b) => b.price - a.price)
    if (filters.sort === "featured") filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }

  const available_brands = Array.from(new Set(LOCAL_WATCH_CATALOG.map(w => w.brand))).sort()
  const available_collections = Array.from(new Set(LOCAL_WATCH_CATALOG.map(w => w.collection)))

  return {
    success: true,
    count: filtered.length,
    total: LOCAL_WATCH_CATALOG.length,
    available_brands,
    available_collections,
    data: filtered,
  }
}

export async function fetchCollections(): Promise<{ success: boolean; data: any[] }> {
  try {
    const res = await fetch(`${API_BASE}/collections`, {
      next: { revalidate: 60 },
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {}
  return { success: false, data: [] }
}

export async function fetchWatchBySlug(slug: string): Promise<{
  success: boolean;
  data?: WatchProduct;
  related?: WatchProduct[];
}> {
  try {
    const res = await fetch(`${API_BASE}/watches/${slug}`, {
      next: { revalidate: 0 },
      cache: "no-store",
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
    // Fallback local lookup
  }

  const watch = LOCAL_WATCH_CATALOG.find(
    w => w.slug.toLowerCase() === slug.toLowerCase() || w.id.toLowerCase() === slug.toLowerCase()
  )
  if (!watch) return { success: false }

  const related = LOCAL_WATCH_CATALOG
    .filter(w => w.collection === watch.collection && w.id !== watch.id)
    .slice(0, 4)

  return { success: true, data: watch, related }
}

// ─── ADMIN CRUD API METHODS ───

export async function fetchAdminStats(): Promise<{
  success: boolean;
  data?: {
    total_timepieces: number;
    in_stock_count: number;
    total_inventory_value_rs: number;
    brands_count: number;
    collections_count: number;
  };
}> {
  try {
    const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" })
    if (res.ok) return await res.json()
  } catch {}
  
  const total_value = LOCAL_WATCH_CATALOG.reduce((acc, w) => acc + (w.in_stock ? w.price : 0), 0)
  return {
    success: true,
    data: {
      total_timepieces: LOCAL_WATCH_CATALOG.length,
      in_stock_count: LOCAL_WATCH_CATALOG.filter(w => w.in_stock).length,
      total_inventory_value_rs: total_value,
      brands_count: new Set(LOCAL_WATCH_CATALOG.map(w => w.brand)).size,
      collections_count: new Set(LOCAL_WATCH_CATALOG.map(w => w.collection)).size,
    }
  }
}

export async function createWatch(watch: Partial<WatchProduct>): Promise<{ success: boolean; data?: WatchProduct; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/watches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(watch),
    })
    return await res.json()
  } catch (err) {
    return { success: false, message: "Could not connect to custom backend server on port 9000." }
  }
}

export async function updateWatch(id: string, updates: Partial<WatchProduct>): Promise<{ success: boolean; data?: WatchProduct; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/watches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    return await res.json()
  } catch (err) {
    return { success: false, message: "Could not connect to custom backend server on port 9000." }
  }
}

export async function deleteWatch(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/watches/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete timepiece");
    return await res.json();
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const formData = new FormData()
    formData.append("image", file)
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    })
    if (!res.ok) throw new Error("Upload failed")
    return await res.json()
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}

export async function generateWatchDetails(name: string, year?: string): Promise<{ success: boolean; data?: Partial<WatchProduct>; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/watches/ai-generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, year }),
    })
    if (!res.ok) throw new Error("AI Generation failed")
    return await res.json()
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}

export async function importWatchesBulk(watches: Partial<WatchProduct>[]): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/watches/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watches }),
    })
    if (!res.ok) throw new Error("Bulk import failed")
    return await res.json()
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}

export async function fetchStats(): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/stats`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    })
    if (!res.ok) throw new Error("Failed to fetch stats")
    return await res.json()
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}
