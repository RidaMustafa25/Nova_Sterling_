import ReactMarkdown from "react-markdown";

/** Renders markdown safely (raw HTML in the source is not executed). */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-store max-w-none prose-headings:font-display">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
