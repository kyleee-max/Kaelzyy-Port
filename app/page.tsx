"use client";

import { useState } from "react";
import { SoundProvider } from "@/lib/SoundProvider";
import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Stack from "@/components/Stack";
import Contact from "@/components/Contact";

export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <SoundProvider>
      <Intro onDone={() => setEntered(true)} />
      <main
        className="transition-opacity duration-700"
        style={{ opacity: entered ? 1 : 0 }}
      >
        <Hero />
        <Projects />
        <About />
        <Stack />
        <Contact />
      </main>
    </SoundProvider>
  );
}
