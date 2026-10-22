import './globals.css';
import { Archivo } from 'next/font/google';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { getPublicContent } from '@/lib/content/store';

// Archivo: one workhorse family for display and text.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, business } = await getPublicContent();
  // Page titles read "Page | Business name"; the homepage uses the full SEO title.
  return {
    title: { default: seo.title, template: `%s | ${business.name}` },
    description: seo.description,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
