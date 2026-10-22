import Link from "next/link";
import ReactMarkdown from "react-markdown";

/** A legal page whose body is Markdown written in the admin (raw HTML in it is not executed). */
export default function PolicyLayout({ title, updated, body }: { title: string; updated: string; body: string }) {
  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-28 pt-10 sm:px-6 lg:px-8">
      <h1 className="display text-5xl sm:text-7xl">{title}</h1>
      {updated && <p className="mt-5 text-sm text-ink-soft">Last updated {updated}</p>}
      <div className="mt-12 rounded-[32px] bg-paper px-6 py-10 ring-1 ring-line sm:px-12 sm:py-14">
        <article className="prose prose-lg prose-store max-w-[68ch] prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-a:underline-offset-4">
          <ReactMarkdown
            components={{
              a: ({ href = "", children }) =>
                href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>,
            }}
          >
            {body}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
