"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: { id: string; title: string; price: number; image: string };
  variant?: "full" | "compact";
}

const swap = {
  initial: { y: 14, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -14, opacity: 0 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
} as const;

export default function AddToCartButton({ product, variant = "full" }: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleAdd() {
    addItem(product, variant === "full" ? qty : 1);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
    if (variant === "full") openCart();
  }

  if (variant === "compact") {
    // Phones: a round + button. Wide screens: a full-width pill that slides up over the photo.
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.title} to cart`}
        className="flex h-11 w-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-paper/90 text-sm font-semibold text-ink shadow-[0_8px_24px_-12px_rgba(17,17,17,0.45)] backdrop-blur-md transition-colors hover:bg-ink hover:text-paper lg:w-full"
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span key="added" {...swap} className="flex items-center gap-2">
              <Check className="h-4 w-4" aria-hidden />
              <span className="hidden lg:inline">Added</span>
            </motion.span>
          ) : (
            <motion.span key="add" {...swap} className="flex items-center gap-2">
              <Plus className="h-4 w-4" aria-hidden />
              <span className="hidden lg:inline">Add to cart</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <div
        className="inline-flex h-[52px] items-center rounded-full border border-line bg-paper"
        role="group"
        aria-label="Quantity"
      >
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
          className="flex h-full w-12 items-center justify-center rounded-l-full text-ink-soft transition hover:text-ink disabled:opacity-30"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <span className="price w-6 text-center text-sm font-semibold" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Increase quantity"
          className="flex h-full w-12 items-center justify-center rounded-r-full text-ink-soft transition hover:text-ink"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <button type="button" onClick={handleAdd} className="btn-primary h-[52px] flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span key="added" {...swap} className="flex items-center gap-2">
              <Check className="h-4 w-4" aria-hidden /> Added to cart
            </motion.span>
          ) : (
            <motion.span key="add" {...swap}>
              Add to cart
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
