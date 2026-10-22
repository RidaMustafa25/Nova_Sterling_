import type { Metadata } from "next";
import ProductEditor from "@/components/admin/ProductEditor";

export const metadata: Metadata = { title: "Add product" };

export default function NewProductPage() {
  return <ProductEditor />;
}
