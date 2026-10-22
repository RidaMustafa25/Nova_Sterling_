"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Re-mounts on every navigation, so each page settles in with a short fade and lift.
export default function SiteTemplate({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
