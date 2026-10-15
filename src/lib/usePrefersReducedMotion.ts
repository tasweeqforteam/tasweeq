"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion preference. The server snapshot is `true`, so the
 * server HTML (and the hydration pass) renders the static, final state; React then
 * re-renders with the real preference. Unlike reading matchMedia in useState/useEffect,
 * this never produces server/client text mismatches.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => true);
}
