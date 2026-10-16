"use client";

import { motion } from "motion/react";

const D =
  "M10 78C15 50 24 17 36 11C48 5 57 28 66 50C75 72 82 87 91 84C103 80 108 50 103 25C100 10 92 5 84 10C78 14 74 22 70 29";

const TONES = {
  theme: {
    base: "var(--muted)",
    core: "var(--fg)",
  },
  dark: {
    base: "#64748b",
    core: "#ffffff",
  },
};

export default function AnimatedLogo({
  variant = "theme",
  className = "h-full w-full",
  drawDelay = 0.1,
}: {
  variant?: "theme" | "dark";
  className?: string;
  drawDelay?: number;
}) {
  const t = TONES[variant];
  const id = `logo-${variant}`;

  return (
    <svg
      viewBox="-15 -15 150 130"
      className={className}
      fill="none"
      role="img"
      aria-label="Logo animé"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`${id}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee">
            <animate
              attributeName="stop-color"
              values="#22d3ee;#818cf8;#f472b6;#22d3ee"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#818cf8">
            <animate
              attributeName="stop-color"
              values="#818cf8;#f472b6;#22d3ee;#818cf8"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#f472b6">
            <animate
              attributeName="stop-color"
              values="#f472b6;#22d3ee;#818cf8;#f472b6"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path
        d={D}
        stroke={`url(#${id}-gradient)`}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 1, 1],
          opacity: [0, 0.6, 0.25],
        }}
        transition={{
          duration: 1.1,
          delay: drawDelay,
          times: [0, 0.75, 1],
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 0.3,
        }}
      />

      <motion.path
        d={D}
        stroke={t.base}
        strokeOpacity={0.3}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.8,
          delay: drawDelay,
          ease: "easeOut",
        }}
      />

      <motion.path
        d={D}
        stroke={`url(#${id}-gradient)`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0.35, pathOffset: 0, opacity: 0 }}
        animate={{
          pathOffset: [0, 1],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.8,
          delay: drawDelay + 0.65,
          repeat: Infinity,
          repeatDelay: 0.15,
          ease: "linear",
          times: [0, 0.12, 0.8, 1],
        }}
      />

      <motion.path
        d={D}
        stroke={t.core}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: [0, 0.6, 0],
          pathOffset: [0, 0.4, 1],
          opacity: [0, 0.9, 0],
        }}
        transition={{
          duration: 1.6,
          delay: drawDelay + 0.8,
          repeat: Infinity,
          repeatDelay: 0.25,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}