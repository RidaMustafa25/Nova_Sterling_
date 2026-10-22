import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getPublicContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Only send the admin back to an admin page after login.
  const target = next && next.startsWith("/admin") && next !== "/admin/login" ? next : "/admin";
  const { business, auth } = await getPublicContent();

  return (
    <AuthCard
      title="Admin sign in"
      subtitle={`Restricted area for ${business.shortName} administrators.`}
      image={auth.image}
      footer={
        <>
          Not an administrator?{" "}
          <Link href="/login" className="font-semibold text-ink link-draw">
            Customer login
          </Link>
        </>
      }
    >
      <AdminLoginForm next={target} />
    </AuthCard>
  );
}
