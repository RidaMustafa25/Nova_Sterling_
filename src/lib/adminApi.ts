"use client";

import type { SiteContent } from "./content/schema";
import type { Product } from "./types";

// Browser-side calls to the /api/admin routes. Each throws an Error with a message fit to show the admin.

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", ...init });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  if (response.status === 401) {
    // The 8-hour admin session ran out: send them to log in, then back here.
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new Error("Your admin session has ended. Please log in again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { error?: string }).error || "Something went wrong. Please try again.");
  return data as T;
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const saveContent = (content: SiteContent) => call<SiteContent>("/api/admin/content", json("PUT", content));

export type ProductInput = Omit<Product, "id">;

export const createProduct = (product: ProductInput) =>
  call<Product[]>("/api/admin/products", json("POST", product)).then((added) => added[0]);

export const importProducts = (products: Product[]) => call<Product[]>("/api/admin/products", json("POST", { import: products }));

export const updateProduct = (id: string, product: ProductInput) =>
  call<Product>(`/api/admin/products/${encodeURIComponent(id)}`, json("PUT", product));

export const removeProduct = (id: string) =>
  call<{ ok: true }>(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });

/** Uploads an image file and returns the address it is served from. */
export async function uploadImage(file: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const { url } = await call<{ url: string }>("/api/admin/upload", { method: "POST", body: form });
  return url;
}
