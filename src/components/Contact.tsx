"use client";

import { useState, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { ArrowUp } from "lucide-react";
import AnimatedLogo from "./AnimatedLogo";

const EASE = [0.16, 1, 0.3, 1] as const;

const LINKS = {
  facebook: "https://www.facebook.com/share/1D6qHM2DkN/",
  whatsapp: "https://wa.me/261388005794",
  github: "https://github.com/mickaelrakt8-netizen",
};

const EMAIL = "mickaelrakt8@gmail.com";
const PHONE = "+261 38 80 057 94";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    <path d="M3 21l1.65-4.9A9 9 0 1 1 8 19.4L3 21z" />
    <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-.9-.4-1.9-1.4-2.3-2.3l.8-1-1-2L9 8.5z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const socials = [
  { name: "Facebook", href: LINKS.facebook, icon: <FacebookIcon /> },
  { name: "WhatsApp", href: LINKS.whatsapp, icon: <WhatsappIcon /> },
  { name: "GitHub", href: LINKS.github, icon: <GithubIcon /> },
];

function SliceLetter({ char }: { char: string }) {
  const [hover, setHover] = useState(false);

  return (
    <span className="block overflow-hidden">
      <motion.span
        variants={{
          hidden: { y: "105%" },
          visible: { y: "0%", transition: { duration: 1, ease: EASE } },
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative block cursor-default select-none"
      >
        {/* Moitié basse : fixe, donne sa taille à la lettre */}
        <span className="block" style={{ clipPath: "inset(50% 0 0 0)" }}>
          {char}
        </span>

        {/* Moitié haute : descend et se décale */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 block"
          style={{ clipPath: "inset(0 0 50% 0)" }}
          animate={
            hover
              ? { y: "30%", x: "5%", color: "var(--accent)" }
              : { y: "0%", x: "0%", color: "var(--fg)" }
          }
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {char}
        </motion.span>
      </motion.span>
    </span>
  );
}

const labelClass =
  "mb-4 font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--fg)]";
const textClass =
  "text-sm font-light leading-relaxed tracking-wide text-[color:var(--muted)] sm:text-base";

export default function Contact() {
  const word = "CONTACT".split("");

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 24 });
  const litMask = useMotionTemplate`radial-gradient(240px circle at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`;

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-500);
    mouseY.set(-500);
  };

  const gridSize = "30px 30px";

  return (
    <section
      id="contact"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-[var(--bg)] pt-28 text-[color:var(--fg)] transition-colors duration-500"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 85%)",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 85%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--dot) 1.2px, transparent 1.6px)",
            backgroundSize: gridSize,
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--accent) 1.6px, transparent 2px)",
            backgroundSize: gridSize,
            WebkitMaskImage: litMask,
            maskImage: litMask,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-16">
        {/* Trois colonnes d'informations */}
        <div className="grid gap-10 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className={labelClass}>Adresse</p>
            <p className={textClass}>Mandrosoa Ivato</p>
            <p className={textClass}>Madagascar</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <p className={labelClass}>Contact</p>
            <a
              href={`mailto:${EMAIL}`}
              className={`${textClass} block transition-colors hover:text-[color:var(--accent)]`}
            >
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className={`${textClass} block transition-colors hover:text-[color:var(--accent)]`}
            >
              {PHONE}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            <p className={labelClass}>Suivez-moi</p>
            <div className="flex items-center gap-5">
              {socials.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  className="h-5 w-5 text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)]"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.h2
          aria-label="Contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="mt-16 flex w-full justify-between font-['Kirgina',Impact,'Arial_Narrow',sans-serif] text-[21vw] font-bold uppercase leading-[0.9] sm:mt-24"
        >
          {word.map((char, i) => (
            <SliceLetter key={i} char={char} />
          ))}
        </motion.h2>
      </div>

      <div className="relative z-10 mx-auto mt-16 w-full max-w-7xl px-6 pb-10 sm:px-10 md:px-16">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ originX: 0 }}
          className="h-px w-full bg-[var(--line)]"
        />

        <div className="grid items-center gap-8 py-10 sm:grid-cols-[1fr_auto_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">
              Mickaël Rakotoarimanantsoa
            </p>
            <p className="mt-1 text-base font-light text-[color:var(--muted)] sm:text-lg">
              Étudiant en informatique · Antananarivo
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="hidden h-14 w-14 sm:block"
          >
            <AnimatedLogo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="flex items-center gap-6 sm:justify-end"
          >
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">
              © 2026
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-3 rounded-full border border-[color:var(--line)] py-2 pl-5 pr-2 font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-500 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              Haut de page
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--fg)] text-[color:var(--bg)] transition-transform duration-500 group-hover:-translate-y-1">
                <ArrowUp strokeWidth={1.5} className="h-4 w-4" />
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}