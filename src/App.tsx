import { MotionConfig } from "motion/react";
import { MotionConfig as FramerMotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectMarquee from "./components/ProjectMarquee";
import Projets from "./components/Projets";
import Parcours from "./components/Parcours";
import Apropos from "./components/Apropos";
import Contact from "./components/Contact";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
        <FramerMotionConfig reducedMotion="user">
            <div className="min-h-screen bg-[var(--bg)] text-[color:var(--fg)]">
              <Navbar />
              <main>
                <Hero />
                <ProjectMarquee />
                <Projets />
                <Parcours />
                <Apropos />
                <Contact />
              </main>
            </div>
        </FramerMotionConfig>
    </MotionConfig>
  );
}