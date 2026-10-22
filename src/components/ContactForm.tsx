"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck, Send } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { isValidEmail } from "@/lib/validation";
import Field from "./Field";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * This form opens the visitor's email app with the message pre-filled (mailto:), so it
 * works without a server. To receive messages directly on the site, swap `handleSubmit`
 * for a POST to a form service (Formspree, Resend, etc.).
 */
export default function ContactForm() {
  const { business } = useSiteContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!isValidEmail(email)) next.email = "Please enter a valid email address.";
    if (message.trim().length < 10) next.message = "Please write a message of at least 10 characters.";
    return next;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const body = `${message.trim()}\n\n--\n${name.trim()}\n${email.trim()}`;
    const href = `mailto:${business.email}?subject=${encodeURIComponent(
      subject.trim() || `Message from ${name.trim()}`,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-[28px] bg-paper p-8 ring-1 ring-line sm:p-10">
        <CircleCheck className="h-10 w-10 text-accent" aria-hidden />
        <h2 className="mt-5 text-2xl font-bold">Your email is ready to send</h2>
        <p className="mt-3 text-ink-soft">
          We opened your email app with your message filled in. Press send there to reach us. If nothing
          opened, email us directly at{" "}
          <a className="font-medium text-ink underline" href={`mailto:${business.email}`}>
            {business.email}
          </a>
          .
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn-secondary mt-7">
          Write another message
        </button>
      </div>
    );
  }

  const messageId = "contact-message";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-[28px] bg-paper p-6 ring-1 ring-line sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Field
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
      </div>
      <Field
        label="Subject (optional)"
        name="subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <div>
        <label htmlFor={messageId} className="mb-2 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          className="field resize-y"
          placeholder="How can we help? Include your order number if you have one."
        />
        {errors.message && (
          <p id={`${messageId}-error`} role="alert" className="mt-1.5 text-xs text-flag">
            {errors.message}
          </p>
        )}
      </div>

      <button type="submit" className="btn-primary h-12 px-7">
        <Send className="h-4 w-4" aria-hidden />
        Send message
      </button>
    </form>
  );
}
