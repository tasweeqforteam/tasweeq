"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/Providers";
import { useInViewNative } from "@/lib/useInViewNative";

/** Big centred statement; words arrive one after another (ref: ~55 ms stagger, blur + fade). */
export default function Statement() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const { ref, inView } = useInViewNative<HTMLParagraphElement>(0.35);
  const words = t.statement.text.split(" ");
  const show = inView || reduced;

  return (
    <section className="bg-paper py-[clamp(4.5rem,10vw,8rem)]">
      <div className="container-editorial flex flex-col items-center text-center">
        <span className="eyebrow inline-flex items-center gap-2 text-gray-1">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
          {t.statement.label}
        </span>
        <p
          ref={ref}
          key={t.statement.text}
          className="font-display mt-8 max-w-4xl text-[clamp(1.8rem,4.2vw,3.4rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink"
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block [margin-inline-end:0.26em]"
              initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.055 }}
            >
              {w}
            </motion.span>
          ))}
        </p>
      </div>
    </section>
  );
}
