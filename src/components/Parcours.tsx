"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  animate,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import LanyardBadge from "./LanyardBadge";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Step {
  period: string;
  kind: string;
  title: string;
  place: string;
  description: string;
}


const steps: Step[] = [
  {
    period: "Déc. 2025 — Présent",
    kind: "Formation",
    title: "Licence 1 en informatique",
    place: "INSI · Ambanidia",
    description:
      "Python, JavaScript, Linux (Debian), Git et Docker. Vainqueur du hackathon d'algorithmique inter-INSI.",
  },
  {
    period: "2024 — 2025",
    kind: "Langues",
    title: "Anglais et français certifiés",
    place: "AEC · FBF · Alliance Française",
    description:
      "Niveau B2 à l'American English Course, certificat pré-avancé FBF et DELF B2.",
  },
  {
    period: "Oct. — Nov. 2024",
    kind: "Maritime",
    title: "Initiation maritime",
    place: "ENEM · Mahajanga",
    description:
      "Sécurité de base (modules 1 et 2), gestion de la sécurité des passagers et sûreté de base.",
  },
  {
    period: "2024 — 2025",
    kind: "Hôtellerie",
    title: "Housekeeping et service",
    place: "Radisson Tamboho · Soaiadanana Lac",
    description:
      "Stage en housekeeping et aide-barman, puis service en banquets et événements à fort volume.",
  },
];

const stats = [
  { value: 6, label: "Compétitions universitaires interclasse durant L1" },
  { value: 3, label: "Organismes de langues" },
  { value: 15, label: "Le nombres de matieres fini pendant ma premiere annee" },
];

/* Chiffre qui compte jusqu'à sa valeur */
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{value}</span>;
}


/* Transforme la progression (0 à 1) en pourcentage pour la position du point */
function useSpringPercent(progress: MotionValue<number>) {
  return useTransform(progress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);
}

export default function Parcours() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 100%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const dotTop = useSpringPercent(progress);

  const word = "Parcours".split("");

  return (
    <section
      id="parcours"
      className="relative w-full overflow-hidden bg-[var(--bg)] px-6 py-28 text-[color:var(--fg)] transition-colors duration-500 sm:px-10 md:px-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--dot) 1.2px, transparent 1.6px)",
          backgroundSize: "30px 30px",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-20">
        <div className="self-start lg:sticky lg:top-32">
          <div className="relative sm:pl-[240px]">
            <div className="absolute -top-[170px] left-0 z-20 hidden sm:block">
              <LanyardBadge />
            </div>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mb-1 font-mono text-2xl uppercase leading-tight tracking-[0.12em] text-[color:var(--accent)] sm:text-3xl"
            >
              Formation & expériences
            </motion.p>

            <h2
              aria-label="Parcours"
              className="flex font-['Kirgina',Impact,'Arial_Narrow',sans-serif] text-[18vw] font-bold uppercase leading-[1] tracking-tight sm:text-[10vw] lg:text-[5vw]"
            >
              {word.map((char, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.06, ease: EASE }}
                    className="block"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="mt-6 max-w-lg text-xl font-light leading-relaxed tracking-wide text-[color:var(--muted)] sm:text-2xl"
          >
            Un parcours varié, de l'hôtellerie à l'informatique, construit étape par étape
            avec de la pratique, des compétitions et beaucoup de curiosité.
          </motion.p>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[color:var(--line)] pt-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: EASE }}
              >
                <p className="font-['Kirgina',Impact,sans-serif] text-4xl font-bold leading-none sm:text-5xl">
                  <Counter to={s.value} />
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase leading-snug tracking-[0.2em] text-[color:var(--muted)]">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div ref={timelineRef} className="relative pl-8 sm:pl-12">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-[var(--line)]" />

          <motion.div
            style={{ scaleY: progress, originY: 0 }}
            className="absolute bottom-0 left-0 top-0 w-px bg-[var(--accent)]"
          />

          <motion.span
            style={{ top: dotTop }}
            className="absolute -left-[4px] h-[9px] w-[9px] rounded-full bg-[var(--accent)]"
          />

          <div className="flex flex-col">
            {steps.map((step, i) => (
              <motion.article
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                className="group relative border-b border-[color:var(--line)] py-10 first:pt-0 last:border-b-0"
              >
                <motion.span
                  variants={{
                    hidden: { scale: 0, backgroundColor: "var(--bg)" },
                    visible: { scale: 1, backgroundColor: "var(--accent)" },
                  }}
                  transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                  className="absolute -left-[37px] hidden h-3 w-3 rounded-full border border-[color:var(--accent)] sm:-left-[53px] sm:block"
                  style={{ top: i === 0 ? 4 : 44 }}
                />

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="mb-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em]"
                >
                  <span className="text-[color:var(--accent)]">{step.period}</span>
                  <span className="h-px w-8 bg-[var(--line)]" />
                  <span className="text-[color:var(--muted)]">{step.kind}</span>
                </motion.div>

                <div className="flex items-start justify-between gap-4">
                  <span className="block overflow-hidden">
                    <motion.h3
                      variants={{
                        hidden: { y: "110%" },
                        visible: { y: "0%" },
                      }}
                      transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                      className="text-2xl font-semibold leading-tight tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl"
                    >
                      {step.title}
                    </motion.h3>
                  </span>
                  <ArrowUpRight
                    strokeWidth={1.5}
                    className="mt-1 h-6 w-6 shrink-0 text-[color:var(--muted)] transition-all duration-500 group-hover:rotate-12 group-hover:text-[color:var(--accent)]"
                  />
                </div>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                  className="mt-2 font-mono text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]"
                >
                  {step.place}
                </motion.p>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                  className="mt-4 max-w-2xl text-lg font-light leading-relaxed tracking-wide text-[color:var(--muted)] sm:text-xl"
                >
                  {step.description}
                </motion.p>

                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-700 ease-out group-hover:scale-x-100" />
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}