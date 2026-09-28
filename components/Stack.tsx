"use client";

import { motion } from "framer-motion";
import { stack } from "@/lib/data";
import { TECH_ICONS } from "@/lib/icons";

export default function Stack() {
  return (
    <section id="stack" className="px-6 md:px-16 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl md:text-3xl mb-10">Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {stack.map((group) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-sm text-ink/50 font-body mb-3">{group.label}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const Icon = TECH_ICONS[item];
                  return (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-ink/15 px-3 py-2"
                    >
                      {Icon && <Icon size={16} className="shrink-0" />}
                      <span className="text-sm font-body">{item}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
