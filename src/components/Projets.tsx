"use client";

import { type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const REMOTEVIEW_VIDEO = "/projects/react.gif";


interface Node {
  label: string;
  x: number;
  y: number;
}
interface Packet {
  from: number;
  to: number;
  delay: number;
}
interface Diagram {
  nodes: Node[];
  links: [number, number][];
  packets: Packet[];
  caption: string;
}
interface Project {
  index: string;
  kind: string;
  title: string;
  description: string;
  features: string[];
  tags: string[];
  status: string;
  video?: string;
  diagram: Diagram;
}

const projects: Project[] = [
  {
    index: "01",
    kind: "Plateforme web",
    title: "RemoteView",
    description:
      "Une plateforme qui permet de contrôler une machine à distance depuis un navigateur, dans l'esprit de TeamViewer, mais développée de A à Z.",
    features: [
      "Un hôte lance l'agent sur son PC et partage ses applications",
      "Un client se connecte depuis son navigateur et voit l'écran en temps réel",
      "Authentification JWT, gestion d'équipes, messagerie et logiciels partagés",
    ],
    tags: ["WebSocket", "JWT", "Équipes", "Temps réel"],
    status: "Capture de la version de démonstration",
    video: REMOTEVIEW_VIDEO,
    diagram: {
      nodes: [
        { label: "Hôte", x: 60, y: 130 },
        { label: "Serveur", x: 200, y: 130 },
        { label: "Navigateur", x: 340, y: 130 },
      ],
      links: [
        [0, 1],
        [1, 2],
      ],
      packets: [
        { from: 0, to: 1, delay: 0 },
        { from: 1, to: 2, delay: 0.5 },
        { from: 2, to: 1, delay: 1.3 },
        { from: 1, to: 0, delay: 1.8 },
      ],
      caption: "WebSocket · JWT",
    },
  },
  {
    index: "02",
    kind: "Application Python",
    title: "Sauvegarde distante",
    description:
      "Une application qui envoie les fichiers d'un ordinateur vers un serveur. Même supprimés du PC, ils restent récupérables depuis l'application.",
    features: [
      "Sauvegarde des documents choisis vers un serveur distant",
      "Restauration depuis l'application, même après suppression en local",
      "Gestion de base de données, authentification et communication réseau",
    ],
    tags: ["Python", "Base de données", "Authentification", "Réseau"],
    status: "Projet personnel",
    diagram: {
      nodes: [
        { label: "Ordinateur", x: 60, y: 130 },
        { label: "Serveur", x: 200, y: 130 },
        { label: "Base de données", x: 340, y: 130 },
      ],
      links: [
        [0, 1],
        [1, 2],
      ],
      packets: [
        { from: 0, to: 1, delay: 0 },
        { from: 1, to: 2, delay: 0.6 },
        { from: 2, to: 1, delay: 1.6 },
        { from: 1, to: 0, delay: 2.2 },
      ],
      caption: "Sauvegarde · Restauration",
    },
  },
];

/* ---------------- Schéma animé ---------------- */

function DiagramView({ diagram }: { diagram: Diagram }) {
  const { nodes, links, packets, caption } = diagram;

  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden="true">
      {links.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="var(--line)"
          strokeWidth="1.8"
          strokeDasharray="4 5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 + i * 0.2, ease: EASE }}
        />
      ))}

      {packets.map((p, i) => (
        <motion.circle
          key={i}
          r="4"
          fill="var(--accent)"
          initial={{ cx: nodes[p.from].x, cy: nodes[p.from].y, opacity: 0 }}
          animate={{
            cx: [nodes[p.from].x, nodes[p.to].x],
            cy: [nodes[p.from].y, nodes[p.to].y],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1.2,
            ease: "linear",
          }}
        />
      ))}

      {nodes.map((n, i) => (
        <motion.g
          key={n.label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: EASE }}
        >
          <rect
            x={n.x - 54}
            y={n.y - 24}
            width="108"
            height="48"
            rx="9"
            fill="var(--bg)"
            stroke={i === 1 ? "var(--accent)" : "var(--fg)"}
            strokeWidth="1.5"
          />
          <text
            x={n.x}
            y={n.y + 4.5}
            textAnchor="middle"
            fontSize="11.5"
            fontFamily="ui-monospace, monospace"
            fill="var(--fg)"
          >
            {n.label}
          </text>
        </motion.g>
      ))}

      <text
        x="200"
        y="232"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="2.5"
        fontFamily="ui-monospace, monospace"
        fill="var(--muted)"
      >
        {caption.toUpperCase()}
      </text>
    </svg>
  );
}

/* ---------------- Une réalisation ---------------- */

function ProjectRow({ project, reverse }: { project: Project; reverse: boolean }) {
  const px = useMotionValue(-300);
  const py = useMotionValue(-300);
  const sx = useSpring(px, { stiffness: 160, damping: 22 });
  const sy = useSpring(py, { stiffness: 160, damping: 22 });
  const spot = useMotionTemplate`radial-gradient(180px circle at ${sx}px ${sy}px, color-mix(in srgb, var(--accent) 14%, transparent), transparent)`;

  const move = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  };

  return (
    <article className="group grid items-center gap-10 border-t border-[color:var(--line)] py-16 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? "lg:order-2" : ""}>
        <div className="flex items-center gap-4 font-mono text-sm uppercase tracking-[0.2em] sm:text-base">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-[color:var(--accent)]"
          >
            {project.index}
          </motion.span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            style={{ originX: 0 }}
            className="h-px w-10 bg-[var(--line)]"
          />
          <span className="text-[color:var(--muted)]">{project.kind}</span>
        </div>

        <h3 className="mt-5 overflow-hidden font-['Kirgina',Impact,'Arial_Narrow',sans-serif] text-5xl font-bold uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="block transition-colors duration-500 group-hover:text-[color:var(--accent)]"
          >
            {project.title}
          </motion.span>
        </h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="mt-6 max-w-xl text-xl font-light leading-relaxed tracking-wide text-[color:var(--muted)] sm:text-2xl"
        >
          {project.description}
        </motion.p>

        <ul className="mt-8 max-w-xl">
          {project.features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.1, ease: EASE }}
              className="flex gap-4 border-b border-[color:var(--line)] py-4 text-lg font-light leading-snug text-[color:var(--fg)] sm:text-xl"
            >
              <span className="mt-[0.7em] h-px w-5 shrink-0 bg-[var(--accent)]" />
              <span>{f}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.07, ease: EASE }}
              className="cursor-default rounded-full border border-[color:var(--line)] px-5 py-2 font-mono text-sm uppercase tracking-[0.15em] text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <p className="mt-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--muted)] sm:text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          </span>
          {project.status}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: EASE }}
        onMouseMove={move}
        onMouseLeave={() => {
          px.set(-300);
          py.set(-300);
        }}
        className={`relative aspect-[400/260] w-full overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[var(--bg)] ${
          reverse ? "lg:order-1" : ""
        }`}
      >
        {project.video ? (
          <img
            src={project.video}
            alt={`Capture de ${project.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                opacity: 0.35,
              }}
            />
            <motion.div aria-hidden="true" className="absolute inset-0" style={{ background: spot }} />
            <div className="relative h-full w-full p-3 sm:p-5">
              <DiagramView diagram={project.diagram} />
            </div>
          </>
        )}
        <span className="absolute left-4 top-3 rounded-full bg-[var(--bg)]/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--muted)] backdrop-blur">
          {project.video ? "Capture" : "Architecture"}
        </span>
      </motion.div>
    </article>
  );
}

/* ---------------- Section ---------------- */

export default function Projets() {
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

  const word = "Projets".split("");
  const gridSize = "30px 30px";

  return (
    <section
      id="realisations"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(-500);
        mouseY.set(-500);
      }}
      className="relative w-full overflow-hidden bg-[var(--bg)] px-6 pb-28 pt-6 text-[color:var(--fg)] transition-colors duration-500 sm:px-10 md:px-16"
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

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mb-2 font-mono text-2xl uppercase tracking-[0.12em] text-[color:var(--accent)] sm:text-3xl"
            >
              Réalisations
            </motion.p>

            <motion.h2
              aria-label="Projets"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
              className="flex font-['Kirgina',Impact,'Arial_Narrow',sans-serif] text-[20vw] font-bold uppercase leading-[1.05] tracking-tight sm:text-[11vw] lg:text-[8vw]"
            >
              {word.map((char, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    variants={{
                      hidden: { y: "110%" },
                      visible: { y: "0%", transition: { duration: 0.9, ease: EASE } },
                    }}
                    className="block"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="max-w-lg text-xl font-light leading-relaxed tracking-wide text-[color:var(--muted)] sm:text-2xl"
          >
            Là où je mets mes compétences en pratique : Python, bases de données,
            authentification et réseau.
          </motion.p>
        </div>

        {projects.map((p, i) => (
          <ProjectRow key={p.title} project={p} reverse={i % 2 === 1} />
        ))}

        <div className="border-t border-[color:var(--line)]" />
      </div>
    </section>
  );
}