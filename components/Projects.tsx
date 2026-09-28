"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { useSound } from "@/lib/SoundProvider";

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const [flipped, setFlipped] = useState(false);
  const { playTick } = useSound();

  const toggle = () => {
    setFlipped((f) => !f);
    playTick();
  };

  return (
    <div className="[perspective:1200px]">
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onClick={toggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle()}
        animate={{ rotateY: flipped ? 180 : 0 }}
        whileHover={{ y: -4 }}
        transition={{ rotateY: { duration: 0.55, ease: [0.65, 0, 0.35, 1] }, y: { duration: 0.2 } }}
        className="relative h-56 w-full cursor-pointer rounded-2xl border border-ink/15 shadow-sm hover:shadow-lg transition-shadow duration-200 [transform-style:preserve-3d]"
      >
        {/* front */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 [backface-visibility:hidden]">
          <span className="font-body text-xs text-ink/40">{project.number}</span>
          <div>
            <h3 className="font-display text-xl font-medium">{project.name}</h3>
            <p className="mt-2 text-sm text-ink/60 font-body">{project.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="text-[11px] font-body text-ink/50 border border-ink/15 rounded-full px-2 py-0.5"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* back — clicking the card anywhere flips it back; only the small
            icon button itself opens the link, so flipping back always works */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-ink text-paper rounded-2xl">
          {project.href ? (
            <>
              <motion.a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center h-14 w-14 rounded-full border border-paper/30"
              >
                <ArrowUpRight size={26} strokeWidth={1.5} />
              </motion.a>
              <span className="text-[11px] tracking-wide text-paper/50 font-body">
                open project
              </span>
            </>
          ) : (
            <span className="text-xs tracking-wide text-paper/50 font-body">
              in progress
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="px-6 md:px-16 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl md:text-3xl mb-10">Selected projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
