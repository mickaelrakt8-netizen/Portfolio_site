"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Home, Briefcase, Layers, Mail, Download, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Dock, DockIcon } from "./magicui/dock";
import { ModeToggle } from "./mode-toggle";
import { Icons } from "./icons";


function AnimatedLogo() {
  const d =
    "M10 78C15 50 24 17 36 11C48 5 57 28 66 50C75 72 82 87 91 84C103 80 108 50 103 25C100 10 92 5 84 10C78 14 74 22 70 29";

  const wave = (delay: number) => ({
    y: [0, -4, 0, 4, 0],
    scaleY: [1, 1.12, 1, 0.9, 1],
    skewX: [0, 6, 0, -6, 0],
    transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const, delay },
  });

  return (
    <motion.svg
      viewBox="0 0 120 100"
      className="h-full w-full scale-125 overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >

      <motion.path
        d={d}
        className="stroke-[color:var(--muted)]"
        strokeOpacity={0.45}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, ...wave(0) }}
        transition={{ pathLength: { duration: 1.8, delay: 0.4, ease: "easeInOut" } }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />


      <motion.path
        d={d}
        className="stroke-[color:var(--accent)]"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0.28, pathOffset: 0 }}
        animate={{ pathOffset: [0, 1], ...wave(0.4) }}
        transition={{ pathOffset: { duration: 2.4, repeat: Infinity, ease: "linear" } }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />


      <motion.path
        d={d}
        className="stroke-[color:var(--fg)]"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0.18, pathOffset: 0.5 }}
        animate={{ pathOffset: [0.5, 1.5], ...wave(0.8) }}
        transition={{ pathOffset: { duration: 3.4, repeat: Infinity, ease: "linear" } }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </motion.svg>
  );
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  hide?: "scroll" | "bottom";
}

const navItems: NavItem[] = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "projects", label: "Compétences", icon: Briefcase, hide: "scroll" },
  { id: "realisations", label: "Projets", icon: Layers, hide: "bottom" },
  { id: "parcours", label: "Parcours", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Mail },
];

const sectionIds = navItems.map((item) => item.id);

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export default function Navbar() {
  const activeSection = useActiveSection(sectionIds);

  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 80;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = latest > 0.9;
    setAtBottom((prev) => (prev === next ? prev : next));
  });

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: 2.8 }}
      className="pointer-events-none fixed inset-x-0 top-6 z-[9999] flex justify-center will-change-transform"
    >
      <Dock className="pointer-events-auto">
        <div className="flex h-full w-full items-center justify-between">


          <div className="hidden flex-1 items-center justify-start md:flex">
            <a href="#home" aria-label="Accueil" className="flex items-center justify-center">
              <DockIcon label="Mickaël" className="border-none bg-transparent! shadow-none!">
                <AnimatedLogo />
              </DockIcon>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <AnimatePresence initial={false}>
              {navItems
                .filter(
                  (item) =>
                    !(item.hide === "scroll" && scrolled) &&
                    !(item.hide === "bottom" && atBottom)
                )
                .map(({ id, label, icon: Icon }) => (
                  <motion.a
                    key={id}
                    href={`#${id}`}
                    aria-label={label}
                    layout
                    initial={{ opacity: 0, scale: 0.4, width: 0 }}
                    animate={{ opacity: 1, scale: 1, width: "auto" }}
                    exit={{ opacity: 0, scale: 0.4, width: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center"
                  >
                    <DockIcon label={label} active={activeSection === id}>
                      <Icon className="h-full w-full object-contain" strokeWidth={1.5} />
                    </DockIcon>
                  </motion.a>
                ))}
            </AnimatePresence>

            <div className="hidden h-6 w-px self-center bg-[var(--line)] md:block" />

            <a
              href="https://www.facebook.com/share/1D6qHM2DkN/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hidden items-center justify-center md:flex"
            >
              <DockIcon label="Facebook">
                <Icons.facebook className="h-full w-full object-contain" />
              </DockIcon>
            </a>

            <a
              href="https://github.com/mickaelrakt8-netizen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hidden items-center justify-center md:flex"
            >
              <DockIcon label="GitHub">
                <Icons.github className="h-full w-full object-contain" />
              </DockIcon>
            </a>

            <a
              href="https://wa.me/261388005794"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hidden items-center justify-center md:flex"
            >
              <DockIcon label="WhatsApp">
                <Icons.whatsapp className="h-full w-full object-contain" />
              </DockIcon>
            </a>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 md:gap-4">
            <a
              href="/cv/CV_etudiant.pdf"
              download
              aria-label="Télécharger mon CV"
              className="hidden items-center justify-center md:flex"
            >
              <DockIcon label="Mon CV">
                <Download className="h-full w-full object-contain" strokeWidth={1.5} />
              </DockIcon>
            </a>

            <DockIcon label="Thème">
              <ModeToggle className="h-full w-full" />
            </DockIcon>
          </div>

        </div>
      </Dock>
    </motion.div>
  );
}