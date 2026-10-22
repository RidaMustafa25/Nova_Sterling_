import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex-1 bg-canvas text-ink">{children}</div>;
}
