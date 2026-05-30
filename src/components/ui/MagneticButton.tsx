"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type MagneticButtonProps = {
  children: React.ReactNode;
  href?: string;
  ariaLabel?: string;
  className?: string;
  strength?: number;
};

/**
 * Magnetic hover wrapper — the element eases toward the cursor while hovered
 * and springs back on leave. Falls back to a static element under reduced motion.
 */
export default function MagneticButton({
  children,
  href,
  ariaLabel,
  className = "",
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setPos({ x, y });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.4 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
