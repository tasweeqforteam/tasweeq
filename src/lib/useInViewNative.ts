"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Native IntersectionObserver hook that works reliably with Lenis smooth scroll.
 * Framer Motion's `whileInView` uses its own observer that can desync under Lenis.
 */
export function useInViewNative<T extends HTMLElement = HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
