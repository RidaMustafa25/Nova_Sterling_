// Signed admin session cookie. Uses Web Crypto so it works in middleware (edge) and route handlers.

export const ADMIN_COOKIE = "nova_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
  return btoa(String.fromCharCode(...sig)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createAdminToken(secret: string): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
  return `${expires}.${await sign(`admin.${expires}`, secret)}`;
}

export async function verifyAdminToken(token: string | undefined, secret: string | undefined): Promise<boolean> {
  if (!token || !secret) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now() / 1000) return false;
  return safeEqual(sig, await sign(`admin.${expires}`, secret));
}
