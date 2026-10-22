import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { getPublicContent } from '@/lib/content/store';

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getPublicContent();
  return { title: about.heading };
}

export default async function AboutPage() {
  const { about } = await getPublicContent();

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="display max-w-4xl text-[clamp(2.75rem,8vw,5.5rem)]">{about.heading}</h1>
        <p className="mt-8 max-w-[56ch] whitespace-pre-line text-xl leading-relaxed text-ink-soft sm:text-2xl">
          {about.intro}
        </p>
      </Reveal>

      {about.image.src && (
        <Reveal delay={0.1} className="relative mt-16 aspect-[16/9] overflow-hidden rounded-[32px] bg-well">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={about.image.src}
            alt={about.image.alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </Reveal>
      )}

      {about.principles.length > 0 && (
        <dl className="mt-16 grid gap-6 md:grid-cols-2">
          {about.principles.map((p, i) => (
            <Reveal key={i} delay={(i % 2) * 0.08} className="rounded-[28px] bg-paper p-8 ring-1 ring-line sm:p-10">
              <dt className="text-xl font-semibold">{p.title}</dt>
              <dd className="mt-3 max-w-[46ch] whitespace-pre-line text-lg leading-relaxed text-ink-soft">{p.body}</dd>
            </Reveal>
          ))}
        </dl>
      )}

      <Reveal className="mt-12">
        <Link href="/catalog" className="btn-primary h-12 px-7">
          Browse the shop <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Reveal>
    </div>
  );
}
