"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, setQuantity, subtotal, totalItems } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // Escape to close, lock page scroll while open, move focus into the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110]">
          <motion.div
            onClick={closeCart}
            className="absolute inset-0 bg-ink/25 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute bottom-2 right-2 top-2 flex w-[calc(100%-16px)] max-w-[440px] flex-col overflow-hidden rounded-[28px] bg-paper shadow-[0_30px_80px_-20px_rgba(17,17,17,0.35)]"
            initial={reduce ? { opacity: 0 } : { x: "105%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "105%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Your cart{" "}
                <span className="price ml-1 rounded-full bg-well px-2.5 py-0.5 align-middle text-sm font-medium text-ink-soft">
                  {totalItems}
                </span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-well text-ink transition hover:rotate-90 hover:bg-line"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-well">
                  <ShoppingBag className="h-7 w-7 text-ink-soft" aria-hidden />
                </span>
                <p className="mt-5 text-lg font-semibold">Your cart is empty</p>
                <p className="mt-1 text-sm text-ink-soft">Add something you love from the shop.</p>
                <Link href="/catalog" onClick={closeCart} className="btn-primary mt-7 h-12 px-7">
                  Start shopping <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-4">
                  <AnimatePresence initial={false}>
                    {items.map((item, i) => (
                      <motion.li
                        key={item.id}
                        layout={!reduce}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.05, duration: 0.4 } }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                        className="flex gap-4 rounded-2xl p-2 transition-colors hover:bg-canvas"
                      >
                        <Link
                          href={`/product/${item.id}`}
                          onClick={closeCart}
                          className="relative h-24 w-20 flex-none overflow-hidden rounded-xl bg-well"
                        >
                          <ProductImage src={item.image} alt={item.title} sizes="80px" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col py-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.id}`}
                              onClick={closeCart}
                              className="line-clamp-2 text-sm font-medium leading-snug hover:underline"
                            >
                              {item.title}
                            </Link>
                            <p className="price whitespace-nowrap text-sm font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="inline-flex h-9 items-center rounded-full border border-line">
                              <button
                                type="button"
                                onClick={() => setQuantity(item.id, item.quantity - 1)}
                                aria-label={`Decrease quantity of ${item.title}`}
                                className="flex h-full w-9 items-center justify-center text-ink-soft transition hover:text-ink"
                              >
                                <Minus className="h-3.5 w-3.5" aria-hidden />
                              </button>
                              <span className="price w-5 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => setQuantity(item.id, item.quantity + 1)}
                                aria-label={`Increase quantity of ${item.title}`}
                                className="flex h-full w-9 items-center justify-center text-ink-soft transition hover:text-ink"
                              >
                                <Plus className="h-3.5 w-3.5" aria-hidden />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-xs font-medium text-ink-soft underline-offset-4 transition hover:text-danger hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="m-2 rounded-[22px] bg-canvas p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-ink-soft">Subtotal</span>
                    <span className="price text-xl font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">Shipping and taxes are calculated at checkout.</p>
                  <Link href="/checkout" onClick={closeCart} className="btn-primary mt-5 h-12 w-full">
                    Checkout <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-2 block w-full py-2 text-center text-sm font-medium text-ink-soft transition hover:text-ink"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
