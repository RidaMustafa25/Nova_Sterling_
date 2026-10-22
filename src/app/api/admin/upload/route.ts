import { NextResponse } from "next/server";
import { MEDIA_TYPES, saveMedia } from "@/lib/content/store";
import { badRequest, isAdminRequest, storageFailure, unauthorized } from "@/lib/adminRequest";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;

/** Multipart body with a `file` field. Returns { url } for the stored image. */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  let file: FormDataEntryValue | null = null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return badRequest("Invalid upload.");
  }
  if (!(file instanceof File)) return badRequest("Please choose an image to upload.");
  if (!MEDIA_TYPES[file.type]) return badRequest("Please upload a JPG, PNG, WebP, GIF or AVIF image.");
  if (file.size > MAX_BYTES) return badRequest("That image is larger than 8 MB. Please use a smaller file.");

  try {
    const url = await saveMedia(Buffer.from(await file.arrayBuffer()), file.type);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    return storageFailure(error);
  }
}
