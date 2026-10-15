"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { animate } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type CountUpProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export default function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // `true` on the server and during hydration, so the HTML carries the final value
  // and server/client text always match.
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);
  const triggered = useRef(false);

  const trigger = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;
    animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
  }, [value]);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    // Use native IntersectionObserver — works reliably with Lenis
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trigger();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, reduced]);

  const shown = reduced ? value : display;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
