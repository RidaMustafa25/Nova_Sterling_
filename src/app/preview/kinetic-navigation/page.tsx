import type { Metadata } from "next";
import { Component as KineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";

export const metadata: Metadata = { title: "Preview: Kinetic navigation" };

export default function KineticNavigationPreview() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <KineticNavigation />
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 text-neutral-800">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Kinetic navigation</h1>
        <p className="mt-4 max-w-prose text-neutral-600">
          Press <strong>Menu</strong> (top right) to open the panel. Hover a link to reveal its
          background shape. Close with the button, the dimmed overlay, or the Escape key.
        </p>
      </section>
    </main>
  );
}
