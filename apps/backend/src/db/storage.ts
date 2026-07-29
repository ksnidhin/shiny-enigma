import fs from "fs"
import path from "path"

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

const DATA_FILE = path.join(__dirname, "../../data/watches.json")

export class WatchStorage {
  private static initFile() {
    if (!fs.existsSync(DATA_FILE)) {
      if (!fs.existsSync(path.dirname(DATA_FILE))) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify([]))
    }
  }

  public static async getAll(): Promise<WatchProduct[]> {
    this.initFile()
    const data = fs.readFileSync(DATA_FILE, "utf-8")
    return JSON.parse(data) as WatchProduct[]
  }

  public static async getByIdOrSlug(idOrSlug: string): Promise<WatchProduct | undefined> {
    const all = await this.getAll()
    return all.find(w => w.id === idOrSlug || w.slug === idOrSlug)
  }

  public static async saveAll(watches: WatchProduct[]): Promise<void> {
    this.initFile()
    fs.writeFileSync(DATA_FILE, JSON.stringify(watches, null, 2))
  }

  public static async create(watch: Omit<WatchProduct, "id"> & { id?: string }): Promise<WatchProduct> {
    const all = await this.getAll()
    const newId = watch.id || `rtc-${Date.now()}`
    const slug = watch.slug || watch.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    
    const newWatch: WatchProduct = {
      ...watch,
      id: newId,
      slug,
      gallery_images: watch.gallery_images?.length ? watch.gallery_images : [watch.image],
      in_stock: watch.in_stock ?? true,
      featured: watch.featured ?? false,
      rating: watch.rating || 5.0,
      reviews_count: watch.reviews_count || 1,
      authenticity_guarantee: watch.authenticity_guarantee ?? true,
    } as WatchProduct

    all.push(newWatch)
    await this.saveAll(all)
    return newWatch
  }

  public static async update(id: string, updates: Partial<WatchProduct>): Promise<WatchProduct | null> {
    const all = await this.getAll()
    const index = all.findIndex(w => w.id === id)
    if (index === -1) return null

    const updated = { ...all[index], ...updates }
    all[index] = updated
    await this.saveAll(all)
    return updated
  }

  public static async delete(id: string): Promise<boolean> {
    const all = await this.getAll()
    const index = all.findIndex(w => w.id === id)
    if (index === -1) return false
    
    all.splice(index, 1)
    await this.saveAll(all)
    return true
  }
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified_purchase: boolean;
  avatar_url?: string;
}

const REVIEWS_FILE = path.join(__dirname, "../../data/reviews.json")

export class ReviewStorage {
  private static initFile() {
    if (!fs.existsSync(REVIEWS_FILE)) {
      if (!fs.existsSync(path.dirname(REVIEWS_FILE))) {
        fs.mkdirSync(path.dirname(REVIEWS_FILE), { recursive: true })
      }
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]))
    }
  }

  public static async getAll(): Promise<Review[]> {
    this.initFile()
    const data = fs.readFileSync(REVIEWS_FILE, "utf-8")
    return JSON.parse(data) as Review[]
  }

  public static async saveAll(reviews: Review[]): Promise<void> {
    this.initFile()
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2))
  }

  public static async create(review: Omit<Review, "id">): Promise<Review> {
    const all = await this.getAll()
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`
    }
    all.unshift(newReview) // Add to top
    await this.saveAll(all)
    return newReview
  }

  public static async delete(id: string): Promise<boolean> {
    const all = await this.getAll()
    const filtered = all.filter(r => r.id !== id)
    if (filtered.length === all.length) return false
    await this.saveAll(filtered)
    return true
  }
}
