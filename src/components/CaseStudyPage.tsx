"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/ui/Logo";
import { useLanguage } from "@/components/Providers";
import { useBrief, WHATSAPP } from "@/components/Brief";
import Flipbook from "@/components/Flipbook";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { gtmEvent } from "@/lib/gtm";
import { caseStudies, caseStudyI18n } from "@/lib/case-studies";
import { fadeUp, stagger } from "@/lib/motion";
import { PROJECTS, bookPages, getProject, type ProjectSlug } from "@/lib/projects";

type Props = { slug: ProjectSlug };

export default function CaseStudyPage({ slug }: Props) {
  const { lang, dir, t } = useLanguage();
  const { openBrief } = useBrief();
  const dict = caseStudyI18n[lang];
  const studies = caseStudies[lang];
  const study = studies.find((s) => s.slug === slug)!;
  const project = getProject(slug)!;
  const studyIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const nextProject = PROJECTS[(studyIndex + 1) % PROJECTS.length];
  const otherStudy = studies.find((s) => s.slug === nextProject.slug)!;
  const slides = useMemo(() => bookPages(project), [project]);

  const metaEntries = [
    { label: dict.deliverableCol === "Deliverable" ? "Project Type" : "نوع المشروع", value: study.meta.type },
    { label: dict.deliverableCol === "Deliverable" ? "Industry" : "القطاع", value: study.meta.industry },
    { label: dict.deliverableCol === "Deliverable" ? "Scope" : "النطاق", value: study.meta.scope },
    { label: dict.deliverableCol === "Deliverable" ? "Duration" : "المدة", value: study.meta.duration },
  ].filter((m) => m.value);

  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-black pt-[84px]">
        {/* ─── Stage: the brand book is the first thing you see ─── */}
        <section className="relative overflow-hidden bg-black text-white">
          <div className="container-editorial pb-[clamp(2.5rem,5vw,4rem)] pt-5">
            <Link
              href="/#work"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/55 transition-colors hover:text-white"
            >
              <BackArrow size={16} className="transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
              {dict.backLabel}
            </Link>

            <div className="mb-7 mt-5 flex flex-wrap items-end justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="eyebrow inline-flex items-center gap-2 text-white/55">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: study.accentColor }} />
                  {lang === "en" ? `CASE STUDY 0${studyIndex + 1}` : `دراسة حالة 0${studyIndex + 1}`} · {study.meta.industry}
                </span>
                <h1 className="font-display mt-2 flex flex-wrap items-baseline gap-x-4 text-[clamp(2rem,4vw,3.4rem)] font-extrabold">
                  <span data-font-en>{project.title}</span>
                  <span className="text-[0.55em] text-white/70" style={{ fontFamily: "var(--font-serif), serif" }}>
                    {project.titleAr}
                  </span>
                </h1>
              </motion.div>
              {study.brandBookUrl && (
                <a
                  href={study.brandBookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white"
                >
                  {dict.viewBrandbook}
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>

            {slides.length > 0 && (
              <Flipbook
                key={project.slug}
                slides={slides}
                title={`${project.title} brand identity`}
                labels={
                  lang === "en"
                    ? { prev: "Previous page", next: "Next page", hint: "Drag the page corner or swipe to flip" }
                    : { prev: "الصفحة السابقة", next: "الصفحة التالية", hint: "اسحب طرف الصفحة أو مرّر بإصبعك لتقليبها" }
                }
              />
            )}
          </div>
          <div className="h-[3px]" style={{ backgroundColor: study.accentColor }} />
        </section>

        {/* ─── Project facts ─── */}
        <section className="bg-paper py-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={`container-editorial grid grid-cols-1 gap-4 sm:grid-cols-2 ${metaEntries.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            {metaEntries.map((m) => (
              <motion.div key={m.label} variants={fadeUp} className="rounded-[2px] border border-line bg-paper p-5">
                <span className="eyebrow text-gray-2">{m.label}</span>
                <p className="mt-2 text-sm font-semibold text-ink">{m.value}</p>
              </motion.div>
            ))}
          </motion.div>
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

        {/* ─── Brandbook CTA ─── */}
        {study.brandBookUrl && <section className="border-t border-line bg-paper py-[clamp(3rem,6vw,5rem)]">
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
        </section>}

        {/* ─── Conversion CTA ─── */}
        <section className="bg-paper py-[clamp(3rem,6vw,5rem)]">
          <div className="container-editorial">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-cyan p-8 text-black md:flex-row md:items-center md:p-10">
              <div>
                <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
                  {t.caseCta.title}
                </h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-black/70">{t.caseCta.body}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openBrief({ source: `case_${slug}` })}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
                >
                  {t.cta.start} <ArrowUpRight size={16} />
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => gtmEvent("whatsapp_click", { location: `case_${slug}` })}
                  className="inline-flex items-center gap-2 rounded-full border border-black/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-black"
                >
                  <WhatsAppIcon size={17} /> {t.intro.whatsapp}
                </a>
              </div>
            </div>
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
                  {nextProject.title}
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
