"use client";

import { useId, useRef, useState, type DragEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, ImagePlus, Link as LinkIcon, LoaderCircle, Plus, Trash2, Upload, X } from "lucide-react";
import { uploadImage } from "@/lib/adminApi";

// Form building blocks for the admin editors.

export function Panel({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-paper p-6 ring-1 ring-line sm:p-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  placeholder?: string;
  /** Number of visible lines; above 1 renders a textarea. */
  rows?: number;
  mono?: boolean;
}

export function TextField({ label, value, onChange, hint, placeholder, rows = 1, mono = false }: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const common = {
    id,
    value,
    placeholder,
    "aria-describedby": hint ? hintId : undefined,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {rows > 1 ? (
        <textarea
          {...common}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className={`field resize-y leading-relaxed ${mono ? "font-mono text-[13px]" : ""}`}
        />
      ) : (
        <input {...common} type="text" onChange={(e) => onChange(e.target.value)} className="field" />
      )}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Lines of text edited as one textarea, one item per line (addresses, ticker words). */
export function LinesField({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: ReactNode }) {
  return (
    <TextField
      label={label}
      value={value.join("\n")}
      onChange={(text) => onChange(text.split("\n"))}
      rows={Math.max(3, value.length + 1)}
      hint={hint}
    />
  );
}

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  alt?: string;
  onAltChange?: (value: string) => void;
  /** Aspect of the preview box, as a Tailwind class. */
  aspect?: string;
}

export function ImageField({ label, value, onChange, alt, onAltChange, aspect = "aspect-[4/3]" }: ImageFieldProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function take(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
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

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setOver(false);
    take(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
          className={`relative ${aspect} overflow-hidden rounded-2xl transition-all duration-300 ${
            over ? "scale-[1.02] bg-well ring-2 ring-ink" : value ? "bg-well" : "border border-dashed border-line bg-canvas"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-ink-mute">
              <ImagePlus className="h-5 w-5" aria-hidden />
              <span className="mt-1.5 text-[11px]">Drop an image</span>
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/70 backdrop-blur-sm">
              <LoaderCircle className="h-5 w-5 animate-spin text-ink" aria-label="Uploading" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-mute" aria-hidden />
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste an image link"
                aria-label={`${label} link`}
                className="field h-11 pl-9 text-sm"
              />
            </div>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label={`Clear ${label.toLowerCase()}`}
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-ink-soft transition hover:bg-well hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="btn-secondary h-10 px-4 text-sm">
            <Upload className="h-4 w-4" aria-hidden /> {busy ? "Uploading…" : "Upload from computer"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="sr-only"
            tabIndex={-1}
            aria-label={`Upload ${label.toLowerCase()}`}
            onChange={(e) => {
              take(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {onAltChange && (
            <TextField
              label="Image description"
              value={alt ?? ""}
              onChange={onAltChange}
              hint="Read aloud by screen readers. Describe what's in the picture."
            />
          )}
          {error && (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  render: (item: T, update: (item: T) => void, index: number) => ReactNode;
  /** Name for one item, e.g. "Question". */
  noun: string;
  max?: number;
}

/** A list the admin can add to, remove from and reorder. */
export function ListEditor<T>({ items, onChange, newItem, render, noun, max }: ListEditorProps<T>) {
  // Stable keys so items keep their state (and animate) when moved.
  const keys = useRef<number[]>([]);
  const counter = useRef(0);
  while (keys.current.length < items.length) keys.current.push(counter.current++);
  keys.current.length = items.length;

  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    const k = [...keys.current];
    const [key] = k.splice(from, 1);
    k.splice(to, 0, key);
    keys.current = k;
    onChange(next);
  };

  const remove = (index: number) => {
    keys.current = keys.current.filter((_, i) => i !== index);
    onChange(items.filter((_, i) => i !== index));
  };

  const iconButton =
    "flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition hover:bg-well hover:text-ink disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={keys.current[i]}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="rounded-2xl bg-canvas p-4 ring-1 ring-line sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-mute">
                {noun} {i + 1}
              </p>
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${noun.toLowerCase()} ${i + 1} up`} className={iconButton}>
                  <ArrowUp className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === items.length - 1}
                  aria-label={`Move ${noun.toLowerCase()} ${i + 1} down`}
                  className={iconButton}
                >
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label={`Remove ${noun.toLowerCase()} ${i + 1}`}
                  className={`${iconButton} hover:!bg-danger-soft hover:!text-danger`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
            <div className="space-y-4">{render(item, (value) => onChange(items.map((it, j) => (j === i ? value : it))), i)}</div>
          </motion.div>
        ))}
      </AnimatePresence>
      {(max === undefined || items.length < max) && (
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-sm font-semibold text-ink-soft transition hover:border-ink-mute hover:bg-well hover:text-ink"
        >
          <Plus className="h-4 w-4" aria-hidden /> Add {noun.toLowerCase()}
        </button>
      )}
    </div>
  );
}
