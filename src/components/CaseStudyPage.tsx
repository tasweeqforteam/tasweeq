"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/ui/Logo";
import RevealText from "@/components/ui/RevealText";
import { useLanguage } from "@/components/Providers";
import { caseStudies, caseStudyI18n } from "@/lib/case-studies";
import { fadeUp, stagger } from "@/lib/motion";
import { useInViewNative } from "@/lib/useInViewNative";

const NEEMO_SLIDES = Array.from({ length: 33 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/work/neemo/neemo-${n}.png`;
});

type Props = { slug: "sakan" | "neemo" };

export default function CaseStudyPage({ slug }: Props) {
  const { lang, dir } = useLanguage();
  const dict = caseStudyI18n[lang];
  const studies = caseStudies[lang];
  const study = studies.find((s) => s.slug === slug)!;
  const otherStudy = studies.find((s) => s.slug !== slug)!;

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
      <main className="min-h-dvh pt-[84px]">
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
              className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-gray-1 transition-colors hover:text-ink"
            >
              <BackArrow size={16} className="transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
              {dict.backLabel}
            </Link>

            {/* eyebrow */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="eyebrow block"
              style={{ color: study.accentColor }}
            >
              {lang === "en" ? `CASE STUDY 0${slug === "sakan" ? 1 : 2}` : `دراسة حالة 0${slug === "sakan" ? 1 : 2}`}
            </motion.span>

            {/* title */}
            <RevealText
              as="h1"
              forceEn
              lines={[slug === "sakan" ? "Sakan" : "Neemo"]}
              className="font-display fluid-xl display-tight mt-4 font-extrabold uppercase text-ink"
            />

            {/* Arabic name */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-2 text-3xl font-black"
              style={{ color: study.accentColor, fontFamily: "var(--font-serif), serif" }}
            >
              {slug === "sakan" ? "سكن" : "نيمو"}
            </motion.p>

            {/* subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-3 text-sm text-gray-1"
            >
              {study.meta.industry}
            </motion.p>

            {/* meta grid */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {metaEntries.map((m) => (
                <motion.div
                  key={m.label}
                  variants={fadeUp}
                  className="rounded-[2px] border border-line bg-paper p-5"
                >
                  <span className="eyebrow text-gray-2">{m.label}</span>
                  <p className="mt-2 text-sm font-semibold text-ink">{m.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* action link */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8"
            >
              <a
                href={study.brandBookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:opacity-90"
                style={{ backgroundColor: study.accentColor }}
              >
                {dict.viewBrandbook}
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>

          {/* accent divider */}
          <div className="h-[3px]" style={{ backgroundColor: study.accentColor }} />
        </section>

        {/* ─── Brief ─── */}
        <Section title={dict.briefTitle} accent={study.accentColor} index="01">
          {study.brief.map((p, i) => (
            <p key={i} className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-gray-1 first:mt-0">
              {p}
            </p>
          ))}
        </Section>

        {/* ─── Challenge ─── */}
        <Section title={dict.challengeTitle} accent={study.accentColor} index="02" dark>
          {study.challenge.map((p, i) => (
            <p key={i} className="mt-4 max-w-3xl text-[0.95rem] leading-relaxed text-paper/70 first:mt-0">
              {p}
            </p>
          ))}
        </Section>

        {/* ─── Thinking ─── */}
        <Section title={dict.thinkingTitle} accent={study.accentColor} index="03">
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
                <span className="shrink-0 font-display text-sm font-bold tabular-nums" style={{ color: study.accentColor }}>
                  0{i + 1}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Section>

        {/* ─── Deliverables ─── */}
        <Section title={dict.deliveredTitle} accent={study.accentColor} index="04" dark>
          <div className="mt-2 overflow-hidden rounded-[3px] border border-line-dark">
            {/* header row */}
            <div className="grid grid-cols-[140px_1fr] border-b border-line-dark sm:grid-cols-[200px_1fr]" style={{ backgroundColor: study.accentColor }}>
              <div className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-black">{dict.deliverableCol}</div>
              <div className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-black">{dict.detailCol}</div>
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
        <Section title={dict.outcomeTitle} accent={study.accentColor} index="05">
          <p className="max-w-3xl text-[0.95rem] leading-relaxed text-gray-1">{study.outcome.intro}</p>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {study.outcome.points.map((p, i) => (
              <div key={i} className="rounded-[2px] border border-line p-6">
                <span className="font-display text-2xl font-extrabold tabular-nums" style={{ color: study.accentColor }}>
                  0{i + 1}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-gray-1">{p}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── Design Decision ─── */}
        <section className="py-[clamp(3rem,7vw,6rem)]" style={{ backgroundColor: study.accentColor }}>
          <div className="container-editorial">
            <span className="eyebrow text-black/60">{dict.designDecisionLabel}</span>
            <h3 className="font-display mt-4 max-w-2xl text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-black">
              {study.designDecision.title}
            </h3>
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-black/75">
              {study.designDecision.body}
            </p>
          </div>
        </section>

        {/* ─── Presentation Gallery (Neemo only) ─── */}
        {slug === "neemo" && (
          <section className="bg-ink py-[clamp(3rem,6vw,5rem)]">
            <div className="container-editorial mb-10">
              <span className="eyebrow text-gray-2">
                {lang === "en" ? "Brand Presentation" : "عرض الهوية البصرية"}
              </span>
              <h2 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-[-0.03em] text-paper">
                {lang === "en" ? "Full Slide Deck" : "ملف العرض الكامل"}
              </h2>
            </div>
            <div className="container-editorial flex flex-col gap-8">
              {NEEMO_SLIDES.map((src, i) => (
                <GallerySlide
                  key={src}
                  src={src}
                  alt={`Neemo brand presentation slide ${i + 1}`}
                  priority={i < 2}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── Brandbook CTA ─── */}
        <section className="border-t border-line bg-paper py-[clamp(3rem,6vw,5rem)]">
          <div className="container-editorial flex flex-col items-center gap-6 text-center">
            <span className="eyebrow text-gray-2">{lang === "en" ? "Full Brand System" : "نظام العلامة الكامل"}</span>
            <a
              href={study.brandBookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold text-paper transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: study.accentColor }}
            >
              {dict.viewBrandbook}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        {/* ─── Next Project ─── */}
        <section className="border-t border-line bg-paper py-[clamp(4rem,9vw,7rem)]">
          <div className="container-editorial">
            <span className="eyebrow text-gray-2">{dict.nextProject}</span>
            <Link
              href={`/work/${otherStudy.slug}`}
              className="group mt-6 flex items-end justify-between gap-6"
            >
              <div>
                <h3 data-font-en className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-ink transition-colors group-hover:text-gray-1">
                  {otherStudy.slug === "sakan" ? "Sakan" : "Neemo"}
                </h3>
                <p className="mt-3 text-sm text-gray-1">{otherStudy.meta.industry}</p>
              </div>
              <ArrowUpRight
                size={36}
                className="shrink-0 text-gray-2 transition-all duration-500 group-hover:text-ink group-hover:translate-x-1 group-hover:-translate-y-1"
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
            <span className="text-xs text-gray-2" dir="ltr">
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
  accent,
  index,
  dark = false,
  children,
}: {
  title: string;
  accent: string;
  index: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`py-[clamp(3.5rem,8vw,6rem)] ${dark ? "bg-ink text-paper" : "bg-paper text-ink"}`}>
      <div className="container-editorial">
        <div className="mb-10 flex items-baseline gap-4 border-b pb-5" style={{ borderColor: dark ? "var(--line-dark)" : "var(--line)" }}>
          <span className="font-display text-sm font-bold tabular-nums" style={{ color: accent }}>
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
  const { ref, inView } = useInViewNative<HTMLDivElement>(0.15);

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
