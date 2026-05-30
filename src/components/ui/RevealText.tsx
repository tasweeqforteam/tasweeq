"use client";

import { motion, useReducedMotion } from "framer-motion";
import { lineReveal, stagger } from "@/lib/motion";
import { useInViewNative } from "@/lib/useInViewNative";

type RevealTextProps = {
  lines: string[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  align?: "start" | "end";
  forceEn?: boolean;
};

/**
 * Per-line mask reveal. Uses native IntersectionObserver (not Framer's whileInView)
 * for reliable triggering under Lenis smooth scroll.
 */
export default function RevealText({
  lines,
  className = "",
  lineClassName = "",
  as = "h2",
  align = "start",
  forceEn = false,
}: RevealTextProps) {
  const Tag = motion[as];
  const { ref, inView } = useInViewNative<HTMLDivElement>(0.2);
  const reduced = useReducedMotion();

  return (
    <div ref={ref} {...(forceEn ? { "data-font-en": true } : {})}>
      <Tag
        variants={stagger}
        initial={reduced ? "show" : "hidden"}
        animate={inView || reduced ? "show" : "hidden"}
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
