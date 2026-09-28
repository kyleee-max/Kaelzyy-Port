"use client";

import { motion } from "framer-motion";
import { aboutLines } from "@/lib/data";

const KEYWORDS = ["2020", "PT Heion Interaktif Jaya", "CiPedia", "engineer", "founder"];

function highlight(line: string) {
  const pattern = new RegExp(`(${KEYWORDS.join("|")})`, "g");
  const parts = line.split(pattern);
  return parts.map((part, i) =>
    KEYWORDS.includes(part) ? (
      <span key={i} className="text-accent">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function About() {
  return (
    <section id="about" className="px-6 md:px-16 py-24">
      <div className="mx-auto max-w-prose">
        <h2 className="font-display text-2xl md:text-3xl mb-10">About</h2>
        <div className="space-y-5">
          {aboutLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="font-body text-base md:text-lg leading-relaxed text-ink/80"
            >
              {highlight(line)}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
