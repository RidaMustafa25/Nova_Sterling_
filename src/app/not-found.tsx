import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-canvas px-6 py-20 text-center text-ink">
      <p className="display text-[clamp(6rem,24vw,12rem)] text-ink/10">404</p>
      <h1 className="display -mt-4 text-4xl sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-[40ch] text-lg text-ink-soft">We couldn&apos;t find the page you were looking for.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary h-12 px-7">
          Back to home
        </Link>
        <Link href="/catalog" className="btn-secondary h-12 px-7">
          Browse the shop
        </Link>
      </div>
    </main>
  );
}
