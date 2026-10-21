"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useBrief, WHATSAPP } from "@/components/Brief";
import { useLanguage } from "@/components/Providers";
import { gtmEvent } from "@/lib/gtm";
import { fadeUp, stagger } from "@/lib/motion";
import { PROJECTS } from "@/lib/projects";

export default function Showcase() {
  const { t } = useLanguage();
  const { openBrief } = useBrief();

  return (
    <section id="work" className="relative bg-paper pb-[clamp(4rem,9vw,7rem)] pt-[clamp(3rem,6vw,5rem)]">
      <div className="container-editorial">
        {/* header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow inline-flex items-center gap-2 text-gray-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              {t.showcase.label}
            </span>
            <h2 className="font-display mt-4 text-[clamp(2rem,4.4vw,3.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-ink">
              {t.showcase.headLines.join(" ")}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-gray-1">{t.showcase.intro}</p>
        </div>

        {/* bento */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-2 lg:grid-cols-6"
        >
          {PROJECTS.map((meta, i) => {
            const p = t.showcase.projects[i];
            const big = i < 2;
            return (
              <motion.article
                key={meta.slug}
                variants={fadeUp}
                className={`group ${big ? "lg:col-span-3" : "lg:col-span-2"}`}
              >
                <Link href={`/work/${meta.slug}`} className="block">
                  <div
                    className={`relative overflow-hidden rounded-[20px] bg-ink ${big ? "aspect-[5/4]" : "aspect-[4/5]"}`}
                  >
                    <Image
                      src={meta.cover}
                      alt={p.title}
                      fill
                      sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
                      className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute start-4 top-4 rounded-full bg-white px-3 py-1 text-[0.72rem] font-semibold text-black">
                      {p.tag}
                    </span>
                    <span className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan text-black transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-display flex items-center gap-3 text-[clamp(1.5rem,2.2vw,2rem)] font-extrabold tracking-[-0.04em] text-ink">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: meta.accent }} />
                        {p.title}
                      </h3>
                      <p className={`mt-2 text-[0.92rem] leading-relaxed text-gray-1 ${big ? "line-clamp-2 max-w-lg" : "line-clamp-3"}`}>
                        {p.copy}
                      </p>
                    </div>
                    <span className="font-display shrink-0 pt-2 text-sm font-medium tabular-nums text-gray-2">
                      0{i + 1}
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        {/* end CTA */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[20px] bg-cyan p-8 text-black sm:flex-row sm:items-center">
          <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
            {t.showcase.endLines.join(" ")}
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openBrief({ source: "work_cta" })}
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              {t.showcase.startProject} <ArrowUpRight size={16} />
            </button>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gtmEvent("whatsapp_click", { location: "work_cta" })}
              className="inline-flex items-center gap-2 rounded-full border border-black/25 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-black"
            >
              <WhatsAppIcon size={16} /> {t.intro.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
