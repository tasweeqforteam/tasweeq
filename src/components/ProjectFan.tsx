"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/lib/projects";

const N = PROJECTS.length;
const DRAG_STEP = 50; // px of horizontal drag per card
const AUTO_MS = 2600; // time each card stays in front

/**
 * Fan of real project covers. Drag/swipe to rotate the deck, tap a side card to bring it
 * forward, tap the front card to open that case study. Turns by itself while on screen.
 */
export default function ProjectFan() {
  const router = useRouter();
  const [front, setFront] = useState(Math.floor(N / 2));
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const go = (i: number) => setFront(((i % N) + N) % N);

  // the deck turns by itself while it's on screen; hover/drag pauses it, and any manual
  // change restarts the wait so it never jumps right after the visitor picks a card
  const deck = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = deck.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setFront((f) => (f + 1) % N), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [visible, paused, front]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, start: front, moved: false };
    suppressClick.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6) {
      if (!d.moved) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      d.moved = true;
    }
    // drag left = next card, like turning through a deck
    if (d.moved) go(d.start - Math.round(dx / DRAG_STEP));
  };
  const onPointerUp = () => {
    suppressClick.current = !!drag.current?.moved;
    drag.current = null;
  };

  const onCardClick = (i: number) => {
    if (suppressClick.current) return;
    if (i === front) router.push(`/work/${PROJECTS[i].slug}`);
    else go(i);
  };

  const p = PROJECTS[front];

  return (
    <div className="mb-12 flex flex-col items-center">
      <div
        ref={deck}
        className="relative h-[clamp(6rem,11vw,8.5rem)] w-[clamp(18rem,40vw,30rem)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
        dir="ltr"
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(front + 1);
          if (e.key === "ArrowLeft") go(front - 1);
        }}
        role="group"
        aria-roledescription="carousel"
        aria-label={p.title}
      >
        {PROJECTS.map((proj, i) => {
          // signed distance from the front card on a circular deck: -2..2
          let k = i - front;
          if (k > N / 2) k -= N;
          if (k < -N / 2) k += N;
          const a = Math.abs(k);
          return (
            <button
              key={proj.slug}
              type="button"
              tabIndex={k === 0 ? 0 : -1}
              aria-label={proj.title}
              onClick={() => onCardClick(i)}
              className="absolute left-1/2 top-0 aspect-[4/3] h-full overflow-hidden rounded-xl border-2 border-ink bg-ink transition-[transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(calc(-50% + ${k * 30}%)) rotate(${k * 5}deg) scale(${1 - a * 0.08})`,
                zIndex: 10 - a,
                filter: a ? "brightness(0.55)" : "none",
              }}
            >
              <Image src={proj.cover} alt="" fill sizes="220px" className="pointer-events-none object-cover" draggable={false} />
            </button>
          );
        })}
      </div>

      {/* name of the front project + position */}
      <div className="mt-5 flex items-center gap-3 text-sm text-paper/60" dir="ltr">
        <span className="font-display font-semibold text-paper" data-font-en>
          {p.title}
        </span>
        <span className="flex gap-1.5">
          {PROJECTS.map((x, i) => (
            <button
              key={x.slug}
              type="button"
              aria-label={x.title}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === front ? "w-5 bg-cyan" : "w-1.5 bg-paper/25"}`}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
