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
        transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
        className="relative h-56 w-full cursor-pointer rounded-2xl border border-ink/15 [transform-style:preserve-3d]"
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

        {/* back */}
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden] bg-ink text-paper rounded-2xl"
        >
          <ArrowUpRight size={40} strokeWidth={1.5} />
        </a>
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
