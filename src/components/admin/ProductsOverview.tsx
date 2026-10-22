"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CircleAlert, FileText, ImageOff, LoaderCircle, PackagePlus, Pencil, Search, Trash2, UploadCloud } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { removeProduct } from "@/lib/adminApi";
import { loadLegacyProducts, moveLegacyProducts } from "@/lib/adminProducts";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-3xl bg-paper p-6 ring-1 ring-line">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="price mt-3 text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-ink-soft">{note}</p>
    </div>
  );
}

export default function ProductsOverview({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [legacy, setLegacy] = useState<Product[]>([]);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const known = new Set(initial.map((p) => p.id));
    setLegacy(loadLegacyProducts().filter((p) => !known.has(p.id)));
  }, [initial]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products;
  }, [products, query]);

  const prices = products.map((p) => p.price);
  const average = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

  async function confirmDelete(id: string) {
    setError("");
    setDeleting(id);
    try {
      await removeProduct(id);
      setProducts((list) => list.filter((p) => p.id !== id));
      setConfirming(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleting(null);
    }
  }

  async function moveLegacy() {
    setError("");
    setMoving(true);
    try {
      const added = await moveLegacyProducts(legacy);
      setProducts((list) => [...added, ...list]);
      setLegacy([]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setMoving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display text-4xl sm:text-5xl">Products</h1>
          <p className="mt-2 text-ink-soft">Everything currently in your store, newest first.</p>
        </div>
        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
          <Link href="/admin/content" className="btn-secondary h-11">
            <FileText className="h-4 w-4" aria-hidden /> Edit site content
          </Link>
          <Link href="/admin/products/new" className="btn-primary h-11">
            <PackagePlus className="h-4 w-4" aria-hidden /> Add product
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Products in store" value={String(products.length)} note="Visible to every visitor" />
        <Stat label="Average price" value={formatPrice(average)} note="Across all products" />
        <Stat
          label="Price range"
          value={prices.length ? formatPrice(Math.min(...prices)) : "–"}
          note={prices.length ? `up to ${formatPrice(Math.max(...prices))}` : "No products yet"}
        />
      </div>

      {legacy.length > 0 && (
        <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-accent-soft p-5 text-accent sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            <span className="font-semibold">
              {legacy.length} {legacy.length === 1 ? "product" : "products"} saved only in this browser.
            </span>{" "}
            Move {legacy.length === 1 ? "it" : "them"} into the store so every visitor can see {legacy.length === 1 ? "it" : "them"}.
          </p>
          <button type="button" onClick={moveLegacy} disabled={moving} className="btn-primary h-10 flex-none bg-accent px-5">
            {moving ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : <UploadCloud className="h-4 w-4" aria-hidden />}
            {moving ? "Moving…" : "Move to store"}
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="alert-error mt-6">
          <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
          <p>{error}</p>
        </div>
      )}

      <section aria-labelledby="products-heading" className="mt-8 overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
        <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="products-heading" className="text-lg font-semibold">
            All products
          </h2>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="field h-10 rounded-full py-2 pl-11"
            />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <PackagePlus className="h-8 w-8 text-ink-mute" aria-hidden />
            <p className="mt-4 font-medium">Your store has no products</p>
            <Link href="/admin/products/new" className="btn-primary mt-5 h-10 px-5">
              Add your first product
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <ImageOff className="h-8 w-8 text-ink-mute" aria-hidden />
            <p className="mt-4 font-medium">No products match &ldquo;{query.trim()}&rdquo;</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-xs text-ink-soft">
                  <th scope="col" className="px-5 py-3 font-medium">Product</th>
                  <th scope="col" className="px-5 py-3 font-medium">Price</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {visible.map((row) => (
                    <motion.tr
                      key={row.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
                      className="border-t border-line transition-colors hover:bg-canvas"
                    >
                      <td className="px-5 py-3">
                        <Link href={`/admin/products/${row.id}`} className="group flex items-center gap-4">
                          <div className="relative h-14 w-12 flex-none overflow-hidden rounded-xl bg-well">
                            {row.images[0] ? <ProductImage src={row.images[0]} alt="" sizes="48px" /> : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium group-hover:underline">{row.title}</p>
                            <p className="text-xs text-ink-soft">
                              {row.images.length} {row.images.length === 1 ? "image" : "images"}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="price px-5 py-3 font-medium">{formatPrice(row.price)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {confirming === row.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => confirmDelete(row.id)}
                                disabled={deleting === row.id}
                                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-danger px-3 text-xs font-semibold text-paper transition hover:opacity-90"
                              >
                                {deleting === row.id && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden />}
                                Delete for good
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirming(null)}
                                className="inline-flex h-9 items-center rounded-full px-3 text-xs font-semibold text-ink-soft hover:text-ink"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <Link
                                href={`/admin/products/${row.id}`}
                                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink-soft transition hover:bg-well hover:text-ink"
                              >
                                <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                              </Link>
                              <Link
                                href={`/product/${row.id}`}
                                target="_blank"
                                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink-soft transition hover:bg-well hover:text-ink"
                              >
                                View <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                              </Link>
                              <button
                                type="button"
                                onClick={() => setConfirming(row.id)}
                                aria-label={`Delete ${row.title}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-danger-soft hover:text-danger"
                              >
                                <Trash2 className="h-4 w-4" aria-hidden />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
