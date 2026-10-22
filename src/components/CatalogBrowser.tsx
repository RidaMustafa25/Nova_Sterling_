"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PackageSearch, Search, X } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type SortKey = "default" | "price-asc" | "price-desc" | "name-asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Newest" },
  { value: "price-asc", label: "Price: low" },
  { value: "price-desc", label: "Price: high" },
  { value: "name-asc", label: "A–Z" },
];

/** Search plus a segmented sort control (with a sliding thumb) over the product grid. */
export default function CatalogBrowser({ products, initialQuery = "" }: { products: Product[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("default");
  const reduce = useReducedMotion();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? products.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(q))
      : products.slice();

    switch (sort) {
      case "price-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "name-asc":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [products, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Sort products" className="inline-flex self-start rounded-full bg-well p-1">
          {SORT_OPTIONS.map((o) => {
            const active = sort === o.value;
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={active}
                onClick={() => setSort(o.value)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="sort-thumb"
                    className="absolute inset-0 rounded-full bg-paper shadow-[0_1px_2px_rgba(17,17,17,0.08),0_4px_12px_-6px_rgba(17,17,17,0.2)]"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{o.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <p className="whitespace-nowrap text-sm text-ink-soft" aria-live="polite">
            {visible.length} {visible.length === 1 ? "product" : "products"}
          </p>
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="field rounded-full pl-11 pr-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-mute transition hover:bg-well hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-[28px] bg-well px-6 py-24 text-center">
          <PackageSearch className="h-10 w-10 text-ink-mute" aria-hidden />
          <p className="mt-5 text-lg font-semibold">No products match &ldquo;{query.trim()}&rdquo;</p>
          <p className="mt-1 text-sm text-ink-soft">Try a shorter word, or clear the search to see everything.</p>
          <button type="button" onClick={() => setQuery("")} className="btn-secondary mt-7">
            Clear search
          </button>
        </div>
      ) : (
        <motion.div layout={!reduce} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((product, i) => (
              <motion.div
                key={product.id}
                layout={!reduce}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} priority={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
