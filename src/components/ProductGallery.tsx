"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "./ProductImage";

/** Main image with a crossfade between views, plus thumbnails. */
export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const current = Math.min(active, count - 1);

  const go = (delta: number) => setActive((current + delta + count) % count);

  return (
    <div className="space-y-3">
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[28px] bg-well">
        <AnimatePresence initial={false}>
          <motion.div
            key={images[current]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductImage
              src={images[current]}
              alt={count > 1 ? `${title}, view ${current + 1} of ${count}` : title}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous view"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur transition hover:scale-105 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next view"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur transition hover:scale-105 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="grid grid-cols-5 gap-3" aria-label="Other views">
          {images.map((src, i) => (
            <li key={`${src}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show view ${i + 1}`}
                aria-current={i === current}
                className={`relative block aspect-square w-full overflow-hidden rounded-2xl bg-well transition ${
                  i === current ? "ring-2 ring-ink ring-offset-2 ring-offset-canvas" : "opacity-60 hover:opacity-100"
                }`}
              >
                <ProductImage src={src} alt="" sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
