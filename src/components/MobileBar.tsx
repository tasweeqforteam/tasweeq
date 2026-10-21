"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { useBrief, WHATSAPP } from "@/components/Brief";
import { useLanguage } from "@/components/Providers";
import { gtmEvent } from "@/lib/gtm";

/** Sticky mobile action bar: the fastest path to a request, always one tap away after the hero. */
export default function MobileBar() {
  const { t } = useLanguage();
  const { openBrief } = useBrief();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-full border border-line bg-paper/95 p-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden"
        >
          <button
            type="button"
            onClick={() => openBrief({ source: "mobile_bar" })}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cyan py-3 text-sm font-semibold text-black"
          >
            {t.cta.start} <ArrowUpRight size={16} />
          </button>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            onClick={() => gtmEvent("whatsapp_click", { location: "mobile_bar" })}
            className="flex w-12 items-center justify-center rounded-full bg-[#29a71a] text-white"
          >
            <WhatsAppIcon size={22} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
