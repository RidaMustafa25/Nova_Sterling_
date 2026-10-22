'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useAnimationControls } from 'framer-motion';
import { ShoppingBag, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSiteContent } from '@/context/SiteContentContext';
import {
  Component as KineticNavigation,
  type KineticNavLink,
} from '@/components/ui/sterling-gate-kinetic-navigation';

export default function Header() {
  const { user } = useAuth();
  const { totalItems, openCart } = useCart();
  const { business } = useSiteContent();

  // Bump the cart badge whenever the count goes up.
  const badge = useAnimationControls();
  const previous = useRef(totalItems);
  useEffect(() => {
    if (totalItems > previous.current) {
      badge.start({ scale: [1, 1.35, 1], transition: { duration: 0.45, ease: [0.34, 1.4, 0.64, 1] } });
    }
    previous.current = totalItems;
  }, [totalItems, badge]);

  const links: KineticNavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/catalog' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  // The fullscreen menu (phones) also carries the account link.
  const menuLinks: KineticNavLink[] = [
    ...links,
    user ? { label: 'My account', href: '/account' } : { label: 'Log in', href: '/login' },
  ];

  return (
    <>
      <KineticNavigation
        logo={<span className="display whitespace-nowrap text-[17px] tracking-[-0.03em]">{business.shortName}</span>}
        links={menuLinks}
        hideOnScroll
        toggleLabel=""
        actions={
          <>
            <Link
              href={user ? '/account' : '/login'}
              className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-well hover:text-ink sm:inline-flex"
            >
              <UserRound className="h-[18px] w-[18px]" aria-hidden />
              <span className="hidden xl:inline">{user ? user.name : 'Sign in'}</span>
              <span className="sr-only xl:hidden">{user ? 'My account' : 'Sign in'}</span>
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-10 items-center gap-2 rounded-full bg-well px-4 text-sm font-semibold text-ink transition-colors hover:bg-line"
              aria-label={totalItems > 0 ? `Open cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}` : 'Open cart'}
            >
              <ShoppingBag className="h-[18px] w-[18px]" aria-hidden />
              <motion.span animate={badge} className="price min-w-[1ch]">
                {totalItems}
              </motion.span>
            </button>
          </>
        }
      />
      {/* The navigation floats; this keeps page content clear of it. */}
      <div aria-hidden className="h-[84px] flex-none" />
    </>
  );
}
