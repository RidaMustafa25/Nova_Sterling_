import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn-style class merger used by components in src/components/ui.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
