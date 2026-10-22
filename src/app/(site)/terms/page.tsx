import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";
import { getPublicContent } from "@/lib/content/store";

export async function generateMetadata(): Promise<Metadata> {
  const { business } = await getPublicContent();
  return {
    title: "Terms of Service",
    description: `The terms that apply when you use the ${business.name} website and buy from us.`,
  };
}

export default async function TermsPage() {
  const { legal } = await getPublicContent();
  return <PolicyLayout title="Terms of Service" updated={legal.updated} body={legal.terms} />;
}
