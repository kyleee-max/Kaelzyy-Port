"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSound } from "@/lib/SoundProvider";
import { DotIconName, Pt, sampleIcon } from "@/lib/dotIcons";

const COUNT = 64; // same as the intro
const DOT_R = 2.2;
const INSET = 6;

type Action = { label: string; href?: string };

// 64 points evenly spaced along a rectangle outline, clockwise from top-left.
function rectPoints(w: number, h: number): Pt[] {
  const W = Math.max(w - INSET * 2, 1);
  const H = Math.max(h - INSET * 2, 1);
  const per = 2 * (W + H);
  const pts: Pt[] = [];
  for (let i = 0; i < COUNT; i++) {
    const d = (i / COUNT) * per;
    if (d < W) pts.push({ x: INSET + d, y: INSET });
    else if (d < W + H) pts.push({ x: INSET + W, y: INSET + (d - W) });
    else if (d < 2 * W + H) pts.push({ x: INSET + W - (d - W - H), y: INSET + H });
    else pts.push({ x: INSET, y: INSET + H - (d - 2 * W - H) });
  }
  return pts;
}

// Pair frame dots with icon dots by angle around the center so the morph is
// smooth (no dots crossing the whole shape).
function pairByAngle(frame: Pt[], icon: Pt[], fc: Pt, ic: Pt): Pt[] {
  const order = (pts: Pt[], c: Pt) =>
    pts
      .map((p, i) => ({ i, a: Math.atan2(p.y - c.y, p.x - c.x) }))
      .sort((a, b) => a.a - b.a)
      .map((o) => o.i);
  const fo = order(frame, fc);
  const io = order(icon, ic);
  const out: Pt[] = new Array(frame.length);
  fo.forEach((fi, k) => (out[fi] = icon[io[k]]));
  return out;
}

export default function DotFrame({
  icon,
  label,
  action,
  className = "",
  padding = "p-6 md:p-8",
  children,
}: {
  icon: DotIconName;
  label: string;
  action?: Action;
  className?: string;
  padding?: string;
  children: ReactNode;
}) {
  const { playTick } = useSound();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLElement>(null);

  const dotsRef = useRef<Pt[]>([]);
  const frameRef = useRef<Pt[]>([]);
  const targetRef = useRef<Pt[]>([]);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const mixRef = useRef({ v: 0 });
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(false);
  const hasActionRef = useRef(!!action);
  hasActionRef.current = !!action;
  const [open, setOpen] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h, dpr } = sizeRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const m = mixRef.current.v;
    // ink -> accent as the dots settle into the icon
    const r = Math.round(11 + (214 - 11) * m);
    const g = Math.round(11 + (40 - 11) * m);
    const b = Math.round(12 + (40 - 12) * m);
    ctx.fillStyle = `rgba(${r},${g},${b},${0.35 + 0.65 * m})`;
    for (const d of dotsRef.current) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const setup = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const rect = wrap.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sizeRef.current = { w, h, dpr };
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const frame = rectPoints(w, h);
    const S = Math.min(Math.max(Math.min(w, h) * 0.5, 64), 150);
    const scale = S / 24;
    const cx = w / 2;
    const cy = h / 2 - (hasActionRef.current ? 10 : 0);
    const raw = sampleIcon(icon, COUNT).map((p) => ({
      x: cx - S / 2 + p.x * scale,
      y: cy - S / 2 + p.y * scale,
    }));
    const targets = pairByAngle(frame, raw, { x: w / 2, y: h / 2 }, { x: cx, y: cy });
    frameRef.current = frame;
    targetRef.current = targets;

    // Resize invalidates the timeline: snap to the current state and rebuild lazily.
    tlRef.current?.kill();
    tlRef.current = null;
    const isOpen = openRef.current;
    dotsRef.current = (isOpen ? targets : frame).map((p) => ({ x: p.x, y: p.y }));
    mixRef.current.v = isOpen ? 1 : 0;
    gsap.set(contentRef.current, { autoAlpha: isOpen ? 0 : 1, y: isOpen ? -6 : 0 });
    if (actionRef.current) gsap.set(actionRef.current, { autoAlpha: isOpen ? 1 : 0 });
    draw();
  }, [icon, draw]);

  const build = useCallback(() => {
    const dots = dotsRef.current;
    const frame = frameRef.current;
    const targets = targetRef.current;
    const { w, h } = sizeRef.current;
    const mix = mixRef.current;
    const tl = gsap.timeline({ paused: true, onUpdate: draw });

    tl.to(contentRef.current, { autoAlpha: 0, y: -6, duration: 0.25, ease: "power2.out" }, 0);

    // 1) burst: dots loosen outward from the center
    const cx = w / 2;
    const cy = h / 2;
    dots.forEach((d, i) => {
      const dx = frame[i].x - cx;
      const dy = frame[i].y - cy;
      const len = Math.hypot(dx, dy) || 1;
      tl.to(
        d,
        { x: frame[i].x + (dx / len) * 14, y: frame[i].y + (dy / len) * 14, duration: 0.18, ease: "power2.out" },
        0.05
      );
    });
    const burstEnd = 0.23;

    // 2) flow into the icon, center-out, with a small overshoot ("connect")
    const tcx = targets.reduce((a, p) => a + p.x, 0) / targets.length;
    const tcy = targets.reduce((a, p) => a + p.y, 0) / targets.length;
    const dist = targets.map((p) => Math.hypot(p.x - tcx, p.y - tcy));
    const maxDist = Math.max(...dist) || 1;
    dots.forEach((d, i) => {
      tl.to(
        d,
        { x: targets[i].x, y: targets[i].y, duration: 0.75, ease: "back.out(1.4)" },
        burstEnd + (dist[i] / maxDist) * 0.25
      );
    });
    tl.to(mix, { v: 1, duration: 0.7, ease: "power1.inOut" }, burstEnd);
    if (actionRef.current) tl.to(actionRef.current, { autoAlpha: 1, duration: 0.25 }, ">-0.15");
    return tl;
  }, [draw]);

  const toggle = useCallback(() => {
    const next = !openRef.current;
    openRef.current = next;
    setOpen(next);
    playTick();
    if (!tlRef.current) tlRef.current = build();
    const tl = tlRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tl.progress(next ? 1 : 0).pause();
      draw();
    } else if (next) tl.play();
    else tl.reverse();
  }, [build, draw, playTick]);

  useEffect(() => {
    setup();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect();
      const s = sizeRef.current;
      if (Math.abs(r.width - s.w) > 1 || Math.abs(r.height - s.h) > 1) setup();
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      tlRef.current?.kill();
    };
  }, [setup]);

  const onWrapClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) return; // let real links work
    if (window.getSelection()?.toString()) return; // don't fire while selecting text
    toggle();
  };

  return (
    <div ref={wrapRef} onClick={onWrapClick} className={`relative cursor-pointer ${className}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      <div ref={contentRef} className={padding}>
        {children}
      </div>
      {action &&
        (action.href ? (
          <a
            ref={actionRef as React.RefObject<HTMLAnchorElement>}
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className="invisible absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-ink/60 opacity-0 hover:text-accent"
          >
            {action.label}
          </a>
        ) : (
          <span
            ref={actionRef as React.RefObject<HTMLSpanElement>}
            className="invisible absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-ink/40 opacity-0"
          >
            {action.label}
          </span>
        ))}
      {/* keyboard access: real button, visible only when focused */}
      <button
        type="button"
        aria-pressed={open}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:right-3 focus:top-3 focus:z-10 focus:bg-paper focus:px-2 focus:py-1 focus:text-xs"
      >
        {open ? `Show ${label}` : `Collapse ${label}`}
      </button>
    </div>
  );
}
