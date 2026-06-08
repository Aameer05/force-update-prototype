# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A clickable, **pixel-faithful prototype** of noon's "Force app update" mobile screens, recreated 1:1 from Figma (file `LvxNos4nL9kpCU0OJiCTSl`). It's a design/animation playground, not a production app — the goal is matching the Figma exactly and iterating on the entrance/transition animations.

Stack: **Vite + React 18 + TypeScript + Framer Motion**. No test suite, no linter configured.

## Commands

```bash
npm install
npm run dev        # Vite dev server on http://localhost:5173 (host: true)
npm run build      # tsc -b && vite build  — use this to typecheck/verify changes
npm run preview    # serve the production build
```

There are no tests or lint scripts. **`npm run build` is the verification step** — it runs `tsc -b` (strict mode), so a green build means types are sound.

## Iterations live on git branches

This is the most important structural fact: **each design iteration is a separate branch of the same folder.**

- `main` → **iteration 1**
- `iteration-2` → **iteration 2**

Only one branch is checked out at a time, so the files you see are whichever iteration is active. `App.tsx` renders a single flow component, and that import differs per branch (e.g. `ForceUpdateFlow` on `main`, `Iteration2Flow` on `iteration-2`). When asked to "check iteration 1" while working on iteration 2, run iteration 1 from a *different* checkout/port rather than switching the working branch.

Each iteration deploys to its **own Vercel project** (see Deploy below), so branch ↔ project must stay matched.

## Architecture

`main.tsx` → `App.tsx` renders one flow component inside `<div className="device">` (the fixed 375×812 phone frame). Everything is one screen that *morphs* — there's no router.

**Flow components** (`ForceUpdateFlow.tsx`, `Iteration2Flow.tsx`) are the real app. Each is self-contained (its own constants, sub-components, and a `step` state machine) and choreographs the whole sequence with Framer Motion. **Standalone screen components** (`ForceUpdateScreen.tsx`, `SecondScreen.tsx`, `Iteration2Screen2.tsx`) are static single-screen builds of individual Figma frames, kept as references — the flows are what `App.tsx` actually uses.

`index.css` holds: `@font-face` for Noontree (noon's brand font), noon **design tokens** in `:root` (colors/radii pulled from Figma), the `.device` frame, and the shared screen classes (`.screen`, `.statusbar`, `.phone`, `.content`, `.buttons`, `.version`, `.morph-noon`, `.surface-scrim`, `.fades`, etc.). Flows reuse these classes and add per-element inline styles for exact pixel values.

### Animation conventions (read before touching motion)

- **`step` state machine** (`1 | 2 | 3`) drives the whole sequence via `useEffect` timers that auto-advance and loop; clicking the screen also advances. A `STEP` config object maps each step to layout values (positions/sizes) that Framer springs between.
- **`useInstant()`** returns `true` for `prefers-reduced-motion` *or* a backgrounded tab (`document.hidden`), and the code renders everything at its resting state (skips entrances). This exists because backgrounded tabs pause `requestAnimationFrame`, which would otherwise freeze Framer mid-animation.
- **Multi-element choreography uses keyframe arrays + `times`** over a single shared duration (`PILL_SEQ_DUR`, etc.) so independent elements stay in lockstep (e.g. pills absorbing one-by-one while the noon icon pulses on each landing). When adjusting timing, keep the `times` fractions aligned with the events they react to.
- **z-index layering is load-bearing and intentional** — e.g. `phone(1) < pills(2) < surface fade(3) < content(4) < noon icon(5) < badge(6)`. This is what lets the fade dissolve the peeking pills, keeps the card border off the pills, and lets an absorbing pill tuck *behind* the icon. The entrance is one wrapping `.mockup-group` (fade + zoom in together) with these z-layers as children. Don't flatten or reorder without re-checking these effects.
- **375×812, no scroll:** `html/body/#root` are `overflow: hidden`, `.device` is a fixed 375×812 box. Keep it that way.

### Assets are real Figma exports — do not hand-draw

`public/assets/figma/` (plus `figma/s2/` for frame 18 and `figma/i2/` for frame 22) are the **actual SVGs exported from Figma Dev Mode** (background fade/gradient blobs, the noon logo, status-bar icons, the bag/refresh icons). `public/fonts/` holds the Noontree weights. When recreating a Figma element, pull the real export rather than approximating it — earlier hand-drawn versions (e.g. the old `noon-mark.svg`, the CSS-gradient "fades") never matched and were replaced. Get exact specs from Figma via `get_design_context` (with `forceCode: true`) and tokens via `get_variable_defs`; place elements at the literal Figma coordinates.

## Deploy (Vercel)

Deploys are CLI-based (`vercel --prod`), **not** git-integrated, and `.vercel/` is gitignored. There is one project per iteration:

- `force-update-prototype` → iteration 1 → https://force-update-prototype.vercel.app
- `force-update-iteration-2` → iteration 2 → https://force-update-iteration-2.vercel.app

Because one folder maps to one `.vercel` link at a time, deploying the right iteration means linking first:

```bash
vercel link --yes --project force-update-iteration-2   # match the project to the branch
npm run build
vercel --prod --yes
```

Use the **production alias** URLs above (public). The per-deployment `*.vercel.app` URLs are behind Vercel deployment protection (login required) and will look "expired" if opened directly.
