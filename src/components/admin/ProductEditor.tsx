"use client";

import { useState, type DragEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CircleAlert, CircleCheck, ImagePlus, Link as LinkIcon, LoaderCircle, X } from "lucide-react";
import Field from "@/components/Field";
import { createProduct, updateProduct, uploadImage } from "@/lib/adminApi";
import { MAX_PRODUCT_IMAGES } from "@/lib/content/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

function ImageSlot({
  index,
  value,
  onChange,
}: {
  index: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function take(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Not an image file.");
    setError("");
    setBusy(true);
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setOver(false);
    take(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
          className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed text-center transition-all duration-300 ${
            over ? "scale-[1.02] border-ink bg-well" : value ? "border-transparent bg-well" : "border-line bg-canvas hover:border-ink-mute hover:bg-well"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={`Image ${index + 1} preview`} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <>
              <ImagePlus className="h-5 w-5 text-ink-mute" aria-hidden />
              <span className="mt-2 px-2 text-xs font-medium text-ink-soft">
                {index === 0 ? "Cover image" : `Image ${index + 1}`}
              </span>
              <span className="mt-0.5 hidden text-[11px] text-ink-mute sm:block">Drop or click</span>
            </>
          )}
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-paper/70 backdrop-blur-sm">
              <LoaderCircle className="h-5 w-5 animate-spin text-ink" aria-label="Uploading" />
            </span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="sr-only"
            aria-label={`Upload image ${index + 1}`}
            onChange={(e) => {
              take(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {value && !busy && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Remove image ${index + 1}`}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur transition hover:scale-110"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </div>
      <div className="relative">
        <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-mute" aria-hidden />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste URL"
          aria-label={`Image ${index + 1} URL`}
          className="field h-9 rounded-full py-1.5 pl-8 pr-3 text-xs"
        />
      </div>
      {error && (
        <p role="alert" className="text-[11px] leading-snug text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const slotsFor = (images: string[] = []) =>
  Array.from({ length: MAX_PRODUCT_IMAGES }, (_, i) => images[i] ?? "");

/** Add a product (no `product`) or edit an existing one. */
export default function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [images, setImages] = useState<string[]>(slotsFor(product?.images));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const setImage = (i: number, value: string) => setImages((prev) => prev.map((v, j) => (j === i ? value : v)));

  const validImages = images.map((img) => img.trim()).filter(Boolean);
  const numericPrice = parseFloat(price);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSavedId(null);
    if (!title.trim()) return setError("Please give the product a title.");
    if (!Number.isFinite(numericPrice) || numericPrice < 0) return setError("Please enter a valid price.");
    if (validImages.length === 0) return setError("Please add at least one image: upload a file or paste a URL.");

    const input = { title: title.trim(), price: numericPrice, description: description.trim(), images: validImages };
    setSaving(true);
    try {
      if (product) {
        await updateProduct(product.id, input);
        setSavedId(product.id);
      } else {
        const created = await createProduct(input);
        setSavedId(created.id);
        setTitle("");
        setPrice("");
        setDescription("");
        setImages(slotsFor());
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="display text-4xl sm:text-5xl">{editing ? "Edit product" : "Add product"}</h1>
      <p className="mt-2 text-ink-soft">
        {editing ? "Changes show in your store as soon as you save." : "It appears in your store as soon as you save it."}
      </p>

      <AnimatePresence>
        {savedId && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            className="mt-6 flex flex-col gap-3 rounded-3xl bg-accent-soft p-4 text-accent sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="flex items-center gap-2 text-sm font-medium">
              <CircleCheck className="h-5 w-5" aria-hidden />
              {editing ? "Saved. Your store shows the new version." : "Saved. The product is now live in your store."}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/product/${savedId}`}
                target="_blank"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-paper"
              >
                View product <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={() => setSavedId(null)}
                className="inline-flex h-9 items-center rounded-full px-3 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <section className="space-y-5 rounded-3xl bg-paper p-6 ring-1 ring-line sm:p-8">
            <h2 className="text-lg font-semibold">Details</h2>
            <Field
              label="Product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Leather weekend bag"
            />
            <Field
              label="Price"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="189.99"
              hint="Numbers only, no currency symbol."
            />
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="field resize-y"
                placeholder="What it is, what it's made of, why it's worth having."
              />
            </div>
          </section>

          <section className="rounded-3xl bg-paper p-6 ring-1 ring-line sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold">Images</h2>
              <p className="text-xs text-ink-soft">
                {validImages.length} of {MAX_PRODUCT_IMAGES} · first is the cover
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
              {images.map((img, i) => (
                <ImageSlot key={i} index={i} value={img} onChange={(v) => setImage(i, v)} />
              ))}
            </div>
          </section>

          {error && (
            <div role="alert" className="alert-error">
              <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="btn-primary h-12 px-8 disabled:opacity-70">
              {saving && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />}
              {saving ? "Saving…" : editing ? "Save changes" : "Save product"}
            </button>
            <Link href="/admin" className="btn-secondary h-12 px-6">
              {editing ? "Back to products" : "Cancel"}
            </Link>
          </div>
        </form>

        <aside aria-label="Live preview" className="lg:sticky lg:top-10 lg:self-start">
          <p className="mb-3 text-sm font-medium text-ink-soft">Live preview</p>
          <div className="rounded-3xl bg-paper p-4 ring-1 ring-line">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-well">
              <AnimatePresence mode="wait">
                {validImages[0] ? (
                  <motion.img
                    key={validImages[0]}
                    src={validImages[0]}
                    alt=""
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-ink-mute"
                  >
                    <ImagePlus className="h-8 w-8" aria-hidden />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4 px-1">
              <p className="text-[15px] font-medium leading-snug">{title.trim() || "Product title"}</p>
              <p className="price whitespace-nowrap text-[15px] font-semibold">
                {Number.isFinite(numericPrice) ? formatPrice(numericPrice) : formatPrice(0)}
              </p>
            </div>
            <p className="mt-1 line-clamp-2 px-1 pb-1 text-sm text-ink-soft">
              {description.trim() || "Your description appears here."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
