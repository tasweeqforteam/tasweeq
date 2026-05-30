"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/Providers";

gsap.registerPlugin(ScrollTrigger);

type ProjectMeta = {
  letter: string;
  href: string;
  linkLabel: string;
  accentHover: string;
  shadowHover: string;
};

const PROJECT_META: ProjectMeta[] = [
  {
    letter: "S",
    href: "https://sakansa.com",
    linkLabel: "sakansa.com",
    accentHover: "group-hover:border-[#3f71e4] group-hover:shadow-[0_30px_80px_-30px_rgba(63,113,228,0.45)]",
    shadowHover: "group-hover:text-[#3f71e4]/[0.12]",
  },
  {
    letter: "N",
    href: "https://www.neemo-store.com",
    linkLabel: "neemo-store.com",
    accentHover: "group-hover:border-[#7F59B0] group-hover:shadow-[0_30px_80px_-30px_rgba(127,89,176,0.45)]",
    shadowHover: "group-hover:text-[#7F59B0]/[0.12]",
  },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t, dir } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const amount = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -amount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${amount()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [t]);

  return (
    <section id="work" ref={sectionRef} className="relative bg-paper lg:h-dvh lg:overflow-hidden">
      <div
        ref={trackRef}
        dir="ltr"
        className="flex h-full gap-5 overflow-x-auto px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(4rem,9vw,7rem)] [scroll-snap-type:x_mandatory] lg:items-center lg:overflow-visible lg:py-0 lg:[scroll-snap-type:none]"
      >
        {/* intro panel */}
        <div
          dir={dir}
          className="flex w-[78vw] shrink-0 snap-start flex-col justify-center pe-6 [scroll-snap-align:start] sm:w-[420px] lg:w-[34vw] lg:pe-12"
        >
          <span className="eyebrow text-gray-1">{t.showcase.label}</span>
          <h2 className="font-display fluid-lg display-tight mt-6 font-extrabold uppercase tracking-[-0.04em] text-ink">
            {t.showcase.headLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-gray-1">{t.showcase.intro}</p>
        </div>

        {/* case cards — only Sakan & Neemo */}
        {t.showcase.projects.map((p, i) => {
          const meta = PROJECT_META[i];
          return (
            <article
              key={p.title}
              dir={dir}
              className={`group relative flex h-[clamp(420px,70vh,640px)] w-[82vw] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[3px] border border-line bg-paper p-7 transition-all duration-500 ease-[var(--ease-editorial)] [scroll-snap-align:center] sm:w-[460px] lg:w-[42vw] lg:max-w-[640px] ${meta.accentHover}`}
            >
              {/* giant letter */}
              <span
                aria-hidden="true"
                dir="ltr"
                data-font-en
                className={`pointer-events-none absolute -bottom-[6%] end-[-2%] select-none font-display text-[clamp(16rem,34vw,30rem)] font-extrabold leading-none tracking-[-0.06em] text-ink/[0.04] transition-all duration-700 ease-[var(--ease-editorial)] ${meta.shadowHover}`}
              >
                {meta.letter}
              </span>

              <div className="relative z-10 flex items-center justify-between">
                <span className="eyebrow text-gray-1">{p.tag}</span>
                <span className="font-display text-sm font-medium tabular-nums text-gray-2">
                  0{i + 1}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold tracking-[-0.04em] text-ink">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-gray-1">{p.copy}</p>
                <Link
                  href={`/work/${["sakan", "neemo"][i]}`}
                  className="group/link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink"
                >
                  <span className="link-reveal">{t.showcase.caseStudy}</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </Link>
              </div>
            </article>
          );
        })}

        {/* end panel */}
        <div
          dir={dir}
          className="flex w-[70vw] shrink-0 snap-center flex-col justify-center ps-2 [scroll-snap-align:center] sm:w-[360px] lg:w-[30vw]"
        >
          <a href="#contact" className="group inline-flex flex-col gap-4">
            <span className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-ink">
              {t.showcase.endLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </span>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform duration-300 group-hover:scale-[1.03]">
              {t.showcase.startProject} <ArrowUpRight size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
