"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const PHOTO = "/image/mickey.jpg";

export default function LanyardBadge() {
  const target = useMotionValue(0);
  const angle = useSpring(target, { stiffness: 70, damping: 5, mass: 1 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 150, damping: 15 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 });

  const clamp = (v: number) => Math.max(-28, Math.min(28, v));

  return (
    <motion.div
      initial={{ y: -420, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 60, damping: 11, delay: 0.3 }}
      className="relative w-[190px]"
    >
      <div className="absolute bottom-full left-1/2 h-[120vh] w-7 -translate-x-1/2 bg-[var(--fg)]" />

      <motion.div
        onPan={(_, info) => target.set(clamp(-info.offset.x / 5))}
        onPanEnd={() => target.set(0)}
        style={{ rotate: angle, transformOrigin: "50% 0%", touchAction: "pan-y", cursor: "grab" }}
      >
        <motion.div
          animate={{ rotate: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50% 0%" }}
        >
          <div className="mx-auto h-[110px] w-7 bg-[var(--fg)]">
            <div className="mx-auto h-full w-px bg-[var(--bg)] opacity-20" />
          </div>

          <svg width="46" height="58" viewBox="0 0 46 58" className="relative z-10 mx-auto block">
            <path
              d="M8 4h30a4 4 0 0 1 4 4v10a14 14 0 0 1-14 14H18A14 14 0 0 1 4 18V8a4 4 0 0 1 4-4z"
              fill="none"
              stroke="#cfd2d8"
              strokeWidth="4"
            />
            <rect x="17" y="30" width="12" height="26" rx="6" fill="#cfd2d8" />
          </svg>

          <motion.div
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set((e.clientX - r.left) / r.width - 0.5);
              my.set((e.clientY - r.top) / r.height - 0.5);
            }}
            onMouseLeave={() => {
              mx.set(0);
              my.set(0);
            }}
            style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 800 }}
            className="relative -mt-4 w-full overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[var(--fg)] text-[color:var(--bg)] shadow-[0_24px_40px_rgba(0,0,0,0.25)]"
          >
            <span className="absolute left-1/2 top-2.5 h-2.5 w-6 -translate-x-1/2 rounded-full bg-[var(--bg)]" />

            <div className="flex items-center justify-between px-4 pb-3 pt-7">
              <svg viewBox="0 0 120 100" className="h-5 w-6" fill="none">
                <path
                  d="M10 78C15 50 24 17 36 11C48 5 57 28 66 50C75 72 82 87 91 84C103 80 108 50 103 25C100 10 92 5 84 10C78 14 74 22 70 29"
                  stroke="var(--accent)"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-70">
                INSI · L1
              </span>
            </div>

            <div className="mx-3 aspect-square overflow-hidden rounded-lg bg-[var(--bg)]">
              <img
                src={PHOTO}
                alt="Portrait de Mickaël"
                draggable={false}
                className="h-full w-full select-none object-cover object-top"
              />
            </div>

            <div className="px-4 pb-4 pt-3">
              <p className="text-lg font-semibold leading-tight tracking-tight">Mickaël</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] opacity-60">
                Étudiant · Informatique
              </p>
              <div className="mt-3 flex items-end justify-between">
                <span className="font-mono text-[9px] tracking-[0.15em] opacity-60">ID 2026-001</span>
                <span className="flex h-4 items-end gap-[2px]">
                  {[10, 16, 8, 14, 6, 16, 10, 12, 7, 15].map((h, i) => (
                    <span key={i} style={{ height: h }} className="w-[2px] bg-[var(--bg)] opacity-70" />
                  ))}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

    </motion.div>
  );
}