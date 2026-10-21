"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useLanguage, useTheme } from "@/components/Providers";
import { gtmEvent } from "@/lib/gtm";
import { useBrief } from "@/components/Brief";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { openBrief } = useBrief();

  const LINKS = [
    { label: t.nav.services, href: "/#services" },
    { label: t.nav.work, href: "/#work" },
    { label: t.nav.process, href: "/#process" },
    { label: t.nav.contact, href: "/#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const IconBtn = ({
    onClick,
    label,
    children,
  }: {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-line px-2.5 text-[0.78rem] font-semibold text-ink transition-colors duration-300 hover:border-ink"
    >
      {children}
    </button>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-4">
        <div
          className={`mx-auto flex h-[64px] max-w-[1180px] items-center justify-between rounded-full border ps-6 pe-2 transition-all duration-500 ease-[var(--ease-editorial)] ${
            scrolled
              ? "border-line bg-paper/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl"
              : "border-line bg-paper"
          }`}
        >
          <a href="/" aria-label="TASWEEQ — home" className="text-ink">
            <Logo />
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-reveal text-[0.82rem] font-medium tracking-[0.01em] text-gray-1 transition-colors duration-300 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <IconBtn onClick={toggleTheme} label="Toggle color theme">
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </IconBtn>
            <IconBtn onClick={toggleLang} label="Toggle language">
              {lang === "en" ? "ع" : "EN"}
            </IconBtn>
            <button
              type="button"
              onClick={() => openBrief({ source: "nav_cta" })}
              className="group ms-1 hidden items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-[0.82rem] font-semibold text-black transition-transform duration-300 hover:scale-[1.03] sm:inline-flex"
            >
              {t.cta.start}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
              />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center text-ink lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Floating WhatsApp — visible on all screens after scroll */}
      <AnimatePresence>
        {scrolled && !open && (
          <motion.a
            href="https://wa.me/201014300054"
            target="_blank"
            rel="noopener noreferrer"
            data-gtm="whatsapp_click"
            data-gtm-location="floating_button"
            onClick={() => gtmEvent("whatsapp_click", { location: "floating_button" })}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            aria-label="WhatsApp"
            className="fixed bottom-6 end-6 z-40 hidden h-14 w-14 lg:flex items-center justify-center rounded-full bg-[#29a71a] text-white shadow-[0_8px_30px_-6px_rgba(41,167,26,0.6)] transition-transform duration-300 hover:scale-110"
          >
            <WhatsAppIcon size={28} />
          </motion.a>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-ink text-paper lg:hidden"
          >
            <div className="container-editorial flex h-[84px] items-center justify-between">
              <span className="text-paper">
                <Logo />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="container-editorial mt-10 flex flex-col gap-2" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.5 }}
                  className="font-display text-5xl font-semibold tracking-[-0.03em] text-paper"
                >
                  {l.label}
                </motion.a>
              ))}
              <button
                type="button"
                onClick={() => { setOpen(false); openBrief({ source: "mobile_menu" }); }}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-black"
              >
                {t.cta.start} <ArrowUpRight size={16} />
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
