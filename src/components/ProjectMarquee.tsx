"use client";

import { useState, useEffect, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";

interface Skill {
  id: number;
  title: string;
  image?: string;
  video?: string;
  visual?: ReactNode;
  link: string;
  subtitle: string;
  description: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const skills: Skill[] = [
  {
    id: 2,
    title: "Python",
    image: "/projects/python.gif",
    link: "#",
    subtitle: "Langage",
    description:
      "Algorithmique, scripts et traitement de données : la base de ma logique de programmation.",
  },
  {
    id: 3,
    title: "React",
    image: "/projects/react.gif",
    link: "#",
    subtitle: "Développement web",
    description:
      "Interfaces modernes et fluides avec React, Tailwind et Motion, pensées pour la performance.",
  },
  {
    id: 4,
    title: "GIT & DOCKER ",
    image: "/projects/docker.gif",
    link: "#",
    subtitle: "Déploiement",
    description:
      "Conteneurisation des applications, du poste local au serveur ou protection avec certificat SSL base sur des experience de projet. les bases d'utilisation de git",
  },
  {
    id: 1,
    title: "Symfony",
    video: "/projects/symfony.mp4",
    link: "https://micka.alwaysdata.net/",
    subtitle: "Framework PHP déployé avec AlwaysData, cliquez pour voir le site",
    description:
      "Projet réalisé lors de l'examen final de Symfony (1ère année) : une plateforme e-commerce complète. Clique pour le voir",
  },
  {
    id: 5,
    title: "Figma",
    image: "/projects/Figma.gif",
    link: "#",
    subtitle: "Design d'interface streatwear",
    description:
      "Maquettes et prototypes d'interfaces, pensés avant d'écrire la première ligne de code. Accopli lors d'un examen",
  },
  {
    id: 6,
    title: "Réseaux",
    video: "/projects/reseau.mp4",
    link: "#",
    subtitle: "Infrastructure",
    description:
      "Notions de réseaux informatiques : adressage, protocoles et configuration d'équipements.",
  },
];

const DEFAULT_DESCRIPTION =
  "Les technologies et outils que j'apprends et que j'utilise dans mes projets.";

function TypedText({ text }: { text: string }) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTyped("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 18);
    return () => clearInterval(id);
  }, [text]);

  return (
    <>
      <span>{typed}</span>
      {!done && (
        <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-[var(--accent)]" />
      )}
    </>
  );
}

export default function ProjectMarquee() {
  const [activeItem, setActiveItem] = useState<Skill | null>(null);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const smoothMouseX = useSpring(mouseX, { stiffness: 140, damping: 24 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 140, damping: 24 });
  const litMask = useMotionTemplate`radial-gradient(240px circle at ${smoothMouseX}px ${smoothMouseY}px, black 0%, transparent 100%)`;

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-500);
    mouseY.set(-500);
  };

  const handleSelect = (item: Skill) => {
    setActiveItem(item);
    if (item.link !== "#") {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  };

  const gridSize = "30px 30px";

  return (
    <section
      id="projects"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-[var(--bg)] px-4 py-16 text-[color:var(--fg)] transition-colors duration-500 sm:px-6 sm:py-20"
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

      <div className="relative z-50 mb-8 flex w-full max-w-5xl cursor-default select-none items-center gap-4 sm:gap-8">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
          style={{ originX: 1 }}
          className="h-px flex-1 bg-[var(--line)]"
        />

        <span className="block overflow-hidden">
          <motion.h3
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
            className="font-['Moga',Impact,sans-serif] text-base font-medium uppercase tracking-[0.2em] text-[color:var(--fg)] sm:text-xl"
          >
            Compétences
          </motion.h3>
        </span>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1, ease: EASE }}
          style={{ originX: 0 }}
          className="h-px flex-1 bg-[var(--line)]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
        onMouseLeave={() => setActiveItem(null)}
        className="relative z-15 flex h-48 w-full flex-nowrap items-center justify-start gap-3 overflow-x-auto overflow-y-visible px-4 [scrollbar-width:none] sm:h-60 sm:justify-center sm:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {skills.map((item) => {
          const isActive = activeItem?.id === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setActiveItem(item)}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`relative group flex-shrink-0 overflow-hidden border border-[color:var(--line)] bg-[var(--bg)] transition-[width,height,opacity,border-radius] duration-200 focus:outline-none ${
                item.link !== "#" ? "cursor-pointer" : "cursor-default"
              } ${
                isActive
                  ? "w-36 h-36 sm:w-48 sm:h-48 rounded-2xl opacity-100 shadow-2xl z-20"
                  : "w-24 h-24 sm:w-32 sm:h-32 rounded-xl opacity-90 dark:opacity-70 hover:opacity-100 shadow-md"
              }`}
            >
              {item.video ? (
                <video
                  src={item.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full p-2">{item.visual}</div>
              )}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-transparent dark:bg-black/10" />
            </motion.button>
          );
        })}
      </motion.div>

      <div className="relative z-15 mt-8 flex w-full flex-col items-center text-center sm:mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem ? activeItem.id : "all-skills"}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex w-full max-w-[100vw] flex-col items-center px-2"
          >
            <div className="mb-2 flex min-h-[24px] items-center justify-center gap-4 px-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--muted)] sm:text-xs">
              <span>{activeItem ? activeItem.subtitle : "Stack & savoir-faire"}</span>
            </div>

            <h2
              className={`font-['Kirgina',Impact,'Arial_Narrow',sans-serif] flex w-full select-none justify-center whitespace-nowrap text-[11vw] font-bold uppercase leading-[1.1] tracking-tight transition-colors duration-200 sm:text-[6vw] ${
                activeItem ? "text-[color:var(--accent)]" : "text-[color:var(--fg)]"
              }`}
            >
              {(activeItem ? activeItem.title : "Compétences")
                .split("")
                .map((char: string, index: number, arr: string[]) => {
                  const isLeftSide = index < arr.length / 2;
                  const offsetFactor = isLeftSide ? index : arr.length - 1 - index;

                  return (
                    <motion.span
                      key={index}
                      initial={{ y: isLeftSide ? "100%" : "-100%", opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: {
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                          delay: offsetFactor * 0.05,
                        },
                      }}
                      exit={{
                        y: isLeftSide ? "-100%" : "100%",
                        opacity: 0,
                        transition: {
                          duration: 0.3,
                          ease: [0.4, 0, 1, 1],
                          delay: offsetFactor * 0.01,
                        },
                      }}
                      style={{ display: "inline-block", whiteSpace: "pre" }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
            </h2>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex min-h-[6rem] w-full max-w-2xl items-start justify-center px-4 sm:min-h-[5rem]">
          <p className="text-center text-sm font-light leading-relaxed tracking-wide text-[color:var(--muted)] sm:text-xl">
            <TypedText text={activeItem ? activeItem.description : DEFAULT_DESCRIPTION} />
          </p>
        </div>
      </div>
    </section>
  );
}