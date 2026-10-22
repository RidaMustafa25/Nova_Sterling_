import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FaqList from "@/components/FaqList";
import Reveal from "@/components/Reveal";
import { getPublicContent } from "@/lib/content/store";

export async function generateMetadata(): Promise<Metadata> {
  const { faq } = await getPublicContent();
  return { title: "FAQ", description: faq.intro };
}

export default async function FaqPage() {
  const { faq } = await getPublicContent();

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="display text-5xl sm:text-7xl">{faq.heading}</h1>
        <p className="mt-5 max-w-[52ch] whitespace-pre-line text-lg text-ink-soft">{faq.intro}</p>
      </Reveal>

      <div className="mt-14 space-y-6">
        {faq.groups.map((group, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <section className="grid gap-4 rounded-[28px] bg-paper px-6 py-4 ring-1 ring-line sm:px-10 sm:py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
              <h2 className="pt-5 text-xl font-semibold tracking-tight lg:pt-6">{group.title}</h2>
              <FaqList items={group.items} />
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-ink p-8 text-paper sm:flex-row sm:items-center sm:p-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{faq.ctaHeading}</h2>
          <p className="mt-2 text-white/70">{faq.ctaBody}</p>
        </div>
        <Link href="/contact" className="btn-secondary h-12 border-transparent px-7">
          Contact us <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </Reveal>
    </div>
  );
}
