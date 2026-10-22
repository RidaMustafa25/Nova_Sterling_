import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import LoginForm from "@/components/LoginForm";
import { getPublicContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  const { auth } = await getPublicContent();

  return (
    <AuthCard
      title={auth.loginHeading}
      subtitle={auth.loginIntro}
      image={auth.image}
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-ink link-draw">
            Create an account
          </Link>
          <span className="mt-2 block">
            Administrator?{" "}
            <Link href="/admin/login" className="font-semibold text-ink link-draw">
              Admin login
            </Link>
          </span>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
