"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
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

  // ── wheel rotation (in card steps): drag/swipe, horizontal trackpad scroll, auto-advance ──
  const rotMV = useMotionValue(0);
  const [rot, setRot] = useState(0);
  useMotionValueEvent(rotMV, "change", setRot);
  const paused = useRef(false);
  const drag = useRef({ down: false, x: 0, start: 0, moved: 0 });
  const snapTimer = useRef<number | undefined>(undefined);
  const stepPx = w + 22;

  const snap = (to = Math.round(rotMV.get())) =>
    animate(rotMV, to, { type: "spring", stiffness: 70, damping: 18 });

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (!paused.current && !drag.current.down) snap(Math.round(rotMV.get()) - 1);
    }, 3000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const onPointerDown = (e: React.PointerEvent) => {
    rotMV.stop();
    drag.current = { down: true, x: e.clientX, start: rotMV.get(), moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.x;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    if (drag.current.moved > 6) (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    rotMV.set(drag.current.start + dx / stepPx);
  };
  const onPointerUp = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    snap();
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical scroll stays the page's
    rotMV.stop();
    rotMV.set(rotMV.get() - e.deltaX / stepPx);
    window.clearTimeout(snapTimer.current);
    snapTimer.current = window.setTimeout(() => snap(), 140);
  };

  // the project at the top of the wheel also tints the frame background
  const topProject =
    PROJECTS[(((CENTER_PROJECT + Math.round(-rot)) % PROJECTS.length) + PROJECTS.length) % PROJECTS.length];

  // cards are indexed by an absolute position n, so the wheel loops forever
  const half = Math.floor(RING_SLOTS / 2) + 1;
  const first = Math.ceil(-rot - half);
  const last = Math.floor(-rot + half);
  const slots = Array.from({ length: last - first + 1 }, (_, i) => {
    const n = first + i;
    const project = PROJECTS[(((CENTER_PROJECT + n) % PROJECTS.length) + PROJECTS.length) % PROJECTS.length];
    return { n, k: n + rot, project };
  });

  return (
    <section id="top" ref={sectionRef} className="relative pt-[92px]">
      <div className="px-3 sm:px-4">
        {/* framed canvas */}
        <div className="relative overflow-hidden rounded-[28px] bg-black text-white">
          {/* faint backdrop: the project currently on top of the wheel, ~20% */}
          <AnimatePresence initial={false}>
            <motion.div
              key={topProject.slug}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <Image src={topProject.cover} alt="" fill sizes="100vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
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
              className="mt-4 text-[13px] font-medium leading-[1.5] text-white/60 sm:mt-[18px] sm:text-[14px]"
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
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:border-white/60"
              >
                {t.hero.seeWork}
              </a>
            </motion.div>
          </motion.div>

          {/* the wheel of work — drag / swipe / horizontal scroll to turn it */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerEnter={(e) => e.pointerType === "mouse" && (paused.current = true)}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") paused.current = false;
              onPointerUp();
            }}
            onWheel={onWheel}
            dir="ltr"
            className="relative mt-[clamp(2rem,5vw,3.5rem)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
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
                {slots.map(({ n, k, project }) => (
                  <div
                    key={n}
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
                      draggable={false}
                      onClick={(e) => drag.current.moved > 6 && e.preventDefault()}
                      className="group block h-full transition-transform duration-500 ease-[var(--ease-editorial)] hover:-translate-y-3"
                    >
                      <div className="relative h-full overflow-hidden rounded-[18px] border border-white/10 bg-black">
                        <Image
                          src={project.cover}
                          alt={project.title}
                          fill
                          priority={Math.abs(k) <= 2}
                          draggable={false}
                          sizes="240px"
                          className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-[1.05]"
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
