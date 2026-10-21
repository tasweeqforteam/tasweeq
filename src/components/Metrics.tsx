"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/Providers";
import { PROJECTS } from "@/lib/projects";

function FadeInOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/** Crossfades through every project cover so the card shows the whole body of work. */
function ProjectCycle() {
  const { lang } = useLanguage();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % PROJECTS.length), 2600);
    return () => window.clearInterval(id);
  }, [reduced]);

  const p = PROJECTS[i];
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={p.slug}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={p.cover} alt={p.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute start-4 top-4 z-10 flex items-center gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-[0.72rem] font-semibold text-black">
          {lang === "ar" ? p.titleAr : p.title}
        </span>
        <span className="flex gap-1">
          {PROJECTS.map((x, k) => (
            <span
              key={x.slug}
              className={`h-1.5 rounded-full bg-white transition-all duration-500 ${k === i ? "w-5" : "w-1.5 opacity-50"}`}
            />
          ))}
        </span>
      </div>
    </>
  );
}

const TITLE_CLASS = "font-display text-[clamp(1.7rem,2.8vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em]";

/** "Why TASWEEQ" bento — strengths in words, no unverifiable numbers. */
export default function Metrics() {
  const { t } = useLanguage();
  const items = t.metrics.items;

  return (
    <section id="results" className="bg-paper py-[clamp(4rem,9vw,7rem)]">
      <div className="container-editorial">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow inline-flex items-center gap-2 text-gray-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            {t.metrics.label}
          </span>
          <h2 className="font-display mt-5 max-w-2xl text-[clamp(1.8rem,3.6vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
            {t.metrics.heading}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          {/* work card — cycles through every project */}
          <FadeInOnScroll className="relative min-h-[420px] overflow-hidden rounded-[20px] bg-ink md:row-span-2">
            <ProjectCycle />
            <div className="absolute inset-x-4 bottom-4 z-10 rounded-[14px] bg-white p-5 text-black">
              <h3 className={TITLE_CLASS}>{items[0].title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{items[0].copy}</p>
            </div>
          </FadeInOnScroll>

          {/* neutral card */}
          <FadeInOnScroll
            delay={0.08}
            className="flex min-h-[200px] flex-col justify-end rounded-[20px] border border-line bg-ink/[0.03] p-7"
          >
            <h3 className={`${TITLE_CLASS} text-ink`}>{items[2].title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-1">{items[2].copy}</p>
          </FadeInOnScroll>

          {/* cyan card */}
          <FadeInOnScroll delay={0.16} className="flex min-h-[200px] flex-col justify-end rounded-[20px] bg-cyan p-7 text-black">
            <h3 className={TITLE_CLASS}>{items[1].title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70">{items[1].copy}</p>
          </FadeInOnScroll>

          {/* ink card */}
          <FadeInOnScroll
            delay={0.24}
            className="flex min-h-[200px] flex-col justify-end rounded-[20px] bg-ink p-7 text-paper md:col-span-2"
          >
            <h3 className={TITLE_CLASS}>{items[3].title}</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-paper/60">{items[3].copy}</p>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
