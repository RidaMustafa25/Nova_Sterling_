import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublicContent } from "@/lib/content/store";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/catalog", label: "All products" },
      { href: "/login", label: "Login" },
      { href: "/register", label: "Create an account" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export default async function Footer() {
  const { business, footer } = await getPublicContent();
  const openHours = business.hours.find((h) => h.days.trim() && h.time.trim().toLowerCase() !== "closed");
  const address = business.address.filter((line) => line.trim()).join(", ");

  return (
    <footer className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="overflow-hidden rounded-[32px] bg-ink text-paper">
        <div className="mx-auto max-w-[1240px] px-6 pb-8 pt-16 sm:px-10 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
            <div>
              <p className="max-w-[24ch] text-2xl font-medium leading-snug tracking-tight">
                {footer.tagline}
              </p>
              <a
                href={`mailto:${business.email}`}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition hover:bg-well"
              >
                {business.email}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
              <p className="mt-6 text-sm text-white/60">
                {openHours && (
                  <>
                    {openHours.days}, {openHours.time}
                    <br />
                  </>
                )}
                {address}
              </p>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="text-sm font-medium text-white/60">{col.title}</h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-draw text-[15px] text-white/90 hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p aria-hidden className="mt-20 select-none whitespace-nowrap text-center font-display text-[clamp(2.5rem,12.5vw,11rem)] font-semibold leading-none tracking-[-0.06em] text-white/[0.08]">
            {business.shortName}
          </p>

          <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
            </p>
            {business.companyNumber.trim() && <p>Company no. {business.companyNumber}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
