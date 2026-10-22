'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, LogOut, Package, Settings } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function AccountPage() {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  // Set while signing out, so the "not signed in, go to login" redirect below doesn't hijack the trip home.
  const signingOut = useRef(false);

  useEffect(() => {
    if (ready && !user && !signingOut.current) {
      router.replace('/login');
    }
  }, [user, ready, router]);

  if (!ready || !user) {
    return <div className="min-h-[70vh]" aria-busy="true" />;
  }

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-ink text-2xl font-semibold text-paper">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </span>
          <div>
            <h1 className="display text-4xl sm:text-5xl">Hello, {user.name}</h1>
            <p className="mt-2 text-ink-soft">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            signingOut.current = true;
            logout();
            router.push('/');
          }}
          className="btn-secondary self-start sm:self-auto"
        >
          <LogOut className="h-4 w-4" aria-hidden /> Sign out
        </button>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Reveal className="rounded-[28px] bg-paper p-8 ring-1 ring-line">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Package className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="mt-6 text-lg font-semibold">Orders</h2>
          <p className="mt-2 text-ink-soft">You haven&apos;t placed any orders yet.</p>
          <Link href="/catalog" className="btn-primary mt-6">
            Start shopping <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>

        <Reveal delay={0.08} className="rounded-[28px] bg-paper p-8 ring-1 ring-line">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-well text-ink">
            <Settings className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="mt-6 text-lg font-semibold">Account settings</h2>
          <p className="mt-2 text-ink-soft">
            Need to change your name, email or shipping details? Send us a message and we&apos;ll update them for you.
          </p>
          <Link href="/contact" className="btn-secondary mt-6">
            Contact us <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
