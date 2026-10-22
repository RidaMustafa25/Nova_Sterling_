"use client";

import Link from "next/link";
import { ArrowRight, Info, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import Reveal from "@/components/Reveal";

export default function CheckoutPage() {
  const { items, subtotal, totalItems, openCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h1 className="display text-5xl sm:text-6xl">Your cart is empty</h1>
        <p className="mt-5 max-w-[44ch] text-lg text-ink-soft">Add a few products, then come back here to check out.</p>
        <Link href="/catalog" className="btn-primary mt-8 h-12 px-7">
          Browse the shop <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="display text-5xl sm:text-7xl">Checkout</h1>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
        <Reveal>
          <section aria-labelledby="summary-heading" className="rounded-[28px] bg-paper p-6 ring-1 ring-line sm:p-8">
            <div className="flex items-baseline justify-between">
              <h2 id="summary-heading" className="text-lg font-semibold">
                Order summary
              </h2>
              <button type="button" onClick={openCart} className="link-draw text-sm font-medium text-ink-soft hover:text-ink">
                Edit cart
              </button>
            </div>
            <ul className="mt-4 divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-5 py-5">
                  <div className="relative h-24 w-20 flex-none overflow-hidden rounded-xl bg-well">
                    <ProductImage src={item.image} alt={item.title} sizes="80px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="price mt-1 text-sm text-ink-soft">
                      {item.quantity} &times; {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="price font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
          <aside aria-label="Payment" className="rounded-[28px] bg-paper p-6 ring-1 ring-line sm:p-8">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </dt>
                <dd className="price font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping and taxes</dt>
                <dd className="text-ink-soft">Calculated at payment</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <dt className="font-semibold">Total</dt>
                <dd className="price text-2xl font-semibold">{formatPrice(subtotal)}</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent-soft p-4 text-sm text-accent">
              <Info className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
              <p>
                Online payment is not connected yet. Connect a payment provider (for example Stripe Checkout or PayPal)
                to enable the order button below.
              </p>
            </div>

            <button type="button" disabled className="btn-primary mt-6 h-[52px] w-full">
              <Lock className="h-4 w-4" aria-hidden /> Place order
            </button>
            <p className="mt-3 text-center text-xs text-ink-soft">Ordering opens once payment is connected.</p>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
