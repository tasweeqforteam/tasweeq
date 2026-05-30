"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "@/components/ui/CountUp";
import { useLanguage } from "@/components/Providers";

const VALUES: { value: number; decimals?: number; suffix: string }[] = [
  { value: 15, suffix: "+" },
  { value: 4, suffix: "+" },
  { value: 90, suffix: "%" },
  { value: 0, suffix: "" }, // 24/7 is static
];

function FadeInOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Metrics() {
  const { t } = useLanguage();

  return (
    <section id="services" className="bg-paper py-[clamp(5rem,11vw,9rem)]">
      <div className="container-editorial">
        {/* header row */}
        <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <span className="eyebrow text-gray-1">{t.metrics.label}</span>
          <h2 className="font-display max-w-xl text-end text-[clamp(1.6rem,3.2vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.03em] md:text-balance">
            {t.metrics.heading}
          </h2>
        </div>

        {/* metrics grid */}
        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {t.metrics.items.map((m, i) => (
            <FadeInOnScroll key={m.title} className="border-t border-ink pt-5" delay={i * 0.1}>
              <div className="font-display fluid-stat display-tight font-extrabold tracking-[-0.04em] text-ink">
                {VALUES[i].value > 0 ? (
                  <CountUp
                    value={VALUES[i].value}
                    decimals={VALUES[i].decimals}
                    suffix={VALUES[i].suffix}
                  />
                ) : (
                  <span>24/7</span>
                )}
              </div>
              <h3 className="mt-5 text-base font-semibold text-ink">{m.title}</h3>
              <p className="mt-1.5 max-w-[20ch] text-sm leading-relaxed text-gray-1">{m.copy}</p>
            </FadeInOnScroll>
          ))}
        </div>

        {/* operational pillars */}
        <div className="mt-20 grid grid-cols-2 border-t border-line md:grid-cols-4">
          {t.metrics.pillars.map((p, i) => (
            <div
              key={p}
              className="flex items-baseline gap-3 border-b border-line py-6 md:border-b-0 md:border-e md:last:border-e-0 md:pe-6"
            >
              <span className="eyebrow text-gray-2">0{i + 1}</span>
              <span className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
