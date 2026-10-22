import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/content/store";
import { normalizeContent } from "@/lib/content/schema";
import {
  badRequest,
  isAdminRequest,
  readJsonBody,
  refreshStorefront,
  storageFailure,
  unauthorized,
} from "@/lib/adminRequest";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  const body = await readJsonBody(request);
  if (!body || typeof body !== "object") return badRequest("Invalid request.");

  const previous = await getSiteContent();
  const next = normalizeContent(body);

  if (!next.business.name.trim()) return badRequest("The business name can't be empty.");

  // Editing the Terms or Privacy Policy moves their "Last updated" date to today,
  // unless the admin set the date themselves in the same save.
  const legalChanged = next.legal.terms !== previous.legal.terms || next.legal.privacy !== previous.legal.privacy;
  if (legalChanged && next.legal.updated === previous.legal.updated) {
    next.legal.updated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  try {
    await saveSiteContent(next);
  } catch (error) {
    return storageFailure(error);
  }
  refreshStorefront();
  return NextResponse.json(next);
}
