"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Ticker from "@/components/ui/Ticker";
import { useLanguage } from "@/components/Providers";

export default function Process() {
  const [open, setOpen] = useState(0);
  const { t } = useLanguage();

  return (
    <section id="process" className="bg-ink text-paper">
      <div className="container-editorial grid grid-cols-1 gap-12 py-[clamp(5rem,11vw,9rem)] lg:grid-cols-12 lg:gap-10">
        {/* sticky headline */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow text-cyan">{t.process.label}</span>
            <h2 className="font-display fluid-lg display-tight mt-6 font-extrabold uppercase tracking-[-0.04em]">
              {t.process.headLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <span className="block text-cyan">{t.process.headHighlight}</span>
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-paper/60">{t.process.intro}</p>
          </div>
        </div>

        {/* accordion timeline */}
        <div className="lg:col-span-7">
          <ul className="border-t border-line-dark">
            {t.process.steps.map((step, i) => {
              const isOpen = open === i;
              const n = `0${i + 1}`;
              return (
                <li key={step.title} className="border-b border-line-dark">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-5 py-7 text-start transition-colors duration-300"
                  >
                    <span
                      className={`font-display text-sm font-medium tabular-nums transition-colors duration-300 ${
                        isOpen ? "text-cyan" : "text-paper/40"
                      }`}
                    >
                      {n}
                    </span>
                    <span
                      className={`font-display flex-1 text-[clamp(1.5rem,3vw,2.4rem)] font-semibold tracking-[-0.03em] transition-colors duration-300 ${
                        isOpen ? "text-paper" : "text-paper/70 group-hover:text-paper"
                      }`}
                    >
                      {step.title}
                    </span>
                    <ArrowUpRight
                      size={24}
                      className={`shrink-0 transition-all duration-500 ${
                        isOpen ? "rotate-90 text-cyan" : "text-paper/40 group-hover:text-paper"
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-8 ps-[3.1rem] text-[0.95rem] leading-relaxed text-paper/65">
                          {step.copy}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* transformation banner */}
      <div className="bg-cyan py-5 text-black">
        <Ticker
          text={t.process.ticker}
          separator={<span className="text-black/40">✕</span>}
          className="font-display text-[clamp(1.4rem,3.4vw,2.4rem)] font-extrabold uppercase tracking-[-0.02em]"
        />
      </div>
    </section>
  );
}
