import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { mountReact } from './react.jsx';
gsap.registerPlugin(ScrollTrigger, SplitText);
window.__r = { setActive: [] };

// R1 (+ R13 reuse)
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal, .wipe').forEach((el) => io.observe(el));

// R3
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  document.querySelectorAll('[data-split]').forEach((el) => {
    const isArabic = (el.closest('[lang]')?.getAttribute('lang') || '').startsWith('ar');
    SplitText.create(el, {
      type: isArabic ? 'words' : 'lines',
      mask: isArabic ? 'words' : 'lines',
      aria: el.matches('h1,h2,h3,h4,h5,h6') ? 'auto' : 'none',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(isArabic ? self.words : self.lines, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.08 });
      },
    });
  });
});

// R4
mm.add({ desktop: '(min-width: 960px)', motionOK: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
  const { desktop, motionOK } = ctx.conditions;
  if (!desktop) return;
  const steps = gsap.utils.toArray('.story-steps li');
  ScrollTrigger.create({ trigger: '.story', start: 'top top', end: 'bottom bottom', pin: '.story-media' });
  steps.forEach((step, i) => {
    ScrollTrigger.create({ trigger: step, start: 'top center', end: 'bottom center',
      onToggle: (self) => self.isActive && setActive(i, motionOK) });
  });
});
function setActive(i, animate) { window.__r.setActive.push([i, animate]); }

// R5 (test hook: ?rtl sets the gallery direction)
if (new URLSearchParams(location.search).has('rtl')) document.querySelector('.hgallery').dir = 'rtl';
mm.add({ desktop: '(min-width: 960px)', motionOK: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
  if (!ctx.conditions.desktop || !ctx.conditions.motionOK) return;
  const section = document.querySelector('.hgallery');
  const track = section.querySelector('.hgallery-track');
  const dir = getComputedStyle(section).direction === 'rtl' ? 1 : -1;
  const distance = () => track.scrollWidth - section.clientWidth;
  gsap.to(track, { x: () => dir * distance(), ease: 'none',
    scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => '+=' + distance(), invalidateOnRefresh: true } });
});

// R8
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (fine && !calm) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.3;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// R9
function transition(update) {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { update(); return; }
  document.startViewTransition(update);
}
document.getElementById('r9').addEventListener('click', () => transition(() => {
  const ul = document.getElementById('r9-list'); ul.prepend(ul.lastElementChild);
}));

// R10
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__r.lenis = true;
}

// R12
const vel = document.querySelector('[data-velocity-type]');
if (vel && matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  let last = null, target = 0, v = 0;
  addEventListener('pointermove', (e) => {
    if (last) target = Math.min(1, Math.hypot(e.clientX - last.x, e.clientY - last.y) / (e.timeStamp - last.t + 1) / 2);
    last = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  });
  (function tick() {
    v += (target - v) * 0.08; target *= 0.92;
    vel.style.setProperty('--wght', String(Math.round(900 - v * 600)));
    requestAnimationFrame(tick);
  })();
}

mountReact(document.getElementById('react-root'));
