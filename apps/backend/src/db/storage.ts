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
  collection: "casio" | "japanese-vintage" | "swiss-vintage" | "s23-tank" | "straps-accessories";
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

const DATA_DIR = path.join(__dirname, "../../data")
const DATA_FILE = path.join(DATA_DIR, "watches.json")

// Clean empty catalog ready for manual admin input
const INITIAL_CATALOG: WatchProduct[] = [];

export class WatchStorage {
  private static init(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_CATALOG, null, 2), "utf-8");
    }
  }

  public static getAll(): WatchProduct[] {
    this.init();
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data) as WatchProduct[];
    } catch {
      return INITIAL_CATALOG;
    }
  }

  public static getByIdOrSlug(idOrSlug: string): WatchProduct | undefined {
    const all = this.getAll();
    return all.find(w => w.id.toLowerCase() === idOrSlug.toLowerCase() || w.slug.toLowerCase() === idOrSlug.toLowerCase());
  }

  public static saveAll(watches: WatchProduct[]): void {
    this.init();
    fs.writeFileSync(DATA_FILE, JSON.stringify(watches, null, 2), "utf-8");
  }

  public static create(watch: Omit<WatchProduct, "id"> & { id?: string }): WatchProduct {
    const all = this.getAll();
    const newId = watch.id || `rtc-${Date.now()}`;
    const slug = watch.slug || watch.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
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
    };

    all.unshift(newWatch);
    this.saveAll(all);
    return newWatch;
  }

  public static update(id: string, updates: Partial<WatchProduct>): WatchProduct | null {
    const all = this.getAll();
    const index = all.findIndex(w => w.id === id || w.slug === id);
    if (index === -1) return null;

    const updated = { ...all[index]!, ...updates };
    all[index] = updated;
    this.saveAll(all);
    return updated;
  }

  public static delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(w => w.id !== id && w.slug !== id);
    if (filtered.length === all.length) return false;
    this.saveAll(filtered);
    return true;
  }
}
