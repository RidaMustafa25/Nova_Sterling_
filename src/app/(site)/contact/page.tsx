import type { Metadata } from 'next';
import { Clock, Mail, MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import { getPublicContent } from '@/lib/content/store';

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getPublicContent();
  return { title: contact.heading };
}

export default async function ContactPage() {
  const { contact, business } = await getPublicContent();

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="display text-5xl sm:text-7xl">{contact.heading}</h1>
        <p className="mt-5 max-w-[48ch] whitespace-pre-line text-lg text-ink-soft">{contact.intro}</p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Reveal className="rounded-[28px] bg-paper p-8 ring-1 ring-line">
          <dl className="space-y-8">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                <Mail className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <dt className="text-sm font-semibold">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${business.email}`} className="link-draw text-ink-soft hover:text-ink">
                    {business.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                <Clock className="h-4 w-4" aria-hidden />
              </span>
              <div className="flex-1">
                <dt className="text-sm font-semibold">Hours</dt>
                <dd className="mt-1">
                  <ul className="space-y-1 text-sm text-ink-soft">
                    {business.hours.map((h, i) => (
                      <li key={i} className="flex justify-between gap-6">
                        <span>{h.days}</span>
                        <span className="price text-ink">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                <MapPin className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <dt className="text-sm font-semibold">Address</dt>
                <dd className="mt-1 text-sm text-ink-soft">
                  {business.address.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
