import type { Metadata } from "next";
import Link from "next/link";
import ProductEditor from "@/components/admin/ProductEditor";
import { getProducts } from "@/lib/content/store";

export const metadata: Metadata = { title: "Edit product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = (await getProducts()).find((p) => p.id === id);

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl">
        <h1 className="display text-4xl sm:text-5xl">Product not found</h1>
        <p className="mt-2 text-ink-soft">It may have been deleted.</p>
        <Link href="/admin" className="btn-secondary mt-6 h-11 px-5">
          Back to products
        </Link>
      </div>
    );
  }

  // Keyed so the form resets if the admin goes from one product to another.
  return <ProductEditor key={product.id} product={product} />;
}
