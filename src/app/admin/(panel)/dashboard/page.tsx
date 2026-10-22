import { redirect } from "next/navigation";

// The old duplicate admin page; the overview now lives at /admin.
export default function AdminDashboardRedirect() {
  redirect("/admin");
}
