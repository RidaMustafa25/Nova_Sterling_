import type { Metadata } from "next";
import PolicyLayout from "@/components/PolicyLayout";
import { getPublicContent } from "@/lib/content/store";

export async function generateMetadata(): Promise<Metadata> {
  const { business } = await getPublicContent();
  return {
    title: "Privacy Policy",
    description: `How ${business.name} collects, uses and protects your personal information.`,
  };
}

export default async function PrivacyPage() {
  const { legal } = await getPublicContent();
  return <PolicyLayout title="Privacy Policy" updated={legal.updated} body={legal.privacy} />;
}
