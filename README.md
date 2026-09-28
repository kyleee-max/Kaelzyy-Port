# Kaelsty Portfolio

Next.js 14 (App Router) + TypeScript + Tailwind, Framer Motion for micro-interactions,
GSAP for the intro particle morph.

## Run locally

```bash
npm install
npm run dev
```

Deploy: push to a git repo and import it on Vercel — zero config needed, it's a standard
Next.js app.

## What to fill in before you ship this

- `lib/data.ts` — swap the placeholder projects, hero statement, and about narrative
  for your real copy. Everything content-related lives in this one file.
- `components/Hero.tsx` — replace the placeholder circle with your real photo
  (swap the `div` with `next/image`, keep the `rounded-full` + `border-2 border-ink`
  classes on the wrapper so the orbit dot math still lines up).
- Sound — `lib/SoundProvider.tsx` currently synthesizes a small sine "tick" via the
  Web Audio API so the click-to-flip / intro-gate interactions have *something*
  audible out of the box without shipping audio files. Drop real `.wav`/`.mp3`
  assets into `/public/sfx` and swap `playTick` for an `<audio>`-based player
  whenever you have sound design you like better.
- Favicon / metadata — `app/layout.tsx` has the `<title>` and description; add a
  `app/favicon.ico` when you have one.

## Notes on implementation choices

- The intro gate is a `<canvas>` with 64 dots: random → breathing idle state →
  (on click) tweened by GSAP into a circle ("O") → morphed into a checkmark →
  fades out into the real page. The same click resumes the `AudioContext`, which
  is what unlocks sound for the rest of the site (browsers require a user
  gesture for that).
- Scroll reveals (About, Stack) use Framer Motion's `whileInView` rather than
  GSAP ScrollTrigger — same visual result, one less animation library wired
  into the bundle. Swap in ScrollTrigger if you want more granular scrub
  control later.
- Project cards flip on click (not hover), so they work the same on touch and
  desktop, per the brief.
- Colors, type and spacing all live in `tailwind.config.ts` / `app/globals.css`
  if you want to tune the palette (`accent` is `#D62828` right now).
