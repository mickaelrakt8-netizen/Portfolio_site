"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface Language {
  name: string;
  level: string;
  note: string;
}
interface Certificate {
  title: string;
  org: string;
  date: string;
  detail: string;
  files?: { label: string; src: string }[]; // sans files : "Sur demande"
}

const languages: Language[] = [
  { name: "Français", level: "B2", note: "Courant · DELF B2" },
  { name: "Anglais", level: "B2", note: "Avancé · AEC niveau B2" },
  { name: "Allemand", level: "A1", note: "Débutant" },
];

const certificates: Certificate[] = [
  {
    title: "DELF B2",
    org: "Alliance Française Andavamamba",
    date: "Novembre 2023",
    detail: "Diplôme de langue française",
    files: [{ label: "DELF B2", src: "/certificats/delf_B2.pdf" }],
  },
  {
    title: "Pre-advanced English",
    org: "For a Bright English Course",
    date: "Mars 2024",
    detail: "Certificat d'anglais pré-avancé",
    files: [{ label: "FBF", src: "/certificats/FBF_certificat.pdf" }],
  },
  {
    title: "Niveau B2",
    org: "American English Course",
    date: "Fév. – Sept. 2025",
    detail: "Discours final de fin de cours",
    files: [{ label: "AEC", src: "/certificats/AEC_Certificate.pdf" }],
  },
  {
    title: "Formation maritime",
    org: "ENEM · Mahajanga",
    date: "Oct. – Nov. 2024",
    detail: "Initiation, sécurité de base, sécurité des passagers et sûreté",
    files: [
      { label: "Initiation", src: "/certificats/ENEM_Initiation.pdf" },
      { label: "Safety", src: "/certificats/ENEM_safety.pdf" },
      { label: "Security", src: "/certificats/ENEM_Security.pdf" },
      { label: "Sûreté", src: "/certificats/ENEM_surete.pdf" },
    ],
  },
  {
    title: "Stage hôtellerie",
    org: "Radisson · Tamboho",
    date: "Déc. 2024 – Fév. 2025",
    detail: "Housekeeping et aide-barman",
    files: [{ label: "Stage", src: "/certificats/Stage_Radisson.pdf" }],
  },
];

const QUOTE = "Construire des choses utiles, qui marquent celles et ceux qui les utilisent.";
const STORY =
  "Ma première année de licence en informatique m'a donné des bases solides. J'aspire maintenant à les enrichir dans un cadre exigeant, loin de mes repères, auprès de personnes qui tirent vers le haut. Entre langues, informatique, maritime et hôtellerie, j'ai appris à m'adapter vite et à rendre service : c'est cette énergie que je veux mettre dans des projets concrets, au sein d'un environnement stable où l'on grandit ensemble.";

/* Mot du paragraphe : il s'éclaire pendant le scroll */
function ScrollWord({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

/* Ligne de certificat : lueur qui suit la souris, trait qui se dessine */
function CertRow({
  cert,
  index,
  onOpen,
}: {
  cert: Certificate;
  index: number;
  onOpen: () => void;
}) {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 200, damping: 25 });
  const sy = useSpring(y, { stiffness: 200, damping: 25 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, color-mix(in srgb, var(--accent) 12%, transparent), transparent)`;

  const move = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseMove={move}
      onMouseLeave={() => {
        x.set(-300);
        y.set(-300);
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay: index * 0.07, ease: EASE }}
      className="group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-6 gap-y-1 border-b border-[color:var(--line)] px-2 py-7 text-left sm:grid-cols-[7rem_1fr_1fr_auto] sm:gap-x-10 sm:px-6"
    >
      <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <span className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-700 ease-out group-hover:scale-x-100" />

      <span className="relative font-mono text-sm tracking-[0.2em] text-[color:var(--accent)]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="relative col-span-1">
        <span className="block text-2xl font-semibold leading-tight tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl">
          {cert.title}
        </span>
        <span className="mt-1 block text-lg font-light text-[color:var(--muted)]">{cert.org}</span>
      </span>

      <span className="relative hidden sm:block">
        <span className="block font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          {cert.date}
        </span>
        <span className="mt-1 block text-lg font-light text-[color:var(--muted)]">{cert.detail}</span>
      </span>

      <span className="relative flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted)] transition-colors duration-500 group-hover:text-[color:var(--accent)]">
        <span className="hidden sm:inline">{cert.files ? "Consulter" : "Sur demande"}</span>
        <span className="inline-block text-xl transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:rotate-12">
          ↗
        </span>
      </span>
    </motion.button>
  );
}

export default function Apropos() {
  const [open, setOpen] = useState<Certificate | null>(null);
  const [tab, setTab] = useState(0);

  // Points bleus sous le curseur
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const sx = useSpring(mouseX, { stiffness: 140, damping: 24 });
  const sy = useSpring(mouseY, { stiffness: 140, damping: 24 });
  const litMask = useMotionTemplate`radial-gradient(240px circle at ${sx}px ${sy}px, black 0%, transparent 100%)`;

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
    mouseY.set(e.clientY - r.top);
  };

  // Paragraphe qui s'éclaire mot à mot
  const storyRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start 85%", "end 50%"],
  });
  const storyWords = STORY.split(" ");

  // Titre : léger parallaxe
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(sectionProgress, [0, 1], [40, -60]);

  // Fermer avec Échap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const word = "À propos".split("");
  const grid = "30px 30px";
  const quoteWords = QUOTE.split(" ");

  return (
    <section
      id="apropos"
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mouseX.set(-500);
        mouseY.set(-500);
      }}
      className="relative w-full overflow-hidden bg-[var(--bg)] px-6 py-28 text-[color:var(--fg)] transition-colors duration-500 sm:px-10 md:px-16"
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
          style={{ backgroundImage: "radial-gradient(circle, var(--dot) 1.2px, transparent 1.6px)", backgroundSize: grid }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--accent) 1.6px, transparent 2px)",
            backgroundSize: grid,
            WebkitMaskImage: litMask,
            maskImage: litMask,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div style={{ y: headingY }}>
          <div className="mb-3 flex items-center gap-5">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE }}
              style={{ originX: 0 }}
              className="h-px w-16 bg-[var(--accent)]"
            />
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="font-mono text-2xl uppercase tracking-[0.12em] text-[color:var(--accent)] sm:text-3xl"
            >
              Objectifs & langues
            </motion.p>
          </div>

          <motion.h2
            aria-label="À propos"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            className="flex flex-wrap font-['Kirgina',Impact,'Arial_Narrow',sans-serif] text-[18vw] font-bold uppercase leading-[1.05] tracking-tight sm:text-[10vw] lg:text-[7vw]"
          >
            {word.map((c, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  variants={{
                    hidden: { y: "110%", rotate: 6 },
                    visible: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
                  }}
                  className="block origin-bottom-left"
                >
                  {c === " " ? "\u00A0" : c}
                </motion.span>
              </span>
            ))}
          </motion.h2>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div>
            <motion.p
              aria-label={QUOTE}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              className="text-2xl font-light leading-relaxed tracking-wide sm:text-4xl"
            >
              {quoteWords.map((w, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  variants={{
                    hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
                  }}
                  className="mr-[0.28em] inline-block"
                >
                  {w}
                </motion.span>
              ))}
            </motion.p>

            <p
              ref={storyRef}
              className="mt-10 max-w-2xl text-xl font-light leading-relaxed tracking-wide text-[color:var(--fg)] sm:text-2xl"
            >
              {storyWords.map((w, i) => (
                <ScrollWord
                  key={i}
                  word={w}
                  progress={scrollYProgress}
                  range={[i / storyWords.length, (i + 1) / storyWords.length]}
                />
              ))}
            </p>
          </div>

          <div>
            <p className="mb-6 font-mono text-sm uppercase tracking-[0.25em] text-[color:var(--muted)] sm:text-base">
              Langues
            </p>
            {languages.map((l, i) => {
              const filled = LEVELS.indexOf(l.level) + 1;
              return (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                  className="group border-t border-[color:var(--line)] py-6 last:border-b"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                      {l.name}
                    </span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.5 + i * 0.12 }}
                      className="font-mono text-xl text-[color:var(--accent)]"
                    >
                      {l.level}
                    </motion.span>
                  </div>

                  <div className="mt-4 flex gap-1.5">
                    {LEVELS.map((lv, k) => (
                      <motion.span
                        key={lv}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.12 + k * 0.08, ease: EASE }}
                        style={{ originX: 0 }}
                        className={`relative h-1.5 flex-1 rounded-full transition-transform duration-300 group-hover:scale-y-150 ${
                          k < filled ? "bg-[var(--accent)]" : "bg-[var(--line)]"
                        }`}
                      >
                        {k === filled - 1 && (
                          <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-ping rounded-full bg-[var(--accent)] opacity-40" />
                        )}
                      </motion.span>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[10px] tracking-[0.2em] text-[color:var(--muted)]">
                    {LEVELS.map((lv) => (
                      <span key={lv}>{lv}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-lg font-light text-[color:var(--muted)]">{l.note}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mb-6 mt-28 flex items-center gap-5">
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-[color:var(--muted)] sm:text-base">
            Certificats
          </p>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE }}
            style={{ originX: 0 }}
            className="h-px flex-1 bg-[var(--line)]"
          />
          <span className="font-mono text-sm tracking-[0.2em] text-[color:var(--accent)]">
            {String(certificates.length).padStart(2, "0")}
          </span>
        </div>

        <div className="border-t border-[color:var(--line)]">
          {certificates.map((c, i) => (
            <CertRow
              key={c.title}
              cert={c}
              index={i}
              onOpen={() => {
                setOpen(c);
                setTab(0);
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(null)}
            onContextMenu={(e) => e.preventDefault()}
            className="fixed inset-0 z-[10000] grid place-items-center bg-black/70 p-4 backdrop-blur-md sm:p-6"
          >
            <motion.div
              initial={{ y: 60, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl border border-[color:var(--line)] bg-[var(--bg)] p-6 text-[color:var(--fg)] sm:p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
                    className="font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--accent)]"
                  >
                    {open.date}
                  </motion.p>
                  <span className="mt-2 block overflow-hidden">
                    <motion.h3
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
                      className="text-3xl font-semibold tracking-tight sm:text-4xl"
                    >
                      {open.title}
                    </motion.h3>
                  </span>
                  <p className="mt-1 text-xl font-light text-[color:var(--muted)]">{open.org}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  aria-label="Fermer"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[color:var(--line)] text-xl text-[color:var(--muted)] transition-all duration-300 hover:rotate-90 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                >
                  ✕
                </button>
              </div>

              <p className="mt-4 text-lg font-light">{open.detail}</p>

              {open.files ? (
                <>
                  {open.files.length > 1 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {open.files.map((f, i) => (
                        <button
                          key={f.src}
                          type="button"
                          onClick={() => setTab(i)}
                          className={`relative rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
                            tab === i ? "text-[color:var(--bg)]" : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                          }`}
                        >
                          {tab === i && (
                            <motion.span
                              layoutId="cert-tab"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              className="absolute inset-0 rounded-full bg-[var(--fg)]"
                            />
                          )}
                          <span className="relative">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.iframe
                      key={open.files[tab].src}
                      src={`${open.files[tab].src}#toolbar=0&navpanes=0&view=FitH`}
                      title={`Certificat ${open.files[tab].label}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="mt-6 h-[62vh] w-full rounded-lg border border-[color:var(--line)]"
                    />
                  </AnimatePresence>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Consultation uniquement · Échap pour fermer
                  </p>
                </>
              ) : (
                <p className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Document disponible sur demande
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}