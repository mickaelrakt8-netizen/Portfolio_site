import { useState, useEffect, type MouseEvent } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";

const T = 2.2;
const EASE = [0.16, 1, 0.3, 1] as const;

function LogoLoader() {
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
      className="w-32 overflow-visible sm:w-44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.06, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <motion.path
        d={d}
        stroke="#ffffff"
        strokeOpacity={0.3}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, ...wave(0) }}
        transition={{ pathLength: { duration: 1.8, delay: 0.2, ease: "easeInOut" } }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      <motion.path
        d={d}
        stroke="#38bdf8"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0.28, pathOffset: 0 }}
        animate={{ pathOffset: [0, 1], ...wave(0.4) }}
        transition={{ pathOffset: { duration: 2.4, repeat: Infinity, ease: "linear" } }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      <motion.path
        d={d}
        stroke="#ffffff"
        strokeWidth={3.5}
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

export default function Hero() {
  const [loading, setLoading] = useState(true);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const smoothMouseX = useSpring(mouseX, { stiffness: 140, damping: 24 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 140, damping: 24 });

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 220, damping: 18 });
  const smoothY = useSpring(cursorY, { stiffness: 220, damping: 18 });

  const rotateY = useTransform(smoothX, [-1, 1], [-20, 20]);
  const rotateX = useTransform(smoothY, [-1, 1], [12, -12]);
  const moveX = useTransform(smoothX, [-1, 1], [-180, 180]);
  const moveY = useTransform(smoothY, [-1, 1], [-90, 90]);

  const litMask = useMotionTemplate`radial-gradient(240px circle at ${smoothMouseX}px ${smoothMouseY}px, black 0%, transparent 100%)`;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const phrases = [
    "Étudiant en informatique à l'INSI Antananarivo, passionné par le développement web et la conception d'interfaces.",
    "Avec divers competences academiques: Algorithme, python, dev web, reseaux et divers .",
    "Réaliser des projets concrets à l'aide d'outils web modernes, de Docker, de Figma et de technologies d'IA.",
    "Progression a l'aide de divers Hackaton inter-classes: 1er prix L1 algo, et participation CTF, Ideathon et autres",
    "Façonné par des expériences variées — du secteur maritime et de l'hôtellerie à la technologie et à la communication.",
    "Une croissance constante — grâce à des stages en informatique, des « Ideathons » et des formations linguistiques certifiee avec FBF,AEC School et BYU-Pathway lvl3.",
  ];

  const highlights = [
    "développement web",
    "",
    "Docker, de Figma",
    "Hackaton",
    "maritime",
    "stages en informatique",
  ];

  const aboutTags = ["Web", "Docker", "Figma", "IA"];

  const renderHighlighted = (text: string, keyword: string) => {
    const start = keyword ? text.indexOf(keyword) : -1;
    if (start === -1) return text;
    return (
      <>
        {text.slice(0, start)}
        <span className="font-normal text-[color:var(--fg)]">{keyword}</span>
        {text.slice(start + keyword.length)}
      </>
    );
  };

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = "/image/micka_3d.png";

    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 2200));
    const loaded = new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    Promise.all([minDelay, loaded]).then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = loading ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [loading]);

  const fullNameToWrite = "Mickaël";
  const [typedName, setTypedName] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let typingInterval: ReturnType<typeof setInterval>;
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      typingInterval = setInterval(() => {
        if (currentIndex <= fullNameToWrite.length) {
          setTypedName(fullNameToWrite.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
        }
      }, 150);
    }, (T + 0.6) * 1000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typingInterval);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => {
      setCurrentTextIndex((prev) => (prev + 1) % phrases.length);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [currentTextIndex, phrases.length, loading]);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);
    cursorX.set((x / rect.width) * 2 - 1);
    cursorY.set((y / rect.height) * 2 - 1);
  };

  const resetPosition = () => {
    cursorX.set(0);
    cursorY.set(0);
  };

  const gridSize = "30px 30px";
  const dotsBase = {
    backgroundImage: "radial-gradient(circle, var(--dot) 1.2px, transparent 1.6px)",
    backgroundSize: gridSize,
  };
  const dotsLit = {
    backgroundImage: "radial-gradient(circle, var(--accent) 1.6px, transparent 2px)",
    backgroundSize: gridSize,
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div key="intro" className="fixed inset-0 z-[10000]">
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 bg-[#0b0b0d]"
              exit={{ y: "-100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0b0b0d]"
              exit={{ y: "100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
            />

            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              exit={{
                opacity: 0,
                scale: 1.2,
                transition: { duration: 0.5, ease: "easeIn" },
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <LogoLoader />
              </motion.div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.25, 0.7, 0.25] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="font-mono text-xs uppercase tracking-[0.4em] text-white/60"
              >
                chargement
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="home"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetPosition}
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[var(--bg)] px-4 py-20 transition-colors duration-500 sm:px-6 md:px-16"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, delay: T - 0.2, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        >
          <div className="absolute inset-0" style={dotsBase} />

          <motion.div
            className="absolute inset-0"
            style={{ ...dotsLit, WebkitMaskImage: litMask, maskImage: litMask }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, var(--bg) 100%)",
            }}
          />
        </motion.div>

        <div className="relative z-10 flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-10 pt-16 lg:flex-row lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 140, scale: 0.7, filter: "blur(18px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, delay: T + 0.1, ease: EASE }}
            className="relative flex w-[60vw] max-w-[320px] shrink-0 justify-center lg:max-w-[440px]"
          >
            <motion.img
              src="/image/micka_3d.png"
              alt="Portrait 3D de Mickaël"
              style={{
                x: moveX,
                y: moveY,
                rotateX,
                rotateY,
                transformPerspective: 600,
                transformStyle: "preserve-3d",
              }}
              className="w-full object-contain will-change-transform drop-shadow-[0_30px_30px_rgba(0,0,0,0.28)]"
            />
          </motion.div>

          <div className="max-w-2xl flex-1 text-center lg:ml-8 lg:text-left">
            <div className="mb-3 overflow-hidden">
              <motion.p
                initial={{ y: "120%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.2, delay: T + 0.4, ease: EASE }}
                className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--muted)] sm:text-sm"
              >
                Hello&nbsp;! this is
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: T + 0.5, ease: EASE }}
              className="mb-8 flex items-center justify-center font-extrabold leading-none tracking-tight text-[color:var(--fg)] lg:justify-start"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              <span>{typedName}</span>
              {!isComplete && (
                <span className="ml-2 inline-block h-[0.8em] w-[3px] animate-pulse bg-[var(--accent)] sm:w-[5px]" />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: T + 0.8, ease: EASE }}
              className="relative mt-4 w-full pl-5 text-left sm:pl-8"
            >
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.6, delay: T + 1, ease: EASE }}
                style={{ originY: 0 }}
                className="absolute left-0 top-0 h-full w-px bg-[var(--line)]"
              />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, delay: T + 1.4, ease: EASE }}
                style={{ originY: 0 }}
                className="absolute left-0 top-0 h-10 w-px bg-[var(--accent)]"
              />

              <div className="mb-6 flex items-center gap-4">
                <motion.span
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: T + 1.2, ease: EASE }}
                  className="font-mono text-xs uppercase tracking-[0.35em] text-[color:var(--accent)] sm:text-sm"
                >
                  À propos
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.4, delay: T + 1.5, ease: EASE }}
                  style={{ originX: 0 }}
                  className="h-px w-16 bg-[var(--line)] sm:w-32"
                />
              </div>

              <h2
                className="mb-5 text-2xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-3xl lg:text-4xl"
                style={{ perspective: 800 }}
              >
                {[
                  { text: "J'etudie", cls: "text-[color:var(--fg)]", d: 1.3 },
                  { text: "j'applique", cls: "text-[color:var(--muted)]", d: 1.45 },
                  { text: "Je conçois.", cls: "text-[color:var(--accent)]", d: 1.6 },
                ].map((line) => (
                  <span key={line.text} className="block overflow-hidden">
                    <motion.span
                      initial={{ y: "120%", rotateX: -60, opacity: 0 }}
                      animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                      transition={{ duration: 1.1, delay: T + line.d, ease: EASE }}
                      style={{ transformOrigin: "bottom" }}
                      className={`block ${line.cls}`}
                    >
                      {line.text}
                    </motion.span>
                  </span>
                ))}
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: T + 2, ease: EASE }}
                className="relative grid w-full"
              >
                {phrases.map((phrase, i) => (
                  <p
                    key={`ghost-${i}`}
                    aria-hidden="true"
                    className="invisible col-start-1 row-start-1 w-full text-sm font-light leading-relaxed tracking-wide sm:text-xl"
                  >
                    {phrase}
                  </p>
                ))}

                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                    exit={{ opacity: 0, y: -24, clipPath: "inset(100% 0 0 0)" }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="col-start-1 row-start-1 w-full text-sm font-light leading-relaxed tracking-wide text-[color:var(--muted)] sm:text-xl"
                  >
                    {renderHighlighted(phrases[currentTextIndex], highlights[currentTextIndex])}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              <div className="mt-6 flex flex-wrap gap-2">
                {aboutTags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: T + 2.4 + i * 0.12, ease: EASE }}
                    whileHover={{ y: -3 }}
                    className="cursor-default rounded-full border border-[color:var(--line)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] sm:px-4 sm:py-1.5 sm:text-[11px]"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: T + 3 }}
          className="pointer-events-none absolute inset-x-6 bottom-4 z-10 flex items-end justify-between sm:inset-x-10 sm:bottom-6"
        >
          <span className="font-['Moga',Impact,sans-serif] text-sm tracking-[0.3em] text-[color:var(--muted)] sm:text-base">
            Portfolio — 2026
          </span>
        </motion.div>
      </section>
    </>
  );
}