"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "../lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", dark);
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      className={cn(
        "flex h-full w-full cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-inherit transition-colors focus:outline-none",
        className
      )}
      onClick={toggleTheme}
      aria-label="Changer de thème"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex h-full w-full items-center justify-center"
        >
          {isDark ? <Sun className="h-full w-full" strokeWidth={1.5} /> : <Moon className="h-full w-full" strokeWidth={1.5} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}