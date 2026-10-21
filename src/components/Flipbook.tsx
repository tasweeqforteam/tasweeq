"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PageFlip } from "page-flip/dist/js/page-flip.module.js";

type Props = {
  slides: string[];
  title: string;
  labels: { prev: string; next: string; hint: string };
};

// Widths the Next image optimizer accepts (default deviceSizes)
const WIDTHS = [640, 750, 828, 1080, 1200, 1920];
const PRELOAD_BEHIND = 2;
const PRELOAD_AHEAD = 5;

/**
 * Brand-presentation flipbook: the slides become pages of an open magazine you can drag,
 * swipe or click through. page-flip owns its DOM, so the book is built imperatively inside
 * a host div that React never re-renders.
 */
export default function Flipbook({ slides, title, labels }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const book = useRef<PageFlip | null>(null);
  const [page, setPage] = useState(0);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let pf: PageFlip | null = null;

    // pick an optimizer width that stays sharp on retina without shipping originals
    const pageCss = Math.min(820, el.clientWidth / (el.clientWidth >= 700 ? 2 : 1));
    const need = pageCss * Math.min(window.devicePixelRatio || 1, 2);
    const w = WIDTHS.find((x) => x >= need) ?? WIDTHS[WIDTHS.length - 1];
    const srcFor = (s: string) => `/_next/image?url=${encodeURIComponent(s)}&w=${w}&q=75`;

    const root = document.createElement("div");
    el.appendChild(root);
    const imgs: HTMLImageElement[] = [];
    const pages = slides.map((s, i) => {
      const p = document.createElement("div");
      p.className = "flip-page";
      if (i === 0 || i === slides.length - 1) p.dataset.density = "hard";
      const img = document.createElement("img");
      img.alt = `${title} — ${i + 1}`;
      img.draggable = false;
      img.decoding = "async";
      img.dataset.src = srcFor(s);
      imgs.push(img);
      p.appendChild(img);
      root.appendChild(p);
      return p;
    });

    const hydrate = (center: number) => {
      for (let i = center - PRELOAD_BEHIND; i <= center + PRELOAD_AHEAD; i++) {
        const img = imgs[i];
        if (img && !img.src) img.src = img.dataset.src!;
      }
    };
    hydrate(0);

    // page-flip only claims a touch drag after 250 ms; by then the browser has taken the gesture
    // and later touchmoves are no longer cancelable, so slow drags never turn the page.
    // Claim horizontal drags immediately; vertical ones stay the page's scroll.
    let tx = 0;
    let ty = 0;
    const onTouchStart = (e: TouchEvent) => {
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - tx);
      const dy = Math.abs(e.touches[0].clientY - ty);
      if (dx > 6 && dx > dy && e.cancelable) e.preventDefault();
    };
    root.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });

    import("page-flip/dist/js/page-flip.module.js").then(({ PageFlip }) => {
      if (disposed) return;
      pf = new PageFlip(root, {
        width: 800,
        height: 450,
        size: "stretch",
        minWidth: 300,
        maxWidth: 820,
        minHeight: 169,
        maxHeight: 462,
        showCover: true,
        usePortrait: true,
        mobileScrollSupport: true,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        flippingTime: 900,
        showPageCorners: true,
        swipeDistance: 30,
      });
      pf.loadFromHTML(pages);
      pf.on("flip", (e) => {
        const i = Number(e.data);
        setPage(i);
        hydrate(i);
      });
      pf.on("changeOrientation", (e) => setPortrait(e.data === "portrait"));
      setPortrait(pf.getOrientation() === "portrait");
      book.current = pf;
    });

    return () => {
      disposed = true;
      book.current = null;
      root.removeEventListener("touchstart", onTouchStart, { capture: true });
      root.removeEventListener("touchmove", onTouchMove, { capture: true });
      try {
        pf?.destroy();
      } catch {
        /* the library may already have detached its block */
      }
      el.innerHTML = "";
    };
  }, [slides, title]);

  const total = slides.length;
  const shown = portrait || page === 0 ? `${page + 1}` : `${page + 1}–${Math.min(page + 2, total)}`;

  return (
    <div className="relative">
      <div className="relative mx-auto flex items-center gap-3 sm:gap-6" dir="ltr">
        <button
          type="button"
          aria-label={labels.prev}
          onClick={() => book.current?.flipPrev()}
          disabled={page === 0}
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white disabled:opacity-30 md:flex"
        >
          <ArrowLeft size={18} />
        </button>

        {/* while closed on the cover (spread mode) the cover sits on the right half — centre it */}
        <div
          className="min-w-0 flex-1 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: !portrait && page === 0 ? "translateX(-25%)" : "none" }}
        >
          <div ref={host} className="flipbook" aria-label={title} />
        </div>

        <button
          type="button"
          aria-label={labels.next}
          onClick={() => book.current?.flipNext()}
          disabled={page >= total - 1}
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white disabled:opacity-30 md:flex"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* progress + mobile arrows */}
      <div className="mt-8 flex items-center justify-center gap-4" dir="ltr">
        <button
          type="button"
          aria-label={labels.prev}
          onClick={() => book.current?.flipPrev()}
          disabled={page === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30 md:hidden"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-sm tabular-nums text-white/80">
            {shown} <span className="text-white/40">/ {total}</span>
          </span>
          <span className="block h-[3px] w-40 overflow-hidden rounded-full bg-white/15">
            <span
              className="block h-full rounded-full bg-cyan transition-[width] duration-500"
              style={{ width: `${((page + 1) / total) * 100}%` }}
            />
          </span>
        </div>
        <button
          type="button"
          aria-label={labels.next}
          onClick={() => book.current?.flipNext()}
          disabled={page >= total - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30 md:hidden"
        >
          <ArrowRight size={16} />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-white/45">{labels.hint}</p>
    </div>
  );
}
