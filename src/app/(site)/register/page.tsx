import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import RegisterForm from "@/components/RegisterForm";
import { getPublicContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  const { auth } = await getPublicContent();

  return (
    <AuthCard
      title={auth.registerHeading}
      subtitle={auth.registerIntro}
      image={auth.image}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-ink link-draw">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
