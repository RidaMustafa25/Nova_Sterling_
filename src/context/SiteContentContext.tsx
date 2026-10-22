"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/lib/content/schema";
import type { Product } from "@/lib/types";

interface StoreData {
  content: SiteContent;
  products: Product[];
}

const SiteContentContext = createContext<StoreData | null>(null);

/** Filled by the storefront layout with the content and products saved from the admin. */
export function SiteContentProvider({ content, products, children }: StoreData & { children: ReactNode }) {
  return <SiteContentContext.Provider value={{ content, products }}>{children}</SiteContentContext.Provider>;
}

function useStoreData(): StoreData {
  const data = useContext(SiteContentContext);
  if (!data) throw new Error("useSiteContent must be used inside <SiteContentProvider>.");
  return data;
}

export function useSiteContent(): SiteContent {
  return useStoreData().content;
}

export function useProducts(): Product[] {
  return useStoreData().products;
}
