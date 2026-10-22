'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronRight, RotateCcw, Truck } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';
import Reveal from '@/components/Reveal';
import { useStoreProducts } from '@/lib/storeProducts';
import { useSiteContent } from '@/context/SiteContentContext';
import { formatPrice } from '@/lib/format';

function Disclosure({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line py-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold">
        {title}
        <ChevronDown className="h-4 w-4 text-ink-soft transition-transform duration-300 group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pt-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, ready } = useStoreProducts();
  const { product: copy } = useSiteContent();
  const product = products.find((p) => p.id === id);

  if (!product) {
    // Products saved from the admin page only exist once browser storage has been read.
    if (!ready) return <div className="min-h-[70vh]" aria-busy="true" />;
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h1 className="display text-5xl sm:text-6xl">Product not found</h1>
        <p className="mt-5 max-w-[46ch] text-lg text-ink-soft">
          This product may have been removed, or the link is incomplete. Everything currently in the store is in
          the shop.
        </p>
        <Link href="/catalog" className="btn-primary mt-8 h-12 px-7">
          Browse the shop <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    );
  }

  const cover = product.images[0] ?? '';
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-soft">
        <Link href="/catalog" className="link-draw hover:text-ink">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="truncate text-ink">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <ProductGallery images={product.images} title={product.title} />
        </Reveal>

        <Reveal delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="display text-4xl sm:text-5xl">{product.title}</h1>
          <p className="price mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>
          <p className="mt-6 max-w-[56ch] whitespace-pre-line text-base leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton product={{ id: product.id, title: product.title, price: product.price, image: cover }} />
          </div>

          <ul className="mt-6 space-y-3 text-sm text-ink-soft">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-accent" aria-hidden /> {copy.stockLine}
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-accent" aria-hidden /> {copy.returnsLine}
            </li>
          </ul>

          <div className="mt-8 border-t border-line">
            <Disclosure title="Delivery">
              <span className="whitespace-pre-line">{copy.deliveryText}</span>
            </Disclosure>
            <Disclosure title="Returns">
              <span className="whitespace-pre-line">{copy.returnsText}</span>{' '}
              <Link href="/terms" className="font-medium text-ink underline">
                Read the terms
              </Link>
            </Disclosure>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="display text-3xl sm:text-5xl">{copy.relatedHeading}</h2>
            <Link href="/catalog" className="group inline-flex items-center gap-2 text-sm font-semibold">
              <span className="link-draw">View all</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
