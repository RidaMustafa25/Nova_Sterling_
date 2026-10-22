import fs from "node:fs";
import path from "node:path";
import type { Product } from "./types";

/**
 * Products live as JSON files in /content/products (one file per product).
 * They are edited through Decap CMS (/admin) or by hand, and are read at
 * build time, so every change committed to Git triggers a fresh deploy.
 */
const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");
export const PLACEHOLDER_IMAGE = "/uploads/placeholder.svg";
const MAX_IMAGES = 5;

function normalizeImagePath(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v) || v.startsWith("/")) return v;
  return `/${v}`;
}

function readImages(raw: Record<string, unknown>): string[] {
  const out: string[] = [];

  // Preferred shape: "images": ["/uploads/a.jpg", "/uploads/b.jpg"]
  if (Array.isArray(raw.images)) {
    for (const item of raw.images) {
      if (typeof item === "string") {
        out.push(item);
      } else if (item && typeof item === "object") {
        // Also tolerate [{ "image": "/uploads/a.jpg" }]
        const nested = (item as Record<string, unknown>).image;
        if (typeof nested === "string") out.push(nested);
      }
    }
  }

  // Fallback shape: "image1" ... "image5" as separate keys
  if (out.length === 0) {
    for (let i = 1; i <= MAX_IMAGES; i += 1) {
      const value = raw[`image${i}`];
      if (typeof value === "string") out.push(value);
    }
  }

  const cleaned = out.map(normalizeImagePath).filter(Boolean).slice(0, MAX_IMAGES);
  return cleaned.length > 0 ? cleaned : [PLACEHOLDER_IMAGE];
}

function normalizeProduct(raw: unknown, slug: string): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const title = typeof r.title === "string" ? r.title.trim() : "";
  if (!title) return null;

  const price = Number(r.price);
  const id = typeof r.id === "string" && r.id.trim() ? r.id.trim() : slug;

  return {
    id,
    title,
    price: Number.isFinite(price) && price >= 0 ? price : 0,
    description: typeof r.description === "string" ? r.description : "",
    images: readImages(r),
    featured: r.featured === true,
  };
}

export function getAllProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  const products: Product[] = [];
  for (const file of fs.readdirSync(PRODUCTS_DIR)) {
    if (!file.toLowerCase().endsWith(".json")) continue;
    try {
      const content = fs.readFileSync(path.join(PRODUCTS_DIR, file), "utf8");
      const product = normalizeProduct(JSON.parse(content), file.replace(/\.json$/i, ""));
      if (product) products.push(product);
    } catch (error) {
      console.warn(`[products] Skipping ${file}: could not parse JSON.`, error);
    }
  }

  return products.sort((a, b) => a.title.localeCompare(b.title));
}

export function getProduct(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getFeaturedProducts(limit = 8): Product[] {
  const all = getAllProducts();
  const featured = all.filter((p) => p.featured);
  // If nothing is marked featured yet, fall back to the first products.
  return (featured.length > 0 ? featured : all).slice(0, limit);
}
