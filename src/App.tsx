/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect, useMemo, useRef } from "react";

const NAME = "gjlmotea";

export default function App() {
  const originalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: originalRef,
    offset: ["start start", "end end"],
  });

  const letters = NAME.split("");

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* ============ SECTIONS 1–3 (unchanged) ============ */}
      <div ref={originalRef}>
        {/* Section 1 — Hero */}
        <section className="h-screen flex flex-col items-center justify-center sticky top-0 z-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-8xl font-light tracking-[0.2em] uppercase">
              gjlmotea
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8 text-sm tracking-widest uppercase"
            >
              Scroll to explore
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2 — Falling Letters */}
        <div className="relative h-[300vh]">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="flex gap-4 md:gap-12 items-baseline">
              {letters.map((letter, index) => {
                const start = 0.1 + index * 0.04;
                const end = 0.4 + index * 0.04;

                const y = useTransform(
                  scrollYProgress,
                  [start, end],
                  [-600, 0],
                  { clamp: true },
                );
                const opacity = useTransform(
                  scrollYProgress,
                  [start, start + 0.1],
                  [0, 1],
                  { clamp: true },
                );
                const scale = useTransform(
                  scrollYProgress,
                  [start, end],
                  [2, 1],
                  { clamp: true },
                );
                const rotate = useTransform(
                  scrollYProgress,
                  [start, end],
                  [index % 2 === 0 ? -15 : 15, 0],
                  { clamp: true },
                );

                return (
                  <motion.span
                    key={index}
                    style={{ y, opacity, scale, rotate, display: "inline-block" }}
                    className="text-6xl md:text-9xl font-bold tracking-tighter"
                  >
                    {letter}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3 — Black Interlude (was white, now black; text colors flipped) */}
        <section className="h-screen flex items-center justify-center bg-black text-white z-20 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              gjlmotea
            </h2>
            <p className="text-gray-400 tracking-widest uppercase text-xs md:text-sm">
              Minimalist Identity • 2026
            </p>
          </motion.div>
        </section>
      </div>

      {/* ============ SECTION 4 — CONSTELLATION ============ */}
      <SectionConstellation />

      {/* ============ SECTION 5 — LAYERED FINALE ============ */}
      <SectionFinale />

      {/* ============ SECTION 6 — STAR BURST FINALE ============ */}
      <SectionStarBurst />
    </div>
  );
}

/* =============================================================
   SECTION 6 — CONSTELLATION
   "gjlmotea" set in a quiet starfield. A soft white spotlight
   follows the cursor. Pure black/white.
   ============================================================= */
function SectionConstellation() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.5 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mx, my]);

  const stars = useMemo(
    () =>
      Array.from({ length: 160 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.4,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 4,
      })),
    [],
  );

  const spotlightX = useTransform(sx, (v) => v - 400);
  const spotlightY = useTransform(sy, (v) => v - 400);
  const innerX = useTransform(sx, (v) => v - 150);
  const innerY = useTransform(sy, (v) => v - 150);

  return (
    <section ref={ref} className="relative h-[150vh] overflow-hidden bg-black">
      {/* Stars */}
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.1, 1, 0.1] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Outer soft glow */}
      <motion.div
        className="pointer-events-none absolute w-[800px] h-[800px] rounded-full"
        style={{
          x: spotlightX,
          y: spotlightY,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)",
        }}
      />
      {/* Inner crisp glow */}
      <motion.div
        className="pointer-events-none absolute w-[300px] h-[300px] rounded-full"
        style={{
          x: innerX,
          y: innerY,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
        }}
      />

      {/* Center wordmark */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-white/40 mb-10">
            move your cursor
          </p>
          <h2 className="text-[16vw] md:text-[13rem] font-light tracking-[0.15em] uppercase leading-none">
            gjlmotea
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-px w-48 mx-auto mt-12 bg-white/40 origin-center"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* =============================================================
   SECTION 7 — LAYERED FINALE
   Multiple "gjlmotea" copies layered as parallax background ghosts,
   with one definitive wordmark centered. Pure b&w.
   ============================================================= */
function SectionFinale() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const farY = useTransform(scrollYProgress, [0, 1], [300, -300]);
  const midY = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const nearY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const tiltY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const titleY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0.2, 0.2, 0],
  );

  return (
    <section
      ref={ref}
      className="relative bg-black text-white min-h-[220vh] overflow-hidden"
    >
      {/* Parallax grid */}
      <motion.div
        style={{ opacity: gridOpacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      {/* Ghost layers — different sizes, weights, opacities, speeds */}
      <motion.div
        style={{ y: farY }}
        className="absolute top-[8%] -left-[5%] text-[14rem] md:text-[24rem] font-black tracking-tighter text-white/[0.04] whitespace-nowrap select-none pointer-events-none leading-none"
      >
        gjlmotea
      </motion.div>
      <motion.div
        style={{ y: midY }}
        className="absolute top-[35%] -right-[8%] text-[10rem] md:text-[18rem] font-thin italic tracking-tight text-white/[0.07] whitespace-nowrap select-none pointer-events-none leading-none"
      >
        gjlmotea
      </motion.div>
      <motion.div
        style={{ y: nearY }}
        className="absolute top-[65%] left-[5%] text-[7rem] md:text-[14rem] font-light tracking-[0.2em] uppercase text-white/[0.05] whitespace-nowrap select-none pointer-events-none leading-none"
      >
        gjlmotea
      </motion.div>
      <motion.div
        style={{ y: tiltY }}
        className="absolute top-[18%] right-[12%] text-[4rem] md:text-[7rem] font-mono uppercase tracking-[0.4em] text-white/[0.06] select-none pointer-events-none rotate-[-12deg]"
      >
        gjlmotea
      </motion.div>
      <motion.div
        style={{ y: tiltY }}
        className="absolute bottom-[15%] left-[18%] text-[5rem] md:text-[9rem] font-extralight italic text-white/[0.04] select-none pointer-events-none rotate-[8deg]"
      >
        gjlmotea
      </motion.div>

      {/* Central definitive wordmark */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
        <motion.div style={{ y: titleY }} className="text-center max-w-6xl">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 0.5, letterSpacing: "0.5em" }}
            transition={{ duration: 2 }}
            viewport={{ amount: 0.3 }}
            className="text-[10px] md:text-xs uppercase mb-10 text-white/50"
          >
            one name · one journey
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ amount: 0.3 }}
            className="text-[18vw] md:text-[15rem] font-black leading-[0.85] tracking-tighter"
          >
            gjlmotea
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="h-px w-72 mx-auto my-10 bg-gradient-to-r from-transparent via-white to-transparent origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6 }}
            viewport={{ amount: 0.3 }}
            className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-white/50"
          >
            twenty twenty six
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* =============================================================
   SECTION 6 — STAR BURST FINALE
   Many overlapping star bursts, ring explosions, and supernovas
   on a black field. Central faint "gjlmotea" wordmark fades in.
   ============================================================= */
function SectionStarBurst() {
  const stars = useMemo(
    () =>
      Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: 1.5 + Math.random() * 2.5,
      })),
    [],
  );

  const rings = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        maxSize: 200 + Math.random() * 250,
        delay: Math.random() * 7,
        duration: 2.5 + Math.random() * 2,
      })),
    [],
  );

  const supernovas = useMemo(
    () =>
      Array.from({ length: 5 }, () => ({
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        delay: Math.random() * 10,
      })),
    [],
  );

  return (
    <section className="relative h-screen bg-black overflow-hidden">
      {/* Layer 1 — burst stars (pop and fade) */}
      {stars.map((s, i) => (
        <motion.div
          key={`s-${i}`}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ scale: [0, 4, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Layer 2 — expanding ring explosions */}
      {rings.map((r, i) => (
        <div
          key={`r-${i}`}
          className="absolute pointer-events-none"
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
        >
          <motion.div
            className="rounded-full border border-white"
            style={{
              width: r.maxSize,
              height: r.maxSize,
              marginLeft: -r.maxSize / 2,
              marginTop: -r.maxSize / 2,
            }}
            animate={{ scale: [0, 1], opacity: [0.7, 0] }}
            transition={{
              duration: r.duration,
              repeat: Infinity,
              delay: r.delay,
              ease: "easeOut",
            }}
          />
        </div>
      ))}

      {/* Layer 3 — supernova flashes with glow */}
      {supernovas.map((sn, i) => (
        <div
          key={`sn-${i}`}
          className="absolute pointer-events-none"
          style={{ left: `${sn.x}%`, top: `${sn.y}%` }}
        >
          <motion.div
            className="rounded-full bg-white"
            style={{
              width: 6,
              height: 6,
              marginLeft: -3,
              marginTop: -3,
              boxShadow: "0 0 60px 16px rgba(255,255,255,0.7)",
            }}
            animate={{ scale: [0, 10, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: sn.delay,
              repeatDelay: 5,
              ease: "easeOut",
            }}
          />
        </div>
      ))}

      {/* Faint central wordmark — the calm in the chaos */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          viewport={{ amount: 0.3 }}
          className="text-4xl md:text-7xl font-thin tracking-[0.4em] uppercase text-white"
        >
          gjlmotea
        </motion.h2>
      </div>
    </section>
  );
}
