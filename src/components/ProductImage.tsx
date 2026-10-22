import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Fills its parent, so the parent must be `relative` and have a size
 * (for example an `aspect-square` box).
 */
export default function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className = "",
}: ProductImageProps) {
  // Images pasted in as full URLs can't go through next/image without extra config, and
  // admin uploads (/media/…) are already served with long-lived caching.
  if (/^https?:\/\//i.test(src) || src.startsWith("/media/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.toLowerCase().endsWith(".svg")}
      className={`object-cover ${className}`}
    />
  );
}
