import type { Metadata } from "next";
import ProductsOverview from "@/components/admin/ProductsOverview";
import { getProducts } from "@/lib/content/store";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  return <ProductsOverview initial={await getProducts()} />;
}
