import type { Product } from "../types";

export const MAX_PRODUCT_IMAGES = 5;

/** The store's starting products, shown until the admin saves their own list. */
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "dummy-1",
    title: "Sterling Edition Precision Chronograph",
    price: 189.99,
    description: "High precision luxury watch designed for durability and elegance.",
    images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop"],
  },
  {
    id: "dummy-2",
    title: "Vintage Mechanical Sewing Machine",
    price: 145.0,
    description: "Classic heavy-duty vintage precision equipment for fine tailoring.",
    images: ["https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=900&auto=format&fit=crop"],
  },
  {
    id: "dummy-3",
    title: "Luxury Leather Executive Briefcase",
    price: 210.0,
    description: "Handcrafted genuine leather briefcase designed for modern professionals.",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop"],
  },
  {
    id: "dummy-4",
    title: "Minimalist Wireless Audio Headphones",
    price: 129.5,
    description: "Studio-grade noise canceling over-ear headphones with premium sound quality.",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop"],
  },
];

/** Returns a clean product, or a message explaining what is wrong with it. */
export function normalizeProduct(value: unknown): Product | string {
  if (!value || typeof value !== "object") return "Invalid product.";
  const v = value as Record<string, unknown>;

  const id = typeof v.id === "string" ? v.id.trim() : "";
  const title = typeof v.title === "string" ? v.title.trim() : "";
  const price = typeof v.price === "number" ? v.price : Number(v.price);
  const description = typeof v.description === "string" ? v.description.trim() : "";
  const images = Array.isArray(v.images)
    ? v.images.filter((s): s is string => typeof s === "string" && s.trim() !== "").map((s) => s.trim())
    : [];

  if (!/^[\w-]{1,64}$/.test(id)) return "Invalid product id.";
  if (!title) return "Please give the product a title.";
  if (!Number.isFinite(price) || price < 0) return "Please enter a valid price.";
  if (images.length === 0) return "Please add at least one image: upload a file or paste a URL.";
  if (images.some((src) => !/^(https?:\/\/|\/)/i.test(src))) return "Image links must start with https:// or /.";

  return { id, title, price: Math.round(price * 100) / 100, description, images: images.slice(0, MAX_PRODUCT_IMAGES) };
}

export function normalizeProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeProduct).filter((p): p is Product => typeof p !== "string");
}
