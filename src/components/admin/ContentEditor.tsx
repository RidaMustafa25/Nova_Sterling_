"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  FileText,
  Home,
  Info,
  LoaderCircle,
  LogIn,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { ImageField, LinesField, ListEditor, Panel, TextField } from "./EditorFields";
import type { SiteContent } from "@/lib/content/schema";
import { saveContent } from "@/lib/adminApi";

type Update<T> = (patch: Partial<T>) => void;

const SECTIONS = [
  { id: "business", label: "Business details", icon: Building2, href: "/contact" },
  { id: "home", label: "Homepage", icon: Home, href: "/" },
  { id: "shop", label: "Shop & product pages", icon: ShoppingBag, href: "/catalog" },
  { id: "about", label: "About", icon: Info, href: "/about" },
  { id: "contact", label: "Contact", icon: Mail, href: "/contact" },
  { id: "faq", label: "FAQ", icon: CircleHelp, href: "/faq" },
  { id: "account", label: "Footer & sign-in", icon: LogIn, href: "/login" },
  { id: "legal", label: "Terms & privacy", icon: FileText, href: "/terms" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

// Lines the admin left blank are dropped when saving.
function tidy(content: SiteContent): SiteContent {
  const lines = (list: string[]) => list.map((l) => l.trim()).filter(Boolean);
  return {
    ...content,
    business: { ...content.business, address: lines(content.business.address) },
    home: { ...content.home, ticker: lines(content.home.ticker) },
  };
}

export default function ContentEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [section, setSection] = useState<SectionId>("business");
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string }>({ kind: "idle" });

  const dirty = useMemo(() => JSON.stringify(content) !== saved, [content, saved]);

  // Open the section named in the address (#faq), and keep the address in step.
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (SECTIONS.some((s) => s.id === fromHash)) setSection(fromHash as SectionId);
  }, []);
  const open = (id: SectionId) => {
    setSection(id);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = useCallback(async () => {
    setStatus({ kind: "saving" });
    try {
      const stored = await saveContent(tidy(content));
      setContent(stored);
      setSaved(JSON.stringify(stored));
      setStatus({ kind: "saved" });
    } catch (e) {
      setStatus({ kind: "error", message: (e as Error).message });
    }
  }, [content]);

  // Ctrl/⌘+S saves; leaving with unsaved changes asks first.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && status.kind !== "saving") save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, save, status.kind]);

  useEffect(() => {
    if (status.kind !== "saved") return;
    const t = setTimeout(() => setStatus({ kind: "idle" }), 3500);
    return () => clearTimeout(t);
  }, [status.kind]);

  const update =
    <K extends keyof SiteContent>(key: K): Update<SiteContent[K]> =>
    (patch) =>
      setContent((c) => ({ ...c, [key]: { ...c[key], ...patch } }));

  const current = SECTIONS.find((s) => s.id === section)!;

  return (
    <div className="mx-auto max-w-6xl pb-28">
      <h1 className="display text-4xl sm:text-5xl">Site content</h1>
      <p className="mt-2 text-ink-soft">Every heading, paragraph, image and question on your store. Changes go live when you save.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Content sections" className="lg:sticky lg:top-10 lg:self-start">
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:px-0">
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const active = id === section;
              return (
                <li key={id} className="flex-none">
                  <button
                    type="button"
                    onClick={() => open(id)}
                    aria-current={active ? "true" : undefined}
                    className={`relative flex h-10 w-full items-center gap-2.5 whitespace-nowrap rounded-full px-4 text-left text-sm font-medium transition-colors ${
                      active ? "text-ink" : "text-ink-soft hover:bg-well hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="content-section-active"
                        className="absolute inset-0 rounded-full bg-paper shadow-sm ring-1 ring-line"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Icon className="relative h-4 w-4" aria-hidden />
                    <span className="relative">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">{current.label}</h2>
            <a
              href={current.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 flex-none items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink-soft transition hover:bg-well hover:text-ink"
            >
              View on site <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {section === "business" && <BusinessSection content={content} update={update} />}
              {section === "home" && <HomeSection home={content.home} update={update("home")} />}
              {section === "shop" && <ShopSection content={content} update={update} />}
              {section === "about" && <AboutSection about={content.about} update={update("about")} />}
              {section === "contact" && <ContactSection contact={content.contact} update={update("contact")} />}
              {section === "faq" && <FaqSection faq={content.faq} update={update("faq")} />}
              {section === "account" && <AccountSection content={content} update={update} />}
              {section === "legal" && <LegalSection legal={content.legal} update={update("legal")} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <SaveBar
        dirty={dirty}
        status={status}
        onSave={save}
        onDiscard={() => {
          setContent(JSON.parse(saved));
          setStatus({ kind: "idle" });
        }}
      />
    </div>
  );
}

function SaveBar({
  dirty,
  status,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  status: { kind: string; message?: string };
  onSave: () => void;
  onDiscard: () => void;
}) {
  const visible = dirty || status.kind === "saved" || status.kind === "error";
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl flex-col gap-3 rounded-[24px] bg-ink p-3 pl-5 text-paper shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] sm:flex-row sm:items-center sm:justify-between lg:left-[260px]"
          role="region"
          aria-label="Save changes"
        >
          <p className="flex items-center gap-2 text-sm" aria-live="polite">
            {status.kind === "error" ? (
              <>
                <CircleAlert className="h-4 w-4 flex-none text-[#ffb4a8]" aria-hidden /> {status.message}
              </>
            ) : status.kind === "saved" && !dirty ? (
              <>
                <CircleCheck className="h-4 w-4 flex-none text-[#9fd8c0]" aria-hidden /> Saved. Your store is up to date.
              </>
            ) : (
              <>
                <span className="h-2 w-2 flex-none rounded-full bg-[#f5c46b]" aria-hidden /> You have unsaved changes
              </>
            )}
          </p>
          {dirty && (
            <div className="flex flex-none gap-2">
              <button
                type="button"
                onClick={onDiscard}
                disabled={status.kind === "saving"}
                className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={status.kind === "saving"}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition hover:bg-well disabled:opacity-70"
              >
                {status.kind === "saving" && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />}
                {status.kind === "saving" ? "Saving…" : "Save changes"}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Sections

type SectionProps = {
  content: SiteContent;
  update: <K extends keyof SiteContent>(key: K) => Update<SiteContent[K]>;
};

function Row({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

function BusinessSection({ content, update }: SectionProps) {
  const b = content.business;
  const set = update("business");
  const seo = content.seo;
  const setSeo = update("seo");
  return (
    <>
      <Panel title="Company" description="Used across the site: header, footer, contact page, FAQ answers and legal pages.">
        <Row>
          <TextField label="Business name" value={b.name} onChange={(name) => set({ name })} />
          <TextField label="Short name" value={b.shortName} onChange={(shortName) => set({ shortName })} hint="Shown as the logo in the navigation and footer." />
        </Row>
        <Row>
          <TextField label="Email" value={b.email} onChange={(email) => set({ email })} hint="Where the contact form sends messages." />
          <TextField label="Phone" value={b.phone} onChange={(phone) => set({ phone })} />
        </Row>
        <TextField label="Company registration number" value={b.companyNumber} onChange={(companyNumber) => set({ companyNumber })} />
        <LinesField label="Registered address" value={b.address} onChange={(address) => set({ address })} hint="One line per row." />
      </Panel>

      <Panel title="Opening hours" description="Shown on the contact page and in the footer. Write “Closed” for days you're closed.">
        <ListEditor
          items={b.hours}
          onChange={(hours) => set({ hours })}
          newItem={() => ({ days: "", time: "" })}
          noun="Row"
          render={(h, change) => (
            <Row>
              <TextField label="Days" value={h.days} onChange={(days) => change({ ...h, days })} placeholder="Monday – Friday" />
              <TextField label="Hours" value={h.time} onChange={(time) => change({ ...h, time })} placeholder="9:00 AM – 6:00 PM" />
            </Row>
          )}
        />
      </Panel>

      <Panel title="Search engines" description="How your store appears in Google results and when links are shared.">
        <TextField label="Site title" value={seo.title} onChange={(title) => setSeo({ title })} />
        <TextField label="Site description" value={seo.description} onChange={(description) => setSeo({ description })} rows={3} />
      </Panel>
    </>
  );
}

function HomeSection({ home, update }: { home: SiteContent["home"]; update: Update<SiteContent["home"]> }) {
  return (
    <>
      <Panel title="Hero" description="The first screen, with the 3D tunnel of pictures.">
        <TextField label="Headline" value={home.heroTitle} onChange={(heroTitle) => update({ heroTitle })} rows={2} hint="Press Enter for a line break." />
        <TextField label="Text under the headline" value={home.heroSubtitle} onChange={(heroSubtitle) => update({ heroSubtitle })} rows={2} />
        <Row>
          <TextField label="Main button" value={home.heroPrimaryLabel} onChange={(heroPrimaryLabel) => update({ heroPrimaryLabel })} hint="Scrolls to New arrivals." />
          <TextField label="Second button" value={home.heroSecondaryLabel} onChange={(heroSecondaryLabel) => update({ heroSecondaryLabel })} hint="Opens the About page." />
        </Row>
      </Panel>

      <Panel title="Tunnel pictures" description="The cards that fly past in the hero. 6 to 12 works best.">
        <ListEditor
          items={home.heroImages}
          onChange={(heroImages) => update({ heroImages })}
          newItem={() => ({ src: "", title: "" })}
          noun="Picture"
          max={16}
          render={(img, change) => (
            <>
              <ImageField label="Picture" value={img.src} onChange={(src) => change({ ...img, src })} aspect="aspect-square" />
              <TextField label="Caption" value={img.title} onChange={(title) => change({ ...img, title })} />
            </>
          )}
        />
      </Panel>

      <Panel title="New arrivals" description="Shows your 8 newest products.">
        <TextField label="Heading" value={home.newArrivalsHeading} onChange={(newArrivalsHeading) => update({ newArrivalsHeading })} />
      </Panel>

      <Panel title="Shop by category" description="The picture tiles on the homepage. Add, remove or reorder them with the buttons below. A visitor who clicks a tile sees the shop showing only products that contain its search word.">
        <TextField label="Heading" value={home.categoriesHeading} onChange={(categoriesHeading) => update({ categoriesHeading })} />
        <ListEditor
          items={home.categories}
          onChange={(categories) => update({ categories })}
          newItem={() => ({ label: "", query: "", image: "", alt: "" })}
          noun="Category"
          max={8}
          render={(c, change) => (
            <>
              <Row>
                <TextField label="Name" value={c.label} onChange={(label) => change({ ...c, label })} />
                <TextField
                  label="Search word"
                  value={c.query}
                  onChange={(query) => change({ ...c, query })}
                  hint="Example: “leather” shows every product with “leather” in its name or description. Leave empty to show all products."
                />
              </Row>
              <ImageField
                label="Picture"
                value={c.image}
                onChange={(image) => change({ ...c, image })}
                alt={c.alt}
                onAltChange={(alt) => change({ ...c, alt })}
                aspect="aspect-[3/4]"
              />
            </>
          )}
        />
      </Panel>

      <Panel title="Story" description="The large picture with text beside it.">
        <TextField label="Heading" value={home.editorialHeading} onChange={(editorialHeading) => update({ editorialHeading })} />
        <TextField label="Text" value={home.editorialBody} onChange={(editorialBody) => update({ editorialBody })} rows={4} />
        <ImageField
          label="Picture"
          value={home.editorialImage.src}
          onChange={(src) => update({ editorialImage: { ...home.editorialImage, src } })}
          alt={home.editorialImage.alt}
          onAltChange={(alt) => update({ editorialImage: { ...home.editorialImage, alt } })}
          aspect="aspect-[4/5]"
        />
      </Panel>

      <Panel title="Scrolling words" description="The large words that slide across the page.">
        <LinesField label="Words" value={home.ticker} onChange={(ticker) => update({ ticker })} hint="One per line. Leave empty to hide the strip." />
      </Panel>

      <Panel title="Good to know" description="Shows the first question from each FAQ group. Edit the questions in the FAQ section.">
        <TextField label="Heading" value={home.faqHeading} onChange={(faqHeading) => update({ faqHeading })} />
        <TextField label="Text" value={home.faqIntro} onChange={(faqIntro) => update({ faqIntro })} rows={2} />
      </Panel>

      <Panel title="Service cards" description="The row at the bottom of the homepage. Icons: delivery truck, returns arrow, envelope.">
        <ListEditor
          items={home.service}
          onChange={(service) => update({ service })}
          newItem={() => ({ title: "", body: "" })}
          noun="Card"
          max={3}
          render={(s, change) => (
            <>
              <TextField label="Title" value={s.title} onChange={(title) => change({ ...s, title })} />
              <TextField label="Text" value={s.body} onChange={(body) => change({ ...s, body })} rows={2} />
            </>
          )}
        />
      </Panel>
    </>
  );
}

function ShopSection({ content, update }: SectionProps) {
  const c = content.catalog;
  const setC = update("catalog");
  const p = content.product;
  const setP = update("product");
  return (
    <>
      <Panel title="Shop page">
        <TextField label="Heading" value={c.heading} onChange={(heading) => setC({ heading })} />
        <TextField label="Text" value={c.intro} onChange={(intro) => setC({ intro })} rows={2} />
      </Panel>
      <Panel title="Every product page" description="Shown on all products. To edit a product itself, use Products.">
        <Row>
          <TextField label="Stock line" value={p.stockLine} onChange={(stockLine) => setP({ stockLine })} />
          <TextField label="Returns line" value={p.returnsLine} onChange={(returnsLine) => setP({ returnsLine })} />
        </Row>
        <TextField label="Delivery details" value={p.deliveryText} onChange={(deliveryText) => setP({ deliveryText })} rows={3} />
        <TextField label="Returns details" value={p.returnsText} onChange={(returnsText) => setP({ returnsText })} rows={3} hint="Followed by a link to your terms." />
        <TextField label="Related products heading" value={p.relatedHeading} onChange={(relatedHeading) => setP({ relatedHeading })} />
      </Panel>
    </>
  );
}

function AboutSection({ about, update }: { about: SiteContent["about"]; update: Update<SiteContent["about"]> }) {
  return (
    <>
      <Panel title="Introduction">
        <TextField label="Heading" value={about.heading} onChange={(heading) => update({ heading })} />
        <TextField label="Text" value={about.intro} onChange={(intro) => update({ intro })} rows={5} />
        <ImageField
          label="Picture"
          value={about.image.src}
          onChange={(src) => update({ image: { ...about.image, src } })}
          alt={about.image.alt}
          onAltChange={(alt) => update({ image: { ...about.image, alt } })}
          aspect="aspect-video"
        />
      </Panel>
      <Panel title="Cards" description="Shown in pairs below the picture.">
        <ListEditor
          items={about.principles}
          onChange={(principles) => update({ principles })}
          newItem={() => ({ title: "", body: "" })}
          noun="Card"
          render={(p, change) => (
            <>
              <TextField label="Title" value={p.title} onChange={(title) => change({ ...p, title })} />
              <TextField label="Text" value={p.body} onChange={(body) => change({ ...p, body })} rows={3} />
            </>
          )}
        />
      </Panel>
    </>
  );
}

function ContactSection({ contact, update }: { contact: SiteContent["contact"]; update: Update<SiteContent["contact"]> }) {
  return (
    <Panel title="Contact page" description="Email, hours and address come from Business details.">
      <TextField label="Heading" value={contact.heading} onChange={(heading) => update({ heading })} />
      <TextField label="Text" value={contact.intro} onChange={(intro) => update({ intro })} rows={2} />
    </Panel>
  );
}

function FaqSection({ faq, update }: { faq: SiteContent["faq"]; update: Update<SiteContent["faq"]> }) {
  return (
    <>
      <Panel title="Page">
        <TextField label="Heading" value={faq.heading} onChange={(heading) => update({ heading })} />
        <TextField label="Text" value={faq.intro} onChange={(intro) => update({ intro })} rows={2} />
      </Panel>
      <Panel title="Questions" description="Grouped by topic. The first question of each group also appears on the homepage.">
        <ListEditor
          items={faq.groups}
          onChange={(groups) => update({ groups })}
          newItem={() => ({ title: "", items: [{ question: "", answer: "" }] })}
          noun="Group"
          render={(group, change) => (
            <>
              <TextField label="Group name" value={group.title} onChange={(title) => change({ ...group, title })} />
              <ListEditor
                items={group.items}
                onChange={(items) => change({ ...group, items })}
                newItem={() => ({ question: "", answer: "" })}
                noun="Question"
                render={(item, changeItem) => (
                  <>
                    <TextField label="Question" value={item.question} onChange={(question) => changeItem({ ...item, question })} />
                    <TextField label="Answer" value={item.answer} onChange={(answer) => changeItem({ ...item, answer })} rows={3} />
                  </>
                )}
              />
            </>
          )}
        />
      </Panel>
      <Panel title="Closing panel" description="The dark panel at the bottom, with a Contact us button.">
        <TextField label="Heading" value={faq.ctaHeading} onChange={(ctaHeading) => update({ ctaHeading })} />
        <TextField label="Text" value={faq.ctaBody} onChange={(ctaBody) => update({ ctaBody })} rows={2} />
      </Panel>
    </>
  );
}

function AccountSection({ content, update }: SectionProps) {
  const f = content.footer;
  const a = content.auth;
  const setA = update("auth");
  return (
    <>
      <Panel title="Footer" description="Email, hours, address and company number come from Business details.">
        <TextField label="Message" value={f.tagline} onChange={(tagline) => update("footer")({ tagline })} rows={2} />
      </Panel>
      <Panel title="Log in and create account pages">
        <Row>
          <TextField label="Log in heading" value={a.loginHeading} onChange={(loginHeading) => setA({ loginHeading })} />
          <TextField label="Log in text" value={a.loginIntro} onChange={(loginIntro) => setA({ loginIntro })} />
        </Row>
        <Row>
          <TextField label="Create account heading" value={a.registerHeading} onChange={(registerHeading) => setA({ registerHeading })} />
          <TextField label="Create account text" value={a.registerIntro} onChange={(registerIntro) => setA({ registerIntro })} />
        </Row>
        <ImageField
          label="Side picture"
          value={a.image.src}
          onChange={(src) => setA({ image: { ...a.image, src } })}
          alt={a.image.alt}
          onAltChange={(alt) => setA({ image: { ...a.image, alt } })}
          aspect="aspect-[4/5]"
        />
      </Panel>
    </>
  );
}

function LegalSection({ legal, update }: { legal: SiteContent["legal"]; update: Update<SiteContent["legal"]> }) {
  const formatting = (
    <>
      Formatting: <code className="font-mono">## Heading</code>, <code className="font-mono">**bold**</code>,{" "}
      <code className="font-mono">- list item</code>, <code className="font-mono">[link text](/contact)</code>. Leave an empty line
      between paragraphs.
    </>
  );
  return (
    <>
      <Panel title="Last updated" description="Moves to today automatically when you change either document.">
        <TextField label="Date shown" value={legal.updated} onChange={(updated) => update({ updated })} />
      </Panel>
      <Panel title="Terms of Service">
        <TextField label="Text" value={legal.terms} onChange={(terms) => update({ terms })} rows={22} mono hint={formatting} />
      </Panel>
      <Panel title="Privacy Policy">
        <TextField label="Text" value={legal.privacy} onChange={(privacy) => update({ privacy })} rows={22} mono hint={formatting} />
      </Panel>
    </>
  );
}
