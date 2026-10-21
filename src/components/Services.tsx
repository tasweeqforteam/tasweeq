"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useBrief } from "@/components/Brief";
import { useLanguage } from "@/components/Providers";
import { fadeUp, stagger } from "@/lib/motion";

/** Compact offer strip right after the hero. Every card is a shortcut into the brief with that service picked. */
export default function Services() {
  const { t } = useLanguage();
  const { openBrief } = useBrief();

  return (
    <section id="services" className="bg-paper pt-[clamp(3.5rem,7vw,5.5rem)]">
      <div className="container-editorial">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow inline-flex items-center gap-2 text-gray-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              {t.services.label}
            </span>
            <h2 className="font-display mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
              {t.services.heading}
            </h2>
          </div>
        </div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {t.services.items.map((s, i) => (
            <motion.li key={s} variants={fadeUp}>
              <button
                type="button"
                onClick={() => openBrief({ service: i, source: "services_strip" })}
                className="group flex w-full items-center justify-between gap-4 rounded-[18px] border border-line bg-paper px-5 py-5 text-start transition-colors duration-300 hover:border-ink"
              >
                <span className="flex items-center gap-4">
                  <span className="font-display text-sm font-medium tabular-nums text-gray-2">0{i + 1}</span>
                  <span className="font-display text-[1.25rem] font-bold tracking-[-0.02em] text-ink">{s}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink/[0.06] px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-300 group-hover:bg-cyan group-hover:text-black">
                  {t.services.request}
                  <ArrowUpRight size={14} />
                </span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
