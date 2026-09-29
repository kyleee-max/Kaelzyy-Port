"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { heroStatement } from "@/lib/data";
import DotField from "./DotField";

function OrbitDot({ photoRef }: { photoRef: React.RefObject<HTMLDivElement> }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    let angle = 0;
    const tick = () => {
      const photo = photoRef.current;
      const dot = dotRef.current;
      if (photo && dot) {
        const size = photo.offsetWidth;
        const radius = size / 2;
        // Non-uniform angular speed so the loop doesn't read as robotic.
        const speed = 0.006 + Math.sin(angle * 1.3) * 0.0025;
        angle += speed;
        const x = radius + radius * Math.cos(angle);
        const y = radius + radius * Math.sin(angle);
        dot.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [photoRef]);

  return (
    <div
      ref={dotRef}
      className="absolute top-0 left-0 h-3 w-3 rounded-full bg-accent pointer-events-none"
      style={{ willChange: "transform" }}
    />
  );
}

export default function Hero() {
  const photoRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center px-6 md:px-16 py-24 overflow-hidden"
    >
      <DotField />
      <div className="relative mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto md:mx-0 w-56 h-56 md:w-72 md:h-72 order-1 md:order-none"
        >
          <div
            ref={photoRef}
            className="relative w-full h-full rounded-full border-2 border-ink overflow-hidden bg-ink"
          >
            {/* TODO(kaelsty): swap /public/logo.png for a real 1:1 photo when ready */}
            <Image
              src="/logo.png"
              alt="Kaelsty"
              fill
              sizes="(min-width: 768px) 18rem, 14rem"
              className="object-cover"
              priority
            />
          </div>
          <OrbitDot photoRef={photoRef} />
        </motion.div>

        <div className="text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display font-medium text-4xl md:text-5xl leading-[1.1] tracking-tight"
          >
            Kaelsty
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-3 text-sm md:text-base text-ink/60 font-body"
          >
            Software Engineer — Founder, PT Heion Interaktif Jaya &amp; CiPedia
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 font-display text-xl md:text-2xl max-w-md mx-auto md:mx-0"
          >
            {heroStatement}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
