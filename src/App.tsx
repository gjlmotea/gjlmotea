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

        {/* Section 2 — Falling Letters (wrapper 500vh; animation finishes by ~60% so there's a long assembled-view window before transition) */}
        <div className="relative h-[500vh]">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div className="flex gap-4 md:gap-12 items-baseline">
              {letters.map((letter, index) => {
                const start = 0.2 + index * 0.03;
                const end = 0.4 + index * 0.03;

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

      {/* ============ SECTION 6 — DREAMSCAPE ============ */}
      <SectionDreamscape />

      {/* ============ SECTION 7 — STAR BURST FINALE ============ */}
      <SectionStarBurst />

      {/* ============ SECTION 8 — WORMHOLE ============ */}
      <SectionWormhole />

      {/* ============ SECTION 9 — WHITE HOLE ============ */}
      <SectionWhiteHole />

      {/* ============ SECTION 10 — WARPED REALITY ============ */}
      <SectionWarpedReality />

      {/* ============ SECTION 11 — TORSION FIELD ============ */}
      <SectionTorsionField />
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

/* =============================================================
   SECTION 8 — WORMHOLE
   Conic black/white background rotating, plus tunnel rings
   collapsing inward. Mix-blend-difference keeps everything visible.
   ============================================================= */
function SectionWormhole() {
  const rings = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        delay: i * 0.16,
        thickness: i % 3 === 0 ? 2 : 1,
      })),
    [],
  );

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Spinning conic gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, #000 0deg, #fff 90deg, #000 180deg, #fff 270deg, #000 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Tunnel rings (collapsing inward) */}
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full border"
          style={{
            width: 1000,
            height: 1000,
            marginLeft: -500,
            marginTop: -500,
            borderColor: "#fff",
            borderWidth: r.thickness,
            mixBlendMode: "difference",
          }}
          animate={{
            scale: [1.3, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            delay: r.delay,
            ease: "easeIn",
            times: [0, 0.1, 0.85, 1],
          }}
        />
      ))}

      {/* Center vortex eye */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
        style={{
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          background: "radial-gradient(circle, rgba(128,128,128,0.4), transparent 70%)",
          mixBlendMode: "difference",
        }}
      />

      {/* Centered wordmark (mix-blend-difference keeps it visible on both halves) */}
      <div
        className="absolute top-12 md:top-16 left-1/2 -translate-x-1/2 text-base md:text-xl font-light tracking-[0.4em] uppercase z-10 pointer-events-none"
        style={{ color: "#fff", mixBlendMode: "difference" }}
      >
        gjlmotea
      </div>
    </section>
  );
}

/* =============================================================
   SECTION 9 — WHITE HOLE
   Mirror of black hole. Black field, white dots in reverse-rotating
   spiral, plus bright glowing center and outward radiating particles.
   ============================================================= */
function SectionWhiteHole() {
  const dots = useMemo(() => {
    const arr: { x: number; y: number; size: number; opacity: number }[] = [];
    const total = 280;
    for (let i = 0; i < total; i++) {
      const t = i / total;
      const angle = t * 7 * Math.PI;
      const radius = 40 + t * 520;
      const size = 1 + (1 - t) * 2.8;
      const opacity = 0.3 + (1 - t) * 0.7;
      arr.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size,
        opacity,
      });
    }
    return arr;
  }, []);

  const bursts = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        angle: (i / 36) * 360,
        delay: Math.random() * 4,
        duration: 2.2 + Math.random() * 1.5,
      })),
    [],
  );

  return (
    <section className="relative h-screen bg-black overflow-hidden">
      {/* Counter-rotating spiral */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{ width: 0, height: 0 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {dots.map((d, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: d.x,
              top: d.y,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
              marginLeft: -d.size / 2,
              marginTop: -d.size / 2,
            }}
          />
        ))}
      </motion.div>

      {/* Outward radiating particles */}
      {bursts.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180;
        return (
          <motion.div
            key={`b-${i}`}
            className="absolute top-1/2 left-1/2 rounded-full bg-white"
            style={{
              width: 5,
              height: 5,
              marginLeft: -2.5,
              marginTop: -2.5,
              boxShadow: "0 0 12px 2px rgba(255,255,255,0.8)",
            }}
            animate={{
              x: [0, Math.cos(rad) * 460],
              y: [0, Math.sin(rad) * 460],
              opacity: [0, 1, 0],
              scale: [0.4, 1.4, 0.4],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* Bright emission core */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          marginLeft: -160,
          marginTop: -160,
          background:
            "radial-gradient(circle, #fff 18%, rgba(255,255,255,0.5) 45%, transparent 80%)",
          boxShadow: "0 0 140px 60px rgba(255,255,255,0.55)",
        }}
      />

      {/* Centered wordmark (sits inside the bright glow zone) */}
      <div className="absolute top-12 md:top-16 left-1/2 -translate-x-1/2 text-base md:text-xl font-light tracking-[0.4em] uppercase text-white/80 pointer-events-none z-10">
        gjlmotea
      </div>
    </section>
  );
}

/* =============================================================
   SECTION 10 — TORSION FIELD
   A regular grid warped by SVG turbulence + displacement filter.
   The filter's baseFrequency and seed animate continuously,
   producing a living "force-field bends space" effect.
   ============================================================= */
function SectionTorsionField() {
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <filter
            id="torsion-warp"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves={2}
              seed={3}
              result="turb"
            >
              <animate
                attributeName="baseFrequency"
                values="0.006;0.022;0.006"
                dur="14s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="seed"
                values="1;90;1"
                dur="22s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="90" />
          </filter>
        </defs>
        <g filter="url(#torsion-warp)">
          <g stroke="white" strokeWidth="0.7" opacity="0.75">
            {Array.from({ length: 26 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={-100}
                y1={(i / 25) * 900}
                x2={1700}
                y2={(i / 25) * 900}
              />
            ))}
            {Array.from({ length: 40 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={(i / 39) * 1600}
                y1={-100}
                x2={(i / 39) * 1600}
                y2={1000}
              />
            ))}
          </g>
          {/* Wordmark inside the filter — gets warped along with the grid */}
          <text
            x="800"
            y="470"
            textAnchor="middle"
            fill="white"
            fontSize="72"
            fontWeight={200}
            fontFamily="-apple-system, BlinkMacSystemFont, system-ui, sans-serif"
            letterSpacing="22"
            opacity="0.85"
          >
            gjlmotea
          </text>
        </g>
      </svg>
      <div className="absolute bottom-10 right-10 text-[10px] tracking-[0.4em] uppercase text-white/30">
        space bends
      </div>
    </section>
  );
}

/* =============================================================
   SECTION 11 — WARPED REALITY
   Eight rows of "gjlmotea" run through a turbulence + displacement
   filter that slowly evolves. Mixed weights/letter-spacing/grays.
   ============================================================= */
function SectionWarpedReality() {
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <filter
            id="reality-warp"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.006"
              numOctaves={3}
              seed={5}
              result="turb"
            >
              <animate
                attributeName="baseFrequency"
                values="0.003;0.018;0.003"
                dur="11s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="110" />
          </filter>
        </defs>
        <g filter="url(#reality-warp)">
          <text
            x="800"
            y="500"
            textAnchor="middle"
            fontSize="140"
            fill="#ffffff"
            fontFamily="-apple-system, BlinkMacSystemFont, system-ui, sans-serif"
            fontWeight={200}
            letterSpacing="28"
            opacity="0.9"
          >
            gjlmotea
          </text>
        </g>
      </svg>
    </section>
  );
}

/* =============================================================
   SECTION 12 — DREAMSCAPE
   Soft floating grayscale gradient blobs (heavy blur) + drifting
   ghost "gjlmotea" texts that fade in/out. Pure hypnagogic mood.
   ============================================================= */
function SectionDreamscape() {
  const blobs = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        size: 200 + Math.random() * 380,
        gray: 60 + Math.floor(Math.random() * 160),
        opacity: 0.18 + Math.random() * 0.3,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        duration: 20 + Math.random() * 20,
        delay: Math.random() * 14,
      })),
    [],
  );

  const ghosts = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        x: 8 + Math.random() * 84,
        y: 10 + Math.random() * 80,
        size: 16 + Math.random() * 48,
        duration: 2.5 + Math.random() * 4,
        delay: Math.random() * 6,
        weight: Math.random() > 0.5 ? 200 : 700,
        italic: Math.random() > 0.6,
      })),
    [],
  );

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Floating gray gradient blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={`b-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.startX}%`,
            top: `${b.startY}%`,
            marginLeft: -b.size / 2,
            marginTop: -b.size / 2,
            background: `radial-gradient(circle, rgba(${b.gray},${b.gray},${b.gray},${b.opacity}), transparent 70%)`,
            filter: "blur(50px)",
          }}
          animate={{
            x: [0, 130, -70, 90, 0],
            y: [0, -110, 70, -50, 0],
            scale: [1, 1.4, 0.8, 1.2, 1],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Flickering / flashing wordmarks — sharp bursts with glow */}
      {ghosts.map((g, i) => (
        <motion.div
          key={`g-${i}`}
          className="absolute pointer-events-none text-white"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            fontSize: g.size,
            fontWeight: g.weight,
            fontStyle: g.italic ? "italic" : "normal",
            letterSpacing: g.weight === 200 ? "0.25em" : "-0.02em",
            whiteSpace: "nowrap",
            textShadow:
              "0 0 12px rgba(255,255,255,0.9), 0 0 28px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.35)",
          }}
          animate={{
            opacity: [0, 0, 1, 0.05, 1, 0.2, 0.95, 0, 0.7, 0, 0, 0, 0],
          }}
          transition={{
            duration: g.duration,
            repeat: Infinity,
            delay: g.delay,
            times: [0, 0.18, 0.2, 0.22, 0.24, 0.27, 0.3, 0.33, 0.36, 0.4, 0.6, 0.85, 1],
            ease: "linear",
          }}
        >
          gjlmotea
        </motion.div>
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />

    </section>
  );
}
