import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, verifyAdminToken } from "./adminSession";
import { StorageError } from "./content/store";

// Helpers for the /api/admin/* route handlers. Middleware only guards /admin pages, so every
// admin API route checks the session cookie itself.

export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value, process.env.ADMIN_SESSION_SECRET);
}

export function unauthorized() {
  return NextResponse.json({ error: "Your admin session has ended. Please log in again." }, { status: 401 });
}

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export function storageFailure(error: unknown) {
  const message = error instanceof StorageError ? error.message : "The change couldn't be saved. Please try again.";
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

/** Every storefront page reads the saved content, so refresh them all after a save. */
export function refreshStorefront() {
  revalidatePath("/", "layout");
}
