"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail } from "@/lib/validation";
import Field from "./Field";

interface Errors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { login, user, ready } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Go straight to the account page.
  useEffect(() => {
    if (ready && user) router.replace("/account");
  }, [ready, user, router]);

  function validate(): Errors {
    const next: Errors = {};
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!isValidEmail(email)) next.email = "Please enter a valid email address.";
    if (!password) next.password = "Please enter your password.";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    router.push("/account");
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
        label="Email address"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Field
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Your password"
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
        {submitting ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
