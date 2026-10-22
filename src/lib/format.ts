import { SITE } from "./site";

const formatter = new Intl.NumberFormat(SITE.locale, {
  style: "currency",
  currency: SITE.currency,
});

export function formatPrice(value: number): string {
  return formatter.format(Number.isFinite(value) ? value : 0);
}
