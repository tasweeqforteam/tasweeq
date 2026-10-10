import { useRef, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
gsap.registerPlugin(ScrollTrigger, useGSAP);

// R6
function Reveal({ children }) {
  const scope = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.item', { y: 32, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: scope.current, start: 'top 80%', once: true } });
    });
  }, { scope });
  return <div ref={scope} id="r6">{children}</div>;
}
// R7
function Menu({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.nav key="menu" id="r7-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
          menu
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
// R11
function Object3D({ animate }) {
  const ref = useRef(null);
  useFrame((_, dt) => { if (animate && ref.current) ref.current.rotation.y += dt * 0.3; });
  return <mesh ref={ref}><torusKnotGeometry args={[1, 0.3, 160, 24]} /><meshStandardMaterial roughness={0.35} metalness={0.6} /></mesh>;
}
const QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (cb) => { const mq = matchMedia(QUERY); mq.addEventListener('change', cb); return () => mq.removeEventListener('change', cb); };
const usePrefersReducedMotion = () => useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => true);
function Scene() {
  const animate = !usePrefersReducedMotion();
  return (
    <div id="r11" style={{ height: 300 }} data-animate={String(animate)}>
      <Canvas dpr={[1, 2]} frameloop={animate ? 'always' : 'demand'} camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.4} /><directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Object3D animate={animate} />
      </Canvas>
    </div>
  );
}
function App() {
  const [open, setOpen] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      <Reveal><p className="item">item 1</p><p className="item">item 2</p></Reveal>
      <button id="r7" onClick={() => setOpen((o) => !o)}>Toggle menu</button>
      <Menu open={open} />
      <Scene />
    </MotionConfig>
  );
}
export function mountReact(el) { createRoot(el).render(<App />); }
