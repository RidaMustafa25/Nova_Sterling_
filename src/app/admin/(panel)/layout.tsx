"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, FileText, LayoutGrid, PackagePlus } from "lucide-react";
import AdminLogoutButton from "@/components/AdminLogoutButton";

const NAV = [
  { href: "/admin", label: "Products", icon: LayoutGrid },
  { href: "/admin/products/new", label: "Add product", icon: PackagePlus },
  { href: "/admin/content", label: "Site content", icon: FileText },
];

function isActive(href: string, pathname: string) {
  if (href === "/admin") {
    // Editing a product counts as being in Products.
    return pathname === "/admin" || (pathname.startsWith("/admin/products/") && pathname !== "/admin/products/new");
  }
  return pathname.startsWith(href);
}

// Access is checked on the server by src/middleware.ts (admin session cookie).
export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex-none border-line lg:sticky lg:top-0 lg:h-screen lg:w-[260px] lg:border-r">
        <div className="flex h-full flex-col gap-2 p-3 lg:p-5">
          <div className="flex items-center justify-between px-2 py-2 lg:block lg:py-3">
            <Link href="/admin" className="display text-lg tracking-[-0.03em]">
              NOVA STERLING
            </Link>
            <p className="hidden text-xs text-ink-soft lg:mt-1 lg:block">Store admin</p>
            <div className="lg:hidden">
              <AdminLogoutButton />
            </div>
          </div>

          <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:mt-6 lg:flex-col">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(href, pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-11 flex-none items-center gap-3 rounded-full px-4 text-sm font-medium transition-colors ${
                    active ? "text-paper" : "text-ink-soft hover:bg-well hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-nav-active"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" aria-hidden />
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex h-11 flex-none items-center gap-3 rounded-full px-4 text-sm font-medium text-ink-soft transition-colors hover:bg-well hover:text-ink"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              View store
            </a>
          </nav>

          <div className="mt-auto hidden rounded-3xl bg-paper p-4 ring-1 ring-line lg:block">
            <p className="text-sm font-medium">Signed in as admin</p>
            <p className="mt-1 text-xs text-ink-soft">Your session lasts 8 hours.</p>
            <div className="mt-4">
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 pb-16 pt-4 sm:px-6 lg:px-10 lg:pt-10">{children}</main>
    </div>
  );
}
