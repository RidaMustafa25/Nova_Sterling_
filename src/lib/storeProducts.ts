"use client";

import { useProducts } from "@/context/SiteContentContext";
import type { Product } from "./types";

/**
 * The storefront's product list, as saved from the admin (content/store-products.json, newest first).
 * It arrives with the page from the server, so it is always ready.
 */
export function useStoreProducts(): { products: Product[]; ready: boolean } {
  return { products: useProducts(), ready: true };
}
