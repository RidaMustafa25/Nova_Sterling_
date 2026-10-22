import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { cache } from "react";
import { BlobNotFoundError, head, put } from "@vercel/blob";
import { SITE } from "../site";
import type { Product } from "../types";
import { normalizeContent, resolveContent, type SiteContent } from "./schema";
import { DEFAULT_PRODUCTS, normalizeProducts } from "./products";

/**
 * Server-side storage for everything the admin edits. Files live in /content:
 *   site.json            page text, images and business details
 *   store-products.json  the product list (newest first)
 *   media/               images uploaded from the admin
 * Until a file is first saved, the built-in defaults are used.
 */
const CONTENT_DIR = path.join(process.cwd(), "content");
const SITE_FILE = path.join(CONTENT_DIR, "site.json");
const PRODUCTS_FILE = path.join(CONTENT_DIR, "store-products.json");
const MEDIA_DIR = path.join(CONTENT_DIR, "media");

/** A save that failed for a reason the admin should be told about. */
export class StorageError extends Error {}

/**
 * On Vercel the filesystem is read-only, so when a Blob store is connected
 * (BLOB_READ_WRITE_TOKEN is set) everything is kept there instead of on disk.
 */
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Path of a file inside /content, used as its key in the Blob store. */
const blobKey = (file: string) => path.relative(CONTENT_DIR, file).split(path.sep).join("/");

async function readBuffer(file: string): Promise<Buffer | undefined> {
  if (!USE_BLOB) {
    try {
      return await fs.readFile(file);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error(`[content] Could not read ${file}:`, error);
      return undefined;
    }
  }
  try {
    const meta = await head(blobKey(file));
    // The upload time in the query makes every save a new CDN cache key, so a fresh save is never read stale.
    const res = await fetch(`${meta.url}?v=${meta.uploadedAt.getTime()}`, { cache: "no-store" });
    return res.ok ? Buffer.from(await res.arrayBuffer()) : undefined;
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) console.error(`[content] Could not read ${file}:`, error);
    return undefined;
  }
}

async function readJson(file: string): Promise<unknown> {
  const data = await readBuffer(file);
  if (!data) return undefined;
  try {
    return JSON.parse(data.toString("utf8"));
  } catch (error) {
    console.error(`[content] Could not parse ${file}:`, error);
    return undefined;
  }
}

async function writeFile(file: string, data: string | Buffer, contentType?: string): Promise<void> {
  try {
    if (USE_BLOB) {
      await put(blobKey(file), data, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType, cacheControlMaxAge: 60 });
      return;
    }
    await fs.mkdir(path.dirname(file), { recursive: true });
    // Write next to the target, then swap, so a crash never leaves a half-written file.
    const temp = `${file}.${randomBytes(4).toString("hex")}.tmp`;
    await fs.writeFile(temp, data);
    await fs.rename(temp, file);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    console.error(`[content] Could not write ${file}:`, error);
    throw new StorageError(
      code === "EROFS" || code === "EACCES" || code === "EPERM"
        ? "This server doesn't allow saving files, so changes can't be stored here. The host needs a storage service connected."
        : "The change couldn't be saved. Please try again.",
    );
  }
}

export const getSiteContent = cache(async (): Promise<SiteContent> => normalizeContent((await readJson(SITE_FILE)) ?? {}));

/** Content with every {placeholder} filled in, as the storefront shows it. */
export const getPublicContent = cache(async (): Promise<SiteContent> => resolveContent(await getSiteContent(), SITE.currency));

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await writeFile(SITE_FILE, JSON.stringify(content, null, 2), "application/json");
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const saved = await readJson(PRODUCTS_FILE);
  return saved === undefined ? DEFAULT_PRODUCTS : normalizeProducts(saved);
});

export async function saveProducts(products: Product[]): Promise<void> {
  await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "application/json");
}

// ---------------------------------------------------------------------------
// Uploaded images

export const MEDIA_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MEDIA_NAME = /^[a-f0-9]{24}\.(jpg|png|webp|gif|avif)$/;

/** Stores an uploaded image and returns the public path it is served from. */
export async function saveMedia(data: Buffer, type: string): Promise<string> {
  const ext = MEDIA_TYPES[type];
  if (!ext) throw new StorageError("Please upload a JPG, PNG, WebP, GIF or AVIF image.");
  const name = `${randomBytes(12).toString("hex")}.${ext}`;
  await writeFile(path.join(MEDIA_DIR, name), data, type);
  return `/media/${name}`;
}

export async function readMedia(name: string): Promise<{ data: Buffer; type: string } | null> {
  if (!MEDIA_NAME.test(name)) return null;
  const data = await readBuffer(path.join(MEDIA_DIR, name));
  if (!data) return null;
  const ext = name.split(".").pop();
  const type = Object.keys(MEDIA_TYPES).find((t) => MEDIA_TYPES[t] === ext) ?? "application/octet-stream";
  return { data, type };
}
