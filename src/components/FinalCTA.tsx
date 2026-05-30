"use client";

import { ArrowUpRight } from "lucide-react";
import RevealText from "@/components/ui/RevealText";
import Logo from "@/components/ui/Logo";
import { useLanguage } from "@/components/Providers";

const SOCIAL_HREFS = [
  "https://www.instagram.com/tasweeq_agency/",
  "https://www.linkedin.com/in/tasweeq-agency/",
  "https://www.facebook.com/profile.php?id=100087189177148",
  "https://wa.me/201014300054",
];

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <>
      <span id="insights" className="block" aria-hidden="true" />
      <footer id="contact" className="bg-ink text-paper">
        <div className="container-editorial py-[clamp(5rem,12vw,10rem)]">
          {/* massive headline */}
          <RevealText
            as="h2"
            align="start"
            lines={t.footer.headline}
            className="font-display fluid-mega display-tight font-extrabold uppercase tracking-[-0.05em]"
          />

          {/* primary CTA */}
          <div className="mt-12">
            <a
              href="https://wa.me/201014300054"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-cyan px-8 py-4 text-base font-semibold text-black transition-transform duration-300 hover:scale-[1.02]"
            >
              {t.footer.cta}
              <ArrowUpRight size={20} />
            </a>
          </div>

          {/* supporting columns */}
          <div className="mt-24 grid grid-cols-1 gap-12 border-t border-line-dark pt-12 md:grid-cols-12">
            {/* socials + contact */}
            <div className="md:col-span-5">
              <span className="eyebrow text-paper/40">{t.footer.connect}</span>
              <ul className="mt-6 flex flex-col gap-3">
                {t.footer.socials.map((label, i) => (
                  <li key={label}>
                    <a
                      href={SOCIAL_HREFS[i]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.02em] text-paper/80 transition-colors duration-300 hover:text-cyan"
                    >
                      {label}
                      <ArrowUpRight
                        size={18}
                        className="text-paper/30 transition-colors duration-300 group-hover:text-cyan"
                      />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-10 space-y-1 text-sm text-paper/55" dir="ltr">
                <a href="mailto:tasweeqforall@gmail.com" className="link-reveal block w-fit">
                  tasweeqforall@gmail.com
                </a>
                <a href="tel:+201014300054" className="link-reveal block w-fit">
                  +20 101 4300 054
                </a>
              </div>
            </div>

            {/* services */}
            <div className="md:col-span-7">
              <span className="eyebrow text-paper/40">{t.footer.capabilities}</span>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {t.footer.services.map((s, i) => (
                  <li
                    key={s}
                    className="flex items-baseline gap-3 border-b border-line-dark py-3.5 text-paper/80"
                  >
                    <span className="text-xs tabular-nums text-paper/30">0{i + 1}</span>
                    <span className="text-[0.95rem] font-medium">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* legal row */}
          <div className="mt-20 flex flex-col gap-6 border-t border-line-dark pt-8 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-paper/70">
              <Logo />
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-paper/45">
              <span dir="ltr">{t.footer.legal.copyright}</span>
              <span className="text-paper/30">{t.footer.legal.privacy}</span>
              <span className="text-paper/30">{t.footer.legal.terms}</span>
              <a href="https://www.instagram.com/tasweeq_agency/" target="_blank" rel="noopener noreferrer" className="link-reveal hover:text-paper">
                {t.footer.socials[0]}
              </a>
              <a href="https://www.linkedin.com/in/tasweeq-agency/" target="_blank" rel="noopener noreferrer" className="link-reveal hover:text-paper">
                {t.footer.socials[1]}
              </a>
              <a href="https://www.facebook.com/profile.php?id=100087189177148" target="_blank" rel="noopener noreferrer" className="link-reveal hover:text-paper">
                {t.footer.socials[2]}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
