import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/content/store";
import { normalizeProduct } from "@/lib/content/products";
import {
  badRequest,
  isAdminRequest,
  readJsonBody,
  refreshStorefront,
  storageFailure,
  unauthorized,
} from "@/lib/adminRequest";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function notFound() {
  return NextResponse.json({ error: "That product no longer exists." }, { status: 404 });
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminRequest())) return unauthorized();
  const { id } = await params;

  const body = await readJsonBody(request);
  if (!body || typeof body !== "object") return badRequest("Invalid request.");

  const current = await getProducts();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return notFound();

  const product = normalizeProduct({ ...body, id });
  if (typeof product === "string") return badRequest(product);

  const next = [...current];
  next[index] = product;
  try {
    await saveProducts(next);
  } catch (error) {
    return storageFailure(error);
  }
  refreshStorefront();
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminRequest())) return unauthorized();
  const { id } = await params;

  const current = await getProducts();
  if (!current.some((p) => p.id === id)) return notFound();

  try {
    await saveProducts(current.filter((p) => p.id !== id));
  } catch (error) {
    return storageFailure(error);
  }
  refreshStorefront();
  return NextResponse.json({ ok: true });
}
