'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CatalogBrowser from '@/components/CatalogBrowser';
import Reveal from '@/components/Reveal';
import { useStoreProducts } from '@/lib/storeProducts';
import { useSiteContent } from '@/context/SiteContentContext';

function Catalog() {
  const { products } = useStoreProducts();
  // /catalog?q=leather opens the shop already searched (used by the homepage category tiles).
  const initialQuery = useSearchParams().get('q') ?? '';

  return <CatalogBrowser key={initialQuery} products={products} initialQuery={initialQuery} />;
}

export default function CatalogPage() {
  const { catalog } = useSiteContent();

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="display text-5xl sm:text-7xl">{catalog.heading}</h1>
        <p className="mt-5 max-w-[52ch] whitespace-pre-line text-lg text-ink-soft">{catalog.intro}</p>
      </Reveal>
      <div className="mt-12">
        <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
          <Catalog />
        </Suspense>
      </div>
    </div>
  );
}
