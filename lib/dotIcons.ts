// Icon outlines (24x24 viewBox, lucide-style) that the dots morph into.
export const DOT_ICONS = {
  link: [
    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
    "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  ],
  user: [
    "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
    "M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8Z",
  ],
  layers: [
    "M12 2 2 7l10 5 10-5-10-5Z",
    "m2 17 10 5 10-5",
    "m2 12 10 5 10-5",
  ],
  send: ["m22 2-7 20-4-9-9-4Z", "M22 2 11 13"],
} as const;

export type DotIconName = keyof typeof DOT_ICONS;

export type Pt = { x: number; y: number };

const cache = new Map<string, Pt[]>();

/** Sample `count` points evenly (by length) along an icon's paths, in 24x24 space. */
export function sampleIcon(name: DotIconName, count: number): Pt[] {
  const hit = cache.get(name);
  if (hit) return hit;

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";
  document.body.appendChild(svg);

  const els = DOT_ICONS[name].map((d) => {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    return p;
  });
  const lens = els.map((p) => p.getTotalLength());
  const total = lens.reduce((a, b) => a + b, 0);

  // Split the dot budget across paths proportionally to their length.
  const alloc = lens.map((l) => Math.max(2, Math.round((count * l) / total)));
  let diff = count - alloc.reduce((a, b) => a + b, 0);
  const biggest = alloc.indexOf(Math.max(...alloc));
  alloc[biggest] += diff;
  diff = 0;

  const pts: Pt[] = [];
  els.forEach((p, k) => {
    for (let j = 0; j < alloc[k]; j++) {
      const t = alloc[k] === 1 ? 0 : j / (alloc[k] - 1);
      const pt = p.getPointAtLength(t * lens[k]);
      pts.push({ x: pt.x, y: pt.y });
    }
  });

  document.body.removeChild(svg);
  cache.set(name, pts);
  return pts;
}
