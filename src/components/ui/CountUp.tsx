"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { animate, useReducedMotion } from "framer-motion";

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
  const reduced = useReducedMotion();
  // Must match on server and client: useReducedMotion() is null during SSR.
  // The effect below jumps straight to `value` under reduced motion.
  const [display, setDisplay] = useState(0);
  const triggered = useRef(false);

  const trigger = useCallback(() => {
    if (triggered.current || reduced) return;
    triggered.current = true;
    animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
  }, [value, reduced]);

  useEffect(() => {
    if (reduced) {
      // Post-hydration sync: can't be the initial state without an SSR mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
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
  }, [trigger, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
