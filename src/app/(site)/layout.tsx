import type { ReactNode } from "react";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { getProducts, getPublicContent } from "@/lib/content/store";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [content, products] = await Promise.all([getPublicContent(), getProducts()]);

  return (
    <SiteContentProvider content={content} products={products}>
      <Providers>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <CartDrawer />
      </Providers>
    </SiteContentProvider>
  );
}
