import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";

/**
 * Product tile: image well with a slow zoom (and a crossfade to the second photo when there is one),
 * a quick-add pill that slides up on hover, then name, price and a one-line description.
 */
export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const cover = product.images[0] ?? "";
  const alternate = product.images[1];
  const href = `/product/${product.id}`;

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-well">
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0">
          <ProductImage
            src={cover}
            alt=""
            priority={priority}
            className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          {alternate && (
            <ProductImage
              src={alternate}
              alt=""
              className="opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="absolute bottom-3 right-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:left-3 lg:translate-y-4 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <AddToCartButton
            variant="compact"
            product={{ id: product.id, title: product.title, price: product.price, image: cover }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <h3 className="text-[15px] font-medium leading-snug">
          <Link href={href} className="link-draw">
            {product.title}
          </Link>
        </h3>
        <p className="price whitespace-nowrap text-[15px] font-semibold">{formatPrice(product.price)}</p>
      </div>
      {product.description && (
        <p className="mt-1 line-clamp-1 px-1 text-sm text-ink-soft">{product.description}</p>
      )}
    </article>
  );
}
