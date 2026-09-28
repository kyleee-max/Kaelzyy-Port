export type Project = {
  id: string;
  number: string;
  name: string;
  tagline: string;
  stack: string[];
  href: string;
};

// TODO(kaelsty): swap these for your real 3-4 flagship projects.
export const projects: Project[] = [
  {
    id: "heion",
    number: "01",
    name: "Heion Interaktif Jaya",
    tagline: "Studio product & client engineering under CimyTech.",
    stack: ["Next.js", "TypeScript", "Supabase"],
    href: "https://example.com",
  },
  {
    id: "project-two",
    number: "02",
    name: "Project Two",
    tagline: "One-line description of what it does and for whom.",
    stack: ["React", "Rust"],
    href: "https://example.com",
  },
  {
    id: "project-three",
    number: "03",
    name: "Project Three",
    tagline: "One-line description of what it does and for whom.",
    stack: ["Kotlin", "MongoDB"],
    href: "https://example.com",
  },
  {
    id: "project-four",
    number: "04",
    name: "Project Four",
    tagline: "One-line description of what it does and for whom.",
    stack: ["Python", "Docker"],
    href: "https://example.com",
  },
];

export const stack: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["JavaScript", "TypeScript", "Kotlin", "Python", "Rust", "PHP"] },
  { label: "Frameworks", items: ["Next.js", "React"] },
  { label: "Database", items: ["MongoDB", "Supabase", "SQLite", "MariaDB"] },
  { label: "Tools / Infra", items: ["Git", "Docker", "Vercel"] },
  { label: "Animation", items: ["GSAP", "Framer Motion"] },
];

export const contacts = [
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/628386859765" },
  { id: "email", label: "Email", href: "mailto:kaelzyy7@gmail.com" },
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@kaelzyystillalone" },
  { id: "github", label: "GitHub", href: "https://github.com/kaelsty" },
];

export const heroStatement =
  "Lacking something was never a reason to quit — it's the reason to build.";

export const aboutLines = [
  "I'm 18, based in West Bandung, and I wrote my first lines of code in 2020 — not the kind I write now.",
  "Back in high school, that meant building and selling WhatsApp bots, mostly in the grey corners of the internet. It worked, but it wasn't something to build a career on.",
  "After I graduated, I went wider — real apps, web products, actual engineering instead of shortcuts. Coming from a simple family, I learned most of it by doing.",
  "That shift is what led to founding PT Heion Interaktif Jaya and CiPedia. The engineer in me keeps the founder honest about what's actually worth building.",
];
