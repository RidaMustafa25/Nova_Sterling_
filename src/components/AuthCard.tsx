import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  image?: { src: string; alt: string };
}

const DEFAULT_IMAGE = {
  src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&auto=format&fit=crop",
  alt: "A minimal silver wristwatch on a pale background",
};

/** Sign-in style pages: a product photo panel beside a clean form card. */
export default function AuthCard({ title, subtitle, children, footer, image = DEFAULT_IMAGE }: AuthCardProps) {
  return (
    <div className="flex-1 px-4 pb-16 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-6 lg:min-h-[calc(100vh-9rem)] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden rounded-[32px] bg-well lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center rounded-[32px] bg-paper p-6 ring-1 ring-line sm:p-12 lg:p-16">
          <div className="mx-auto w-full max-w-md">
            <h1 className="display text-4xl sm:text-5xl">{title}</h1>
            <p className="mt-3 text-ink-soft">{subtitle}</p>
            <div className="mt-10">{children}</div>
            <div className="mt-8 text-sm text-ink-soft">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
