import type { Metadata } from "next";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";

export const metadata: Metadata = { title: "Preview: Perspective tunnel hero" };

// The hero is full-viewport (100svh × 100vw), so it is shown full-bleed rather than in a card.
export default function PerspectiveTunnelPreview() {
  return (
    <main className="overflow-x-hidden">
      <PerspectiveTunnelHero />
    </main>
  );
}
