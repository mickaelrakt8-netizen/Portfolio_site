"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { createContext, useContext, useRef } from "react";
import type { ReactNode, ComponentProps } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DockProps extends ComponentProps<typeof motion.div> {
  className?: string;
  children: ReactNode;
  magnification?: number;
  distance?: number;
}

interface DockIconProps {
  className?: string;
  children?: ReactNode;
  label?: string;   
  active?: boolean;
}

const DEFAULT_MAGNIFICATION = 90;
const DEFAULT_DISTANCE = 130;
const BASE_SIZE = 55;
const BASE_ICON_SIZE = 25;
const ICON_SIZE_RATIO = 0.55;
const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

interface DockContextValue {
  mouseX: MotionValue<number>;
  magnification: number;
  distance: number;
}

const DockContext = createContext<DockContextValue | null>(null);

export function Dock({
  className,
  children,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  style,
  ...props
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const { scrollYProgress } = useScroll();

  const dynamicWidth = useTransform(scrollYProgress, [0, 1], ["65vw", "34rem"]);
  const dynamicGap = useTransform(scrollYProgress, [0, 1], ["32px", "12px"]);
  const dynamicPadding = useTransform(scrollYProgress, [0, 1], ["2.5rem", "1.25rem"]);

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance }}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{
          width: dynamicWidth,
          gap: dynamicGap,
          paddingLeft: dynamicPadding,
          paddingRight: dynamicPadding,
          ...style,
        }}
        {...props}
        className={cn(
          "relative mx-auto flex h-20 min-w-fit max-w-[96vw] transform-gpu items-center justify-center rounded-full border border-[color:var(--line)] bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-md will-change-[width] transition-colors duration-500",
          className
        )}
      >
        {children}

        {/* Barre de progression de lecture : une seule couleur */}
        <motion.div
          style={{ scaleX: scrollYProgress, originX: 0 }}
          className="pointer-events-none absolute bottom-0 left-8 right-8 h-px bg-[var(--accent)]"
        />
      </motion.div>
    </DockContext.Provider>
  );
}

export function DockIcon({ className, children, label, active }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(DockContext);

  if (!context) {
    throw new Error("DockIcon must be used within a Dock component");
  }

  const { mouseX, magnification, distance } = context;

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const containerSize = useSpring(
    useTransform(distanceCalc, [-distance, 0, distance], [BASE_SIZE, magnification, BASE_SIZE]),
    SPRING
  );
  const iconSize = useSpring(
    useTransform(
      distanceCalc,
      [-distance, 0, distance],
      [BASE_ICON_SIZE, magnification * ICON_SIZE_RATIO, BASE_ICON_SIZE]
    ),
    SPRING
  );

  return (
    <motion.div
      ref={ref}
      style={{ width: containerSize, height: containerSize }}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "group relative flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-full border border-[color:var(--line)] bg-transparent text-[color:var(--muted)] transition-colors will-change-[width,height] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]",
        className
      )}
    >
      <motion.div
        style={{ width: iconSize, height: iconSize }}
        className="flex size-full items-center justify-center p-0.5"
      >
        {children}
      </motion.div>

      {/* Point "section active" */}
      {active && (
        <motion.span
          layoutId="nav-active-dot"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="absolute -bottom-2 h-1 w-1 rounded-full bg-[var(--accent)]"
        />
      )}


      {label && (
        <span className="pointer-events-none absolute top-full mt-4 translate-y-1 whitespace-nowrap rounded-full bg-[var(--fg)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bg)] opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          {label}
        </span>
      )}
    </motion.div>
  );
}