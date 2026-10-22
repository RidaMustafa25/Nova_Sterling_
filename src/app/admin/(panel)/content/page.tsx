import type { Metadata } from "next";
import ContentEditor from "@/components/admin/ContentEditor";
import { getSiteContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Site content" };
export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  return <ContentEditor initial={await getSiteContent()} />;
}
