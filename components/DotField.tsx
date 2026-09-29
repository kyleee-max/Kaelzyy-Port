"use client";

import { useEffect, useRef } from "react";

/**
 * Dot grid for the hero background. Same visual language as the intro:
 * small ink dots. Dots near the cursor ease away and take the accent color.
 * - Fewer dots on small screens
 * - Pauses when off-screen or tab hidden
 * - Static (no motion) if prefers-reduced-motion is set
 */
const INK = "11, 11, 12";
const ACCENT = "214, 40, 40";

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let dots: { hx: number; hy: number; x: number; y: number }[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const gap = w < 640 ? 44 : 32;
      dots = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          dots.push({ hx: x, hy: y, x, y });
        }
      }
      draw();
    };

    const RADIUS = 110;
    const PUSH = 26;

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.hx - mouse.x;
        const dy = d.hy - mouse.y;
        const dist = Math.hypot(dx, dy);
        let tx = d.hx;
        let ty = d.hy;
        let near = 0;
        if (dist < RADIUS && dist > 0) {
          near = 1 - dist / RADIUS;
          tx += (dx / dist) * near * PUSH;
          ty += (dy / dist) * near * PUSH;
        }
        d.x += (tx - d.x) * 0.14;
        d.y += (ty - d.y) * 0.14;
        ctx.beginPath();
        ctx.fillStyle =
          near > 0.05
            ? `rgba(${ACCENT}, ${0.35 + near * 0.65})`
            : `rgba(${INK}, 0.16)`;
        ctx.arc(d.x, d.y, near > 0.05 ? 2 + near * 1.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    build();
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
}
