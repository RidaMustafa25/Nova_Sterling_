/**
 * Technical store settings.
 *
 * Business details (name, email, address, hours…) and all page text are edited by the
 * admin at /admin/content; see src/lib/content/schema.ts for the defaults.
 */
export const SITE = {
  url: "https://novasterlingltd.vercel.app",

  // Currency used for all prices
  currency: "USD",
  locale: "en-US",
} as const;
