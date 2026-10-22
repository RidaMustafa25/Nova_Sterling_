"use client";

import type { Product } from "./types";
import { importProducts, uploadImage } from "./adminApi";

// Before products were stored on the server, the admin saved them in their own browser
// under this key. These helpers move any such products into the store, once.
const LEGACY_KEY = "nova_products";

export function loadLegacyProducts(): Product[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

/** Uploads any images that were stored inside the browser, imports the products, then forgets them. */
export async function moveLegacyProducts(products: Product[]): Promise<Product[]> {
  const ready: Product[] = [];
  for (const product of products) {
    const images: string[] = [];
    for (const src of product.images ?? []) {
      images.push(src.startsWith("data:") ? await uploadImage(await (await fetch(src)).blob()) : src);
    }
    ready.push({ ...product, images });
  }
  const added = await importProducts(ready);
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
  return added;
}
