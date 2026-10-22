import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getProducts, saveProducts } from "@/lib/content/store";
import { normalizeProduct } from "@/lib/content/products";
import type { Product } from "@/lib/types";
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
  return NextResponse.json(await getProducts());
}

/**
 * Body: one product (without an id) to add it at the top of the store,
 * or { import: Product[] } to bring in products saved in a browser by the old admin.
 */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  const body = await readJsonBody(request);
  if (!body || typeof body !== "object") return badRequest("Invalid request.");
  const current = await getProducts();

  let added: Product[];
  if (Array.isArray((body as { import?: unknown }).import)) {
    const known = new Set(current.map((p) => p.id));
    added = ((body as { import: unknown[] }).import)
      .map(normalizeProduct)
      .filter((p): p is Product => typeof p !== "string" && !known.has(p.id));
  } else {
    const product = normalizeProduct({ ...body, id: `p-${Date.now().toString(36)}${randomBytes(2).toString("hex")}` });
    if (typeof product === "string") return badRequest(product);
    added = [product];
  }

  try {
    await saveProducts([...added, ...current]);
  } catch (error) {
    return storageFailure(error);
  }
  refreshStorefront();
  return NextResponse.json(added, { status: 201 });
}
