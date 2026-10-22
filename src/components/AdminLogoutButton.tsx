"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-paper px-4 text-xs font-semibold text-ink transition hover:border-ink"
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden /> Log out
    </button>
  );
}
