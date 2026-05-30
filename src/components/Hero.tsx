"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import RevealText from "@/components/ui/RevealText";
import { useLanguage } from "@/components/Providers";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const watermarkX = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-[84px]"
    >
      {/* Ultra-faint watermark */}
      <motion.span
        aria-hidden="true"
        style={{ x: watermarkX, opacity: watermarkOpacity }}
        data-font-en
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[34vw] font-extrabold leading-none tracking-[-0.05em] text-ink/[0.035] whitespace-nowrap"
      >
        TASWEEQ
      </motion.span>

      <motion.div
        style={{ y: contentY }}
        className="container-editorial relative z-10 grid grid-cols-1 gap-8 py-12 lg:grid-cols-12 lg:items-stretch lg:gap-6"
      >
        {/* strategic cyan block (1/3) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative flex flex-col justify-between rounded-[2px] bg-cyan p-7 text-black lg:col-span-4 lg:min-h-[clamp(340px,42vw,560px)]"
        >
          <span className="eyebrow text-black/70">{t.hero.studio}</span>
          <div className="mt-10 lg:mt-0">
            <p className="font-display text-[1.55rem] font-medium leading-[1.12] tracking-[-0.02em] sm:text-[1.8rem]">
              {t.hero.leftCopy}
            </p>
            <a
              href="#services"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold"
            >
              <span className="link-reveal">{t.hero.details}</span>
              <Plus size={16} className="transition-transform duration-500 group-hover:rotate-90" />
            </a>
          </div>
        </motion.div>

        {/* massive headline (2/3) */}
        <div className="flex flex-col justify-between lg:col-span-8">
          <div className="flex items-start justify-between">
            <span className="eyebrow text-gray-1">{t.hero.tag}</span>
            <span className="eyebrow hidden text-gray-1 sm:block">{t.hero.est}</span>
          </div>

          <RevealText
            as="h1"
            align="end"
            lines={t.hero.headline}
            className="font-display fluid-xl display-tight mt-8 font-extrabold uppercase text-ink"
          />
        </div>
      </motion.div>


      {/* baseline meta row */}
      <div className="container-editorial relative z-10 mt-auto flex items-end justify-between border-t border-line pt-5 pb-8">
        <p className="max-w-xs text-[0.8rem] leading-relaxed text-gray-1">{t.hero.baseline}</p>
        <span className="hidden text-[0.8rem] text-gray-1 sm:block">{t.hero.scroll}</span>
      </div>
    </section>
  );
}
