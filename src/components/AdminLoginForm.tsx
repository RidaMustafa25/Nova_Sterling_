"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { isValidEmail } from "@/lib/validation";
import Field from "./Field";

interface Errors {
  email?: string;
  password?: string;
}

export default function AdminLoginForm({ next }: { next: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const found: Errors = {};
    if (!email.trim()) found.email = "Please enter your admin email.";
    else if (!isValidEmail(email)) found.email = "Please enter a valid email address.";
    if (!password) found.password = "Please enter your password.";
    return found;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFormError(data.error || "Login failed. Please try again.");
        setSubmitting(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setFormError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && (
        <div
          role="alert"
          className="alert-error"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
          <p>{formError}</p>
        </div>
      )}

      <Field
        label="Admin email"
        type="email"
        name="email"
        autoComplete="username"
        placeholder="admin@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Field
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary h-12 w-full"
      >
        {submitting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />}
        {submitting ? "Signing in..." : "Sign in as admin"}
      </button>
    </form>
  );
}
