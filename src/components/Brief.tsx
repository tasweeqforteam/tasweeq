"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useLanguage } from "@/components/Providers";
import { gtmEvent } from "@/lib/gtm";

export const WHATSAPP = "201014300054";

type BriefCtx = { openBrief: (opts?: { service?: number; source?: string }) => void };
const Ctx = createContext<BriefCtx | null>(null);

export function useBrief() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBrief must be used within BriefProvider");
  return c;
}

/** Lightweight "start a project" flow: services → brand → notes → WhatsApp with a ready message. */
export default function BriefProvider({ children }: { children: React.ReactNode }) {
  const { t, dir } = useLanguage();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [brand, setBrand] = useState("");
  const [notes, setNotes] = useState("");
  const [tried, setTried] = useState(false);
  const source = useRef("unknown");
  const panelRef = useRef<HTMLDivElement>(null);

  const openBrief = useCallback((opts?: { service?: number; source?: string }) => {
    source.current = opts?.source ?? "unknown";
    if (opts?.service !== undefined) setPicked([opts.service]);
    setTried(false);
    setOpen(true);
    gtmEvent("brief_open", { location: source.current });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    const id = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("button[data-chip]")?.focus(), 350);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.clearTimeout(id);
    };
  }, [open]);

  const toggle = (i: number) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const send = () => {
    if (!picked.length) {
      setTried(true);
      return;
    }
    const services = picked.map((i) => t.services.items[i]);
    const details = [
      `• ${t.brief.msgServices}: ${services.join("، ")}`,
      brand.trim() && `• ${t.brief.msgBrand}: ${brand.trim()}`,
      notes.trim() && `• ${t.brief.msgNotes}: ${notes.trim()}`,
    ].filter(Boolean);
    const text = [t.brief.msgHello, "", ...details].join("\n");
    gtmEvent("brief_submit", { location: source.current, services: services.join(" | ") });
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <Ctx.Provider value={{ openBrief }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/70"
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="brief-title"
              dir={dir}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[22px] bg-paper p-6 text-ink sm:max-w-[560px] sm:rounded-[22px] sm:p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 id="brief-title" className="font-display text-[1.9rem] font-extrabold tracking-[-0.03em]">
                    {t.brief.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-1">{t.brief.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 1 — services */}
              <fieldset className="mt-7">
                <legend className="text-sm font-semibold">
                  <span className="me-2 tabular-nums text-gray-2">01</span>
                  {t.brief.q1}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.services.items.map((s, i) => {
                    const on = picked.includes(i);
                    return (
                      <button
                        key={s}
                        type="button"
                        data-chip
                        aria-pressed={on}
                        onClick={() => toggle(i)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          on ? "border-cyan bg-cyan text-black" : "border-line text-ink hover:border-ink"
                        }`}
                      >
                        {on && <Check size={14} />}
                        {s}
                      </button>
                    );
                  })}
                </div>
                {tried && !picked.length && <p className="mt-2 text-sm text-[#e5484d]">{t.brief.pick}</p>}
              </fieldset>

              {/* 2 — brand */}
              <label className="mt-6 block">
                <span className="text-sm font-semibold">
                  <span className="me-2 tabular-nums text-gray-2">02</span>
                  {t.brief.q2}
                </span>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={t.brief.q2ph}
                  className="mt-2 w-full rounded-[12px] border border-line bg-transparent px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-gray-2 focus:border-ink"
                />
              </label>

              {/* 3 — notes */}
              <label className="mt-5 block">
                <span className="text-sm font-semibold">
                  <span className="me-2 tabular-nums text-gray-2">03</span>
                  {t.brief.q3}
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.brief.q3ph}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-[12px] border border-line bg-transparent px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-gray-2 focus:border-ink"
                />
              </label>

              <button
                type="button"
                onClick={send}
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#29a71a] px-6 py-4 text-base font-semibold text-white transition-transform duration-300 hover:scale-[1.01]"
              >
                <WhatsAppIcon size={22} />
                {t.brief.send}
              </button>
              <p className="mt-3 text-center text-xs text-gray-1">{t.brief.note}</p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-5 text-sm">
                <span className="text-gray-1">{t.brief.or}</span>
                <a href="tel:+201014300054" dir="ltr" className="link-reveal font-medium" onClick={() => gtmEvent("call_click", { location: "brief" })}>
                  +20 101 4300 054
                </a>
                <a href="mailto:tasweeqforall@gmail.com" className="inline-flex items-center gap-1 font-medium link-reveal">
                  Email <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
