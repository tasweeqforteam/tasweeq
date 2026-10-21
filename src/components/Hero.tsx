"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useBrief } from "@/components/Brief";
import { useLanguage } from "@/components/Providers";
import { PROJECTS } from "@/lib/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Cards sit on one large circle whose centre is below the frame (the "wheel"). */
const RING_SLOTS = 9;
const CENTER_PROJECT = 2; // which project sits at the top of the wheel

function useRingGeometry() {
  const [g, setG] = useState({ w: 230, r: 1200 });
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const w = Math.round(Math.min(230, Math.max(140, vw * 0.155)));
      const r = Math.round(Math.min(1300, Math.max(560, vw * 0.85)));
      setG({ w, r });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const h = Math.round(g.w * 1.25);
  const stepDeg = (((g.w + 22) / g.r) * 180) / Math.PI;
  return { ...g, h, stepDeg };
}

export default function Hero() {
  const { t, dir, lang } = useLanguage();
  const { openBrief } = useBrief();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { w, h, r, stepDeg } = useRingGeometry();

  // On scroll the wheel turns a little and rises, while the copy leaves first (ref: 2.8–3.6 s).
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const ringTurn = useTransform(scrollYProgress, [0, 1], [0, -9]);
  const ringLift = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 0.6], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const half = Math.floor(RING_SLOTS / 2);
  const slots = Array.from({ length: RING_SLOTS }, (_, i) => {
    const k = i - half;
    const project = PROJECTS[(((CENTER_PROJECT + k) % PROJECTS.length) + PROJECTS.length) % PROJECTS.length];
    return { k, project };
  });

  return (
    <section id="top" ref={sectionRef} className="relative pt-[92px]">
      <div className="px-3 sm:px-4">
        {/* framed canvas */}
        <div className="relative overflow-hidden rounded-[28px] bg-ink text-paper">
          <motion.div
            style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
            className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-[clamp(4.5rem,7vw,6rem)] text-center"
          >
            {/* headline → service line → CTA (no chip, no paragraph: one message, then the work) */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className={`font-display mx-auto max-w-[340px] text-[clamp(1.75rem,2.2vw+0.85rem,2.75rem)] font-extrabold sm:max-w-[680px] lg:max-w-[820px] ${
                lang === "ar" ? "[html[lang=ar]_&]:leading-[1.28]!" : "leading-[1.1]"
              }`}
            >
              <span className="block">{t.hero.headline[0]}</span>
              <span className="block text-cyan">{t.hero.headline[1]}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.32 }}
              className="mt-4 text-[13px] font-medium leading-[1.5] text-paper/60 sm:mt-[18px] sm:text-[14px]"
            >
              {t.hero.leftCopy}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
              className="mt-6 flex w-full max-w-[340px] flex-col items-stretch gap-2 sm:mt-7 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-2.5"
            >
              <button
                type="button"
                onClick={() => openBrief({ source: "hero" })}
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-cyan pe-2 ps-5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
              >
                {t.cta.start}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-cyan">
                  <ArrowUpRight size={15} />
                </span>
              </button>
              <a
                href="#work"
                className="inline-flex h-12 items-center justify-center rounded-full border border-paper/20 px-5 text-sm font-semibold text-paper transition-colors hover:border-paper/60"
              >
                {t.hero.seeWork}
              </a>
            </motion.div>
          </motion.div>

          {/* the wheel of work */}
          <div
            dir="ltr"
            className="relative mt-[clamp(2rem,5vw,3.5rem)]"
            style={{ height: h + Math.round(h * 0.45) }}
          >
            <motion.div
              className="absolute left-1/2 h-0 w-0"
              style={{ top: r + h / 2 + 18, rotate: reduced ? 0 : ringTurn, y: reduced ? 0 : ringLift }}
            >
              <motion.div
                className="absolute left-0 top-0 h-0 w-0"
                initial={reduced ? false : { rotate: 22, y: h * 0.9, opacity: 0 }}
                animate={{ rotate: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1.15, ease: EASE, delay: 0.45 }}
              >
                {slots.map(({ k, project }, i) => (
                  <div
                    key={`${project.slug}-${i}`}
                    className="absolute"
                    style={{
                      width: w,
                      height: h,
                      left: -w / 2,
                      top: -h / 2,
                      transform: `rotate(${k * stepDeg}deg) translateY(${-r}px)`,
                    }}
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      aria-label={project.title}
                      tabIndex={Math.abs(k) > 2 ? -1 : 0}
                      className="group block h-full transition-transform duration-500 ease-[var(--ease-editorial)] hover:-translate-y-3"
                    >
                      <div className="relative h-full overflow-hidden rounded-[18px] border border-paper/10 bg-black">
                        <Image
                          src={project.cover}
                          alt={project.title}
                          fill
                          priority={Math.abs(k) <= 2}
                          sizes="240px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                        <span
                          dir={dir}
                          className="absolute bottom-3 start-3 rounded-full bg-white px-3 py-1 text-[0.72rem] font-semibold text-black"
                        >
                          {lang === "ar" ? project.titleAr : project.title}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* client strip */}
      <div className="relative mt-8 overflow-hidden" dir="ltr">
        <div className="animate-marquee flex w-max gap-14 py-2">
          {[...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS].map((p, i) => (
            <span
              key={`${p.slug}-${i}`}
              className="flex shrink-0 items-center gap-2.5 font-display text-lg font-bold tracking-[-0.02em] text-gray-2"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.accent }} />
              {p.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
