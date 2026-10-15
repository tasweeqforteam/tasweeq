"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { lineReveal, stagger } from "@/lib/motion";
import { useInViewNative } from "@/lib/useInViewNative";

type RevealTextProps = {
  lines: string[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  align?: "start" | "end";
  forceEn?: boolean;
  /**
   * "inView" (default): Framer reveal when scrolled into view.
   * "load": CSS-only reveal that starts at first paint — use for above-the-fold
   * headlines so they don't wait for hydration and stay visible without JS.
   */
  trigger?: "inView" | "load";
};

/**
 * Per-line mask reveal. Uses native IntersectionObserver (not Framer's whileInView)
 * for reliable triggering under Lenis smooth scroll. Reduced motion is handled by
 * <MotionConfig reducedMotion="user"> (Providers) and by the CSS media query for "load".
 */
export default function RevealText({
  lines,
  className = "",
  lineClassName = "",
  as = "h2",
  align = "start",
  forceEn = false,
  trigger = "inView",
}: RevealTextProps) {
  const { ref, inView } = useInViewNative<HTMLDivElement>(0.2);
  const fontProps = forceEn ? { "data-font-en": true } : {};

  if (trigger === "load") {
    const Tag = as;
    return (
      <div ref={ref} {...fontProps}>
        <Tag className={className} style={{ textAlign: align }}>
          {lines.map((line, i) => (
            <span key={`${line}-${i}`} className="block overflow-hidden pb-[0.06em]">
              <span className={`reveal-line block ${lineClassName}`} style={{ "--i": i } as CSSProperties}>
                {line}
              </span>
            </span>
          ))}
        </Tag>
      </div>
    );
  }

  const Tag = motion[as];
  return (
    <div ref={ref} {...fontProps}>
      <Tag
        variants={stagger}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className={className}
        style={{ textAlign: align }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={lineReveal} className={`block ${lineClassName}`}>
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
