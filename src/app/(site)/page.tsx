'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mail, RotateCcw, Truck } from 'lucide-react';
import PerspectiveTunnelHero from '@/components/ui/perspective-tunnel-hero';
import ProductCard from '@/components/ProductCard';
import FaqList from '@/components/FaqList';
import Reveal from '@/components/Reveal';
import { useStoreProducts } from '@/lib/storeProducts';
import { useSiteContent } from '@/context/SiteContentContext';
import type { ImageRef } from '@/lib/content/schema';

// Icons for the three service cards, in order.
const SERVICE_ICONS = [Truck, RotateCcw, Mail];

function Ticker({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {words.map((word, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="display whitespace-nowrap text-5xl sm:text-7xl">{word}</span>
          <span className="h-3 w-3 rounded-full bg-accent" />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden className="overflow-hidden py-16 sm:py-24 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 38, ease: 'linear', repeat: Infinity }}
      >
        {row}
        {row}
      </motion.div>
    </div>
  );
}

function EditorialImage({ image }: { image: ImageRef }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-well lg:aspect-auto lg:h-full lg:min-h-[640px]">
      <motion.img
        src={image.src}
        alt={image.alt}
        style={reduce ? undefined : { scale, y }}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export default function HomePage() {
  const { products } = useStoreProducts();
  const { home, faq } = useSiteContent();
  // FAQ preview: the first answer from each group.
  const faqPreview = faq.groups.map((group) => group.items[0]).filter(Boolean);
  const titleLines = home.heroTitle.split('\n');

  return (
    <>
      {/* Full-height hero that runs up behind the floating navigation pill. */}
      <PerspectiveTunnelHero
        images={home.heroImages.filter((image) => image.src)}
        title={titleLines.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
        subtitle={home.heroSubtitle}
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="#new" className="btn-primary h-12 px-7">
              {home.heroPrimaryLabel} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/about" className="btn-secondary h-12 px-7">
              {home.heroSecondaryLabel}
            </Link>
          </div>
        }
        className="-mt-[84px] h-[100svh] min-h-[640px]"
      />

      <section id="new" className="scroll-mt-24">
        <div className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="display text-4xl sm:text-6xl">{home.newArrivalsHeading}</h2>
            <Link href="/catalog" className="group inline-flex items-center gap-2 text-sm font-semibold">
              <span className="link-draw">View all</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {products.slice(0, 8).map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 0.08}>
                <ProductCard product={product} priority={i < 4} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="mx-auto max-w-[1240px] px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <Reveal>
          <h2 id="categories-heading" className="display text-4xl sm:text-6xl">
            {home.categoriesHeading}
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {home.categories.map((c, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Link
                href={`/catalog?q=${encodeURIComponent(c.query)}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[28px] bg-well"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 sm:inset-x-5 sm:bottom-5">
                  <span className="text-lg font-semibold text-white sm:text-xl">{c.label}</span>
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur transition-all duration-500 group-hover:-rotate-45 group-hover:bg-white">
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <EditorialImage image={home.editorialImage} />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-between rounded-[32px] bg-paper p-8 ring-1 ring-line sm:p-12 lg:p-16">
            <h2 className="display max-w-[14ch] text-4xl sm:text-6xl">{home.editorialHeading}</h2>
            <div className="mt-10">
              <p className="max-w-[46ch] whitespace-pre-line text-lg leading-relaxed text-ink-soft">
                {home.editorialBody}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/catalog" className="btn-primary h-12 px-7">
                  Browse the shop <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/about" className="btn-secondary h-12 px-7">
                  About us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {home.ticker.length > 0 && <Ticker words={home.ticker} />}

      <section aria-labelledby="faq-heading" className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[32px] bg-paper p-6 ring-1 ring-line sm:p-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:p-16">
          <Reveal>
            <h2 id="faq-heading" className="display max-w-[12ch] text-4xl sm:text-6xl">
              {home.faqHeading}
            </h2>
            <p className="mt-5 max-w-[36ch] text-ink-soft">
              {home.faqIntro}
            </p>
            <Link href="/faq" className="btn-secondary mt-8 h-12 px-7">
              All questions <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <FaqList items={faqPreview} defaultOpen={0} />
          </Reveal>
        </div>
      </section>

      <section aria-label="Delivery, returns and support" className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <Reveal className="grid divide-y divide-line rounded-[32px] bg-paper ring-1 ring-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {home.service.map(({ title, body }, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <div key={i} className="p-8 sm:p-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
              </div>
            );
          })}
        </Reveal>
        <p className="mt-6 text-center text-sm text-ink-soft">
          Full details in our{' '}
          <Link href="/terms" className="font-medium text-ink underline">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </>
  );
}
