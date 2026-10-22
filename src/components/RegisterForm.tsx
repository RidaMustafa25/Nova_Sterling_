"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail, passwordProblem } from "@/lib/validation";
import Field from "./Field";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const { register, user, ready } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/account");
  }, [ready, user, router]);

  function validate(): Errors {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name.";
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!isValidEmail(email)) next.email = "Please enter a valid email address.";
    const pwProblem = passwordProblem(password);
    if (pwProblem) next.password = pwProblem;
    if (!confirm) next.confirm = "Please confirm your password.";
    else if (confirm !== password) next.confirm = "Passwords do not match.";
    if (!accepted) next.terms = "You must accept the Terms of Service and Privacy Policy.";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const result = await register({ name, email, password });
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
        label="Full name"
        name="name"
        autoComplete="name"
        placeholder="Jane Smith"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
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
        autoComplete="new-password"
        placeholder="At least 8 characters"
        hint="Use at least 8 characters, including a letter and a number."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Field
        label="Confirm password"
        type="password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Repeat your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      />

      <div>
        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            aria-invalid={errors.terms ? true : undefined}
            className="mt-0.5 h-4 w-4 accent-[#111111]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-ink underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-ink underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <p role="alert" className="mt-1.5 text-xs text-danger">
            {errors.terms}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary h-12 w-full"
      >
        {submitting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />}
        {submitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
