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

        {/* Section 3 — White Interlude */}
        <section className="h-screen flex items-center justify-center bg-white text-black z-20 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              gjlmotea
            </h2>
            <p className="text-gray-500 tracking-widest uppercase text-xs md:text-sm">
              Minimalist Identity • 2026
            </p>
          </motion.div>
        </section>
      </div>

      {/* ============ SECTION 4 — WORDMARK VORTEX ============ */}
      <SectionVortex />

      {/* ============ SECTION 5 — LETTER BY LETTER ============ */}
      <SectionLetterByLetter />

      {/* ============ SECTION 6 — CONSTELLATION ============ */}
      <SectionConstellation />

      {/* ============ SECTION 7 — LAYERED FINALE ============ */}
      <SectionFinale />
    </div>
  );
}

/* =============================================================
   SECTION 4 — WORDMARK VORTEX
   Four rows of "gjlmotea" in different typographic treatments
   scrolling in opposite directions; whole section skews on scroll.
   ============================================================= */
function SectionVortex() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const skew = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);

  const rows = [
    {
      text: "GJLMOTEA · ",
      duration: 32,
      reverse: false,
      cls: "text-7xl md:text-[10rem] font-black tracking-tighter uppercase",
      outline: false,
    },
    {
      text: "gjlmotea — ",
      duration: 50,
      reverse: true,
      cls: "text-4xl md:text-7xl font-extralight italic tracking-wide",
      outline: false,
    },
    {
      text: "GJLMOTEA / ",
      duration: 28,
      reverse: false,
      cls: "text-6xl md:text-9xl font-bold tracking-tight uppercase",
      outline: true,
    },
    {
      text: "gjlmotea  ",
      duration: 60,
      reverse: true,
      cls: "text-3xl md:text-5xl font-mono uppercase tracking-[0.4em] opacity-40",
      outline: false,
    },
  ];

  return (
    <section
      ref={ref}
      className="bg-black text-white py-32 md:py-48 overflow-hidden relative"
    >
      <motion.div style={{ skewY: skew }} className="space-y-6 md:space-y-10">
        {rows.map((row, i) => (
          <MarqueeRow
            key={i}
            text={row.text}
            duration={row.duration}
            reverse={row.reverse}
            cls={row.cls}
            outline={row.outline}
          />
        ))}
      </motion.div>
    </section>
  );
}

function MarqueeRow({
  text,
  duration,
  reverse,
  cls,
  outline,
}: {
  text: string;
  duration: number;
  reverse: boolean;
  cls: string;
  outline: boolean;
  key?: number;
}) {
  const repeated = text.repeat(6);
  const outlineStyle = outline
    ? { WebkitTextStroke: "1.5px white", color: "transparent" as const }
    : {};

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <span className={`${cls} shrink-0 pr-8`} style={outlineStyle}>
          {repeated}
        </span>
        <span className={`${cls} shrink-0 pr-8`} style={outlineStyle}>
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}

/* =============================================================
   SECTION 5 — LETTER BY LETTER
   Each of the 8 letters of "gjlmotea" takes over the screen
   in sequence with massive scale and 3D rotation. Closes with
   the full word reassembled letter by letter.
   ============================================================= */
function SectionLetterByLetter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const letters = NAME.split("");
  const total = letters.length + 1; // +1 for the final reassembled frame

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ height: `${total * 90}vh` }}
    >
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ perspective: 1600 }}
      >
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] md:text-xs tracking-[0.5em] uppercase text-white/40">
          eight letters · one name
        </div>

        {letters.map((letter, i) => (
          <LetterFrame
            key={i}
            scrollYProgress={scrollYProgress}
            letter={letter}
            index={i}
            count={letters.length}
            total={total}
          />
        ))}

        <AssembledFrame
          scrollYProgress={scrollYProgress}
          startProgress={letters.length / total}
        />
      </div>
    </section>
  );
}

function LetterFrame({
  scrollYProgress,
  letter,
  index,
  count,
  total,
}: {
  scrollYProgress: MotionValue<number>;
  letter: string;
  index: number;
  count: number;
  total: number;
  key?: number;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const slot = end - start;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + slot * 0.25, end - slot * 0.25, end],
    [0, 1, 1, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [start, start + slot * 0.3, end - slot * 0.3, end],
    [0.6, 1, 1, 1.3],
  );
  const rotateY = useTransform(
    scrollYProgress,
    [start, (start + end) / 2, end],
    [50, 0, -50],
  );
  const z = useTransform(
    scrollYProgress,
    [start, (start + end) / 2, end],
    [-300, 0, -300],
  );

  return (
    <motion.div
      style={{ opacity, scale, rotateY, z }}
      className="absolute flex flex-col items-center will-change-transform"
    >
      <div className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-white/30 mb-6 md:mb-10">
        {String(index + 1).padStart(2, "0")} / 0{count}
      </div>
      <div className="text-[40vw] md:text-[28rem] font-black leading-[0.8] tracking-tighter">
        {letter}
      </div>
      <div className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/40 mt-6 md:mt-10">
        {letter} · letter {String(index + 1).padStart(2, "0")}
      </div>
    </motion.div>
  );
}

function AssembledFrame({
  scrollYProgress,
  startProgress,
}: {
  scrollYProgress: MotionValue<number>;
  startProgress: number;
}) {
  const remaining = 1 - startProgress;
  const opacity = useTransform(
    scrollYProgress,
    [startProgress, startProgress + remaining * 0.3, 1],
    [0, 1, 1],
  );
  const scale = useTransform(
    scrollYProgress,
    [startProgress, startProgress + remaining * 0.8],
    [0.7, 1],
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute flex flex-col items-center"
    >
      <div className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-white/40 mb-6 md:mb-10">
        assembled
      </div>
      <div className="flex items-baseline">
        {NAME.split("").map((letter, idx) => (
          <AssembledLetter
            key={idx}
            scrollYProgress={scrollYProgress}
            startProgress={startProgress}
            idx={idx}
            letter={letter}
          />
        ))}
      </div>
      <div className="h-px w-32 bg-white/50 my-8" />
      <div className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/50">
        gjlmotea
      </div>
    </motion.div>
  );
}

function AssembledLetter({
  scrollYProgress,
  startProgress,
  idx,
  letter,
}: {
  scrollYProgress: MotionValue<number>;
  startProgress: number;
  idx: number;
  letter: string;
  key?: number;
}) {
  const remaining = 1 - startProgress;
  const stagger = (idx / NAME.length) * remaining * 0.4;
  const begin = startProgress + remaining * 0.1 + stagger;
  const y = useTransform(
    scrollYProgress,
    [begin, begin + remaining * 0.25],
    [80, 0],
    { clamp: true },
  );
  const opacity = useTransform(
    scrollYProgress,
    [begin, begin + remaining * 0.15],
    [0, 1],
    { clamp: true },
  );
  return (
    <motion.span
      style={{ y, opacity }}
      className="text-[14vw] md:text-[11rem] font-black tracking-tighter leading-none inline-block"
    >
      {letter}
    </motion.span>
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
