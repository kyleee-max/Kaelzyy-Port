"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSound } from "@/lib/SoundProvider";

type Dot = { x: number; y: number; tx: number; ty: number; phase: number };

const DOT_COUNT = 64;
const DOT_RADIUS = 2.4;

// Sample N points evenly (by arc length) along a polyline of segments.
function sampleAlongSegments(
  segments: [number, number][],
  count: number
): { x: number; y: number }[] {
  const lengths: number[] = [];
  let total = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    const [x1, y1] = segments[i];
    const [x2, y2] = segments[i + 1];
    const l = Math.hypot(x2 - x1, y2 - y1);
    lengths.push(l);
    total += l;
  }
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const target = (i / (count - 1)) * total;
    let acc = 0;
    for (let s = 0; s < lengths.length; s++) {
      if (acc + lengths[s] >= target || s === lengths.length - 1) {
        const segT = lengths[s] === 0 ? 0 : (target - acc) / lengths[s];
        const [x1, y1] = segments[s];
        const [x2, y2] = segments[s + 1];
        points.push({ x: x1 + (x2 - x1) * segT, y: y1 + (y2 - y1) * segT });
        break;
      }
      acc += lengths[s];
    }
  }
  return points;
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(true);
  const { unlock, playTick } = useSound();

  const sizeRef = useRef({ w: 0, h: 0 });

  const layout = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    sizeRef.current = { w, h };
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }, []);

  useEffect(() => {
    layout();
    const dots: Dot[] = [];
    const { w, h } = sizeRef.current;
    for (let i = 0; i < DOT_COUNT; i++) {
      const x = w / 2 + (Math.random() - 0.5) * Math.min(w, h) * 0.5;
      const y = h / 2 + (Math.random() - 0.5) * Math.min(w, h) * 0.5;
      dots.push({ x, y, tx: x, ty: y, phase: Math.random() * Math.PI * 2 });
    }
    dotsRef.current = dots;

    const ctx = canvasRef.current?.getContext("2d");
    let t = 0;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0b0b0c";
      t += 0.02;
      dotsRef.current.forEach((d) => {
        const breathe = clicked ? 0 : Math.sin(t + d.phase) * 3;
        ctx.beginPath();
        ctx.arc(
          (d.x + breathe) * dpr,
          (d.y + breathe) * dpr,
          DOT_RADIUS * dpr,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    unlock();
    playTick();

    const { w, h } = sizeRef.current;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.09;

    const circlePoints = dotsRef.current.map((_, i) => {
      const theta = (i / DOT_COUNT) * Math.PI * 2;
      return { x: cx + R * Math.cos(theta), y: cy + R * Math.sin(theta) };
    });

    const checkSegments: [number, number][] = [
      [cx - R * 0.55, cy],
      [cx - R * 0.1, cy + R * 0.45],
      [cx + R * 0.65, cy - R * 0.55],
    ];
    const checkPoints = sampleAlongSegments(checkSegments, DOT_COUNT);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(canvasRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setVisible(false);
            onDone();
          },
        });
      },
    });

    dotsRef.current.forEach((d, i) => {
      tl.to(
        d,
        { x: circlePoints[i].x, y: circlePoints[i].y, duration: 0.9, ease: "power3.inOut" },
        i * 0.004
      );
    });
    tl.to({}, { duration: 0.25 }); // hold as "O"
    dotsRef.current.forEach((d, i) => {
      tl.to(
        d,
        { x: checkPoints[i].x, y: checkPoints[i].y, duration: 0.6, ease: "power2.inOut" },
        `+=${i * 0.003}`
      );
    });
    tl.to({}, { duration: 0.35 }); // hold as checkmark
  };

  if (!visible) return null;

  return (
    <button
      aria-label="Enter site"
      onClick={handleClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper cursor-pointer"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {!clicked && (
        <span className="absolute bottom-12 text-xs tracking-wide text-ink/40 font-body">
          click to enter
        </span>
      )}
    </button>
  );
}
