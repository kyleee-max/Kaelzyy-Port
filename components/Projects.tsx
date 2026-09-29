"use client";

import { projects } from "@/lib/data";
import { TECH_ICONS } from "@/lib/icons";
import DotFrame from "./DotFrame";

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <DotFrame
      icon="link"
      label={project.name}
      className="min-h-56"
      action={
        project.href
          ? { label: "open project", href: project.href }
          : { label: "in progress" }
      }
    >
      <div className="flex min-h-40 flex-col justify-between gap-6">
        <span className="font-body text-xs text-ink/40">{project.number}</span>
        <div>
          <h3 className="font-display text-xl font-medium">{project.name}</h3>
          <p className="mt-2 text-sm text-ink/60 font-body">{project.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => {
            const Icon = TECH_ICONS[s];
            return (
              <span
                key={s}
                className="flex items-center gap-1.5 text-[11px] font-body text-ink/60 border border-ink/30 rounded-full px-2 py-0.5"
              >
                {Icon && <Icon size={12} className="shrink-0" />}
                {s}
              </span>
            );
          })}
        </div>
      </div>
    </DotFrame>
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
