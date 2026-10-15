"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/ui/Logo";
import RevealText from "@/components/ui/RevealText";
import { useLanguage } from "@/components/Providers";
import { caseStudies, caseStudyI18n } from "@/lib/case-studies";
import { accentVars } from "@/lib/contrast";
import { useEffect, useRef, useState } from "react";

const NEEMO_SLIDES = Array.from({ length: 34 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/work/neemo/neemo-${n}.png`;
});

const SAKAN_SLIDES = Array.from({ length: 27 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/work/sakan/sakan-${n}.png`;
});

const MAWAEIDK_SLIDES = Array.from({ length: 21 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/work/mawaeidk/mawaeidk-${n}.png`;
});

const GALLERY_SLIDES: Record<string, string[]> = {
  neemo: NEEMO_SLIDES,
  sakan: SAKAN_SLIDES,
  mawaeidk: MAWAEIDK_SLIDES,
};

const TITLES: Record<"sakan" | "neemo" | "mawaeidk", string> = {
  sakan: "Sakan",
  neemo: "Neemo",
  mawaeidk: "Mawaeidk",
};

const ARABIC_NAMES: Record<"sakan" | "neemo" | "mawaeidk", string> = {
  sakan: "سكن",
  neemo: "نيمو",
  mawaeidk: "مواعيدك",
};

type Props = { slug: "sakan" | "neemo" | "mawaeidk" };

export default function CaseStudyPage({ slug }: Props) {
  const { lang, dir } = useLanguage();
  const dict = caseStudyI18n[lang];
  const studies = caseStudies[lang];
  const study = studies.find((s) => s.slug === slug)!;
  const studyIndex = studies.findIndex((s) => s.slug === slug);
  const otherStudy = studies[(studyIndex + 1) % studies.length];

  const metaEntries = [
    { label: dict.deliverableCol === "Deliverable" ? "Project Type" : "نوع المشروع", value: study.meta.type },
    { label: dict.deliverableCol === "Deliverable" ? "Industry" : "القطاع", value: study.meta.industry },
    { label: dict.deliverableCol === "Deliverable" ? "Scope" : "النطاق", value: study.meta.scope },
    { label: dict.deliverableCol === "Deliverable" ? "Duration" : "المدة", value: study.meta.duration },
  ];

  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <>
      <Navbar />
      <main className="min-h-dvh pt-[84px]" style={accentVars(study.accentColor)}>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden bg-paper">
          {/* giant letter watermark */}
          <span
            aria-hidden="true"
            data-font-en
            className="pointer-events-none absolute -bottom-[10%] end-[-4%] select-none font-display text-[clamp(20rem,45vw,42rem)] font-extrabold leading-none tracking-[-0.06em] text-ink/[0.03]"
          >
            {study.letter}
          </span>

          <div className="container-editorial relative z-10 pb-16 pt-10">
            {/* back link */}
            <Link
              href="/#work"
              className="group mb-11 inline-flex items-center gap-2 py-1 text-sm font-medium text-gray-1 transition-colors hover:text-ink"
            >
              <BackArrow size={16} className="transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
              {dict.backLabel}
            </Link>

            {/* eyebrow */}
            <span className="rise-in eyebrow accent-on-paper block">
              {lang === "en" ? `CASE STUDY 0${studyIndex + 1}` : `دراسة حالة 0${studyIndex + 1}`}
            </span>

            {/* title */}
            <RevealText
              as="h1"
              trigger="load"
              forceEn
              lines={[TITLES[slug]]}
              className="font-display fluid-xl display-tight mt-4 font-extrabold uppercase text-ink"
            />

            {/* Arabic name */}
            <p
              className="rise-in accent-on-paper mt-2 text-3xl font-black"
              style={{ fontFamily: "var(--font-serif), serif", animationDelay: "0.4s" }}
            >
              {ARABIC_NAMES[slug]}
            </p>

            {/* subtitle */}
            <p className="rise-in mt-3 text-sm text-gray-1" style={{ animationDelay: "0.5s" }}>
              {study.meta.industry}
            </p>

            {/* meta grid */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metaEntries.map((m, i) => (
                <div
                  key={m.label}
                  className="rise-in rounded-[2px] border border-line bg-paper p-5"
                  style={{ animationDelay: `${0.55 + i * 0.08}s` }}
                >
                  <span className="eyebrow text-gray-1">{m.label}</span>
                  <p className="mt-2 text-sm font-semibold text-ink">{m.value}</p>
                </div>
              ))}
            </div>

            {/* action link */}
            <div className="rise-in mt-8" style={{ animationDelay: "0.7s" }}>
              <a
                href={study.brandBookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "var(--accent-surface)" }}
              >
                {dict.viewBrandbook}
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* accent divider */}
          <div className="h-[3px]" style={{ backgroundColor: study.accentColor }} />
        </section>

        {/* ─── Brief ─── */}
        <Section title={dict.briefTitle} index="01">
          {study.brief.map((p, i) => (
            <p key={i} className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-gray-1 first:mt-0">
              {p}
            </p>
          ))}
        </Section>

        {/* ─── Challenge ─── */}
        <Section title={dict.challengeTitle} index="02" dark>
          {study.challenge.map((p, i) => (
            <p key={i} className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-paper/70 first:mt-0">
              {p}
            </p>
          ))}
        </Section>

        {/* ─── Thinking ─── */}
        <Section title={dict.thinkingTitle} index="03">
          {study.thinking.intro && (
            <p className="max-w-3xl text-[0.95rem] leading-relaxed text-gray-1">{study.thinking.intro}</p>
          )}
          <ul className="mt-8 space-y-4">
            {study.thinking.points.map((p, i) => (
              <li
                key={i}
                className="flex gap-4 border-s-2 ps-5 text-[0.95rem] leading-relaxed text-gray-1"
                style={{ borderColor: study.accentColor }}
              >
                <span className="accent-on-paper shrink-0 font-display text-sm font-bold tabular-nums">
                  0{i + 1}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Section>

        {/* ─── Deliverables ─── */}
        <Section title={dict.deliveredTitle} index="04" dark>
          <div className="mt-2 overflow-hidden rounded-[3px] border border-line-dark">
            {/* header row */}
            <div className="grid grid-cols-[140px_1fr] border-b border-line-dark sm:grid-cols-[200px_1fr]" style={{ backgroundColor: "var(--accent-surface)" }}>
              <div className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">{dict.deliverableCol}</div>
              <div className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">{dict.detailCol}</div>
            </div>
            {study.deliverables.map((d, i) => (
              <div
                key={d.name}
                className={`grid grid-cols-[140px_1fr] border-b border-line-dark last:border-b-0 sm:grid-cols-[200px_1fr] ${
                  i % 2 === 0 ? "bg-ink" : "bg-ink/80"
                }`}
              >
                <div className="px-5 py-4 text-sm font-semibold text-paper">{d.name}</div>
                <div className="px-5 py-4 text-sm leading-relaxed text-paper/70">{d.detail}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── Outcome ─── */}
        <Section title={dict.outcomeTitle} index="05">
          <p className="max-w-3xl text-[0.95rem] leading-relaxed text-gray-1">{study.outcome.intro}</p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {study.outcome.points.map((p, i) => (
              <div key={i} className="rounded-[2px] border border-line p-6">
                <span className="accent-on-paper font-display text-2xl font-extrabold tabular-nums">
                  0{i + 1}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-gray-1">{p}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── Design Decision ─── */}
        <section className="py-[clamp(3rem,7vw,6rem)]" style={{ backgroundColor: "var(--accent-surface)" }}>
          <div className="container-editorial">
            <span className="eyebrow text-white">{dict.designDecisionLabel}</span>
            <h3 className="font-display mt-4 max-w-2xl text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-white">
              {study.designDecision.title}
            </h3>
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-white">
              {study.designDecision.body}
            </p>
          </div>
        </section>

        {/* ─── Presentation Gallery ─── */}
        {GALLERY_SLIDES[slug] && (
          <section className="bg-ink py-[clamp(3rem,6vw,5rem)]">
            <div className="container-editorial mb-10">
              <span className="eyebrow text-paper/60">
                {lang === "en" ? "Brand Presentation" : "عرض الهوية البصرية"}
              </span>
              <h2 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-[-0.03em] text-paper">
                {lang === "en" ? "Full Slide Deck" : "ملف العرض الكامل"}
              </h2>
            </div>
            <div className="container-editorial flex flex-col gap-8">
              {GALLERY_SLIDES[slug].map((src, i) => (
                <GallerySlide
                  key={src}
                  src={src}
                  alt={`${study.slug} brand presentation slide ${i + 1}`}
                  priority={i < 2}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── Brandbook CTA ─── */}
        <section className="border-t border-line bg-paper py-[clamp(3rem,6vw,5rem)]">
          <div className="container-editorial flex flex-col items-center gap-6 text-center">
            <span className="eyebrow text-gray-1">{lang === "en" ? "Full Brand System" : "نظام العلامة الكامل"}</span>
            <a
              href={study.brandBookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: "var(--accent-surface)" }}
            >
              {dict.viewBrandbook}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        {/* ─── Next Project ─── */}
        <section className="border-t border-line bg-paper py-[clamp(4rem,9vw,7rem)]">
          <div className="container-editorial">
            <span className="eyebrow text-gray-1">{dict.nextProject}</span>
            <Link
              href={`/work/${otherStudy.slug}`}
              className="group mt-6 flex items-end justify-between gap-6"
            >
              <div>
                <h3 data-font-en className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-ink transition-colors group-hover:text-gray-1">
                  {TITLES[otherStudy.slug]}
                </h3>
                <p className="mt-3 text-sm text-gray-1">{otherStudy.meta.industry}</p>
              </div>
              <ArrowUpRight
                size={36}
                className="shrink-0 text-gray-1 transition-all duration-500 group-hover:text-ink group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </section>

        {/* ─── Footer mini ─── */}
        <footer className="border-t border-line bg-paper py-8">
          <div className="container-editorial flex items-center justify-between">
            <Link href="/" className="text-ink">
              <Logo />
            </Link>
            <span className="text-xs text-gray-1" dir="ltr">
              &copy; 2022 TASWEEQ
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ─── Section wrapper ─── */
function Section({
  title,
  index,
  dark = false,
  children,
}: {
  title: string;
  index: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`py-[clamp(3.5rem,8vw,6rem)] ${dark ? "bg-ink text-paper" : "bg-paper text-ink"}`}>
      <div className="container-editorial">
        <div className="mb-10 flex items-baseline gap-4 border-b pb-5" style={{ borderColor: dark ? "var(--line-dark)" : "var(--line)" }}>
          <span className={`font-display text-sm font-bold tabular-nums ${dark ? "accent-on-ink" : "accent-on-paper"}`}>
            {index}
          </span>
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-[-0.03em]">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ─── Gallery slide: scroll-reveal image ─── */
function GallerySlide({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-[4px]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(48px) scale(0.97)",
        transition:
          "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        sizes="(min-width: 1600px) 1600px, 100vw"
        className="h-auto w-full object-contain"
        priority={priority}
      />
    </div>
  );
}
