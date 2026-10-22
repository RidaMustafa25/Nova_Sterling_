import type { Metadata } from "next";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

export const metadata: Metadata = { title: "Preview: Tilted grid hero" };

const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop`;

const IMAGES = [
  { src: UNSPLASH("1523275335684-37898b6baf30"), alt: "Minimal silver wristwatch on a white background" },
  { src: UNSPLASH("1505740420928-5e560c06d30e"), alt: "Over-ear headphones on a yellow background" },
  { src: UNSPLASH("1526170375885-4d8ecf77b99f"), alt: "Vintage instant camera" },
  { src: UNSPLASH("1542291026-7eec264c27ff"), alt: "Red running shoe" },
  { src: UNSPLASH("1572635196237-14b3f281503f"), alt: "Sunglasses on a pastel background" },
  { src: UNSPLASH("1585386959984-a4155224a1ad"), alt: "Glass perfume bottle" },
  { src: UNSPLASH("1553062407-98eeb64c6a62"), alt: "Leather backpack" },
  { src: UNSPLASH("1546868871-7041f2a55e12"), alt: "Smartwatch on a dark background" },
  { src: UNSPLASH("1491553895911-0055eca6402d"), alt: "Pair of sneakers" },
  { src: UNSPLASH("1522335789203-aabd1fc54bc9"), alt: "Cosmetics flat lay" },
];

export default function TiltedGridHeroPreview() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-8">
      <TiltedGridHero
        images={IMAGES}
        className="h-[560px] w-full max-w-6xl rounded-lg border border-border bg-background"
      >
        <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center">
          <div className="px-6">
            <h1 className="text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              Every frame,
              <br />
              brought into focus.
            </h1>
          </div>
          <p className="max-w-md text-balance px-6 text-sm text-muted-foreground">
            Images curve in from one edge, flatten out at the centre, then fade
            away round the other.
          </p>
        </div>
      </TiltedGridHero>
    </main>
  );
}
