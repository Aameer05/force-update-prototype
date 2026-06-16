import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Iteration 4 — noon icon ↔ benefit notification.
 * Screen 1 (Figma 198:1925) and screen 2 (198:1762) are the raised-mockup
 * "Time for an update" frame. Unlike iteration 3, the noon icon does NOT morph:
 *   · noon state:  yellow noon app icon + refresh badge.
 *   · notif state: refresh badge fades out; a white notification pill fades in
 *     over the mockup's lower edge — a green bag-thunder icon + "Faster,
 *     smoother check out".
 *
 * Cycle: noon → 1 pill → 2 stacked pills (auto + click). The background rings
 * are static (no ripple wave). The phone mockup is raised (top 134 → 111) vs
 * iteration 3, applied inline on the mockup group.
 *
 * Everything else (ripple-ring background, phone card, in-phone status bar,
 * surface wash, headline, CTAs, version) is shared and static across states.
 *
 * Layering (low→high): rings(0) · mockup group(1) · surface wash(2) ·
 * content(4) · status bar(5) · notification(6).
 */

const A = "/assets/figma"; // shared status-bar icons
const I3 = "/assets/figma/i3"; // shared screen exports (rings, mockup, noon…)
const I4 = "/assets/figma/i4"; // iteration-4 exports (bag-thunder)
const EASE = [0.22, 1, 0.36, 1] as const;
const MORPH = { duration: 0.5, ease: EASE } as const; // refresh badge fade
// Pill "pops out" of the noon icon: a springy drop-in that overshoots and
// settles (the bounce on landing). Exit retracts quickly back toward the icon.
const NOTIF_IN = {
  default: { type: "spring", bounce: 0.5, duration: 0.72 },
  opacity: { duration: 0.28, ease: "easeOut" },
} as const;
// Retract: pills travel up into the noon icon, shrinking + fading (accelerating
// ease-in, as if absorbed). Staggered per depth so the rest follow the front.
const NOTIF_OUT = { duration: 0.46, ease: [0.4, 0, 1, 1] } as const;

const NOON_SHADOW =
  "0px 62.689px 17.222px 0px rgba(225,202,212,0), 0px 39.956px 15.844px 0px rgba(225,202,212,0.01), 0px 22.733px 13.778px 0px rgba(225,202,212,0.05), 0px 10.333px 10.333px 0px rgba(225,202,212,0.09), 0px 2.756px 5.511px 0px rgba(225,202,212,0.1), 0px 3.631px 29.045px 0px rgba(0,0,0,0.04)";

// Concentric ripple rings — [name, left, top, width, height, inset%] from Figma.
const RINGS: Array<[string, number, number, number, number, number]> = [
  ["ring2", -33.94, 52.06, 428.348, 428.348, 3.35],
  ["ring4", -82, 4, 524.469, 524.47, 2.74],
  ["ring3", 12.97, 98.98, 334.519, 334.519, 4.29],
  ["ring1", 61.92, 147.92, 236.629, 236.629, 6.07],
];

// Notification stack — pills pop out of the noon icon; each new one lands on
// top while the previous greys out and scales down behind it (Figma 201:2310).
// Every pill shows the same notification — all three Figma states put "Faster,
// smoother check out" on the front; stacking just adds demoted cards behind it.
const PILL_TEXT = "Faster, smoother check out";
const MAX_PILLS = 3;
const STATES = 1 + MAX_PILLS; // 0 = noon, 1/2/3 = 1–3 stacked pills
const HOLD = [2400, 1600, 1600, 2000]; // dwell per state (ms); 3-stack holds ~2s

// Per-depth resting style in the stack (0 = front/newest). The front pill is
// content-sized (largest); demoted cards take fixed widths so they're clearly
// smaller, and sit higher + fainter so they peek above it (Figma 198:1844).
const DEPTH: Array<{ y: number; w: number | null; h: number | null; bg: string; bw: number }> = [
  { y: 0, w: null, h: null, bg: "#ffffff", bw: 2 }, // front: content-sized, tallest
  { y: -14, w: 171, h: 34, bg: "#fcfcfc", bw: 1.5 }, // y365
  { y: -22, w: 147, h: 34, bg: "rgba(255,255,255,0.7)", bw: 1 }, // y357
];

function useInstant() {
  return useState(
    () =>
      typeof document !== "undefined" &&
      (document.hidden ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  )[0];
}

export default function Iteration4Flow() {
  const instant = useInstant();
  const ini = (v: Record<string, number>) => (instant ? false : v);
  const [idx, setIdx] = useState(0); // 0 = noon, 1 = one pill, 2 = stacked

  // Auto-cycle: noon → 1 pill → 2 stacked → loop.
  useEffect(() => {
    if (instant) return;
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % STATES), HOLD[idx]);
    return () => window.clearTimeout(t);
  }, [idx, instant]);

  const isNoon = idx === 0;

  return (
    <div className="screen" onClick={() => setIdx((i) => (i + 1) % STATES)}>
      {/* Background ripple rings (z0) — fade in on load */}
      <motion.div
        className="i3-rings"
        aria-hidden
        initial={ini({ opacity: 0 })}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {RINGS.map(([name, left, top, w, h, inset]) => (
          <div key={name} style={{ position: "absolute", left, top, width: w, height: h, opacity: 0.1 }}>
            <div style={{ position: "absolute", inset: `${-inset}%` }}>
              <img src={`${I3}/${name}.svg`} alt="" style={{ display: "block", width: "100%", height: "100%", maxWidth: "none" }} />
            </div>
          </div>
        ))}
      </motion.div>

      <StatusBar />

      {/* Phone mockup group (z1) — zooms + fades in as one unit.
          Iteration 4 (Figma 198:1925) raises the mockup from top 134 → 111. */}
      <motion.div
        className="i3-mockup"
        style={{ transformOrigin: "50% 32%", top: 111 }}
        initial={ini({ opacity: 0, scale: 0.92, y: 10 })}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      >
        {/* white phone card */}
        <img className="i3-card" src={`${I3}/mockup-bg.svg`} alt="" />

        {/* in-phone status bar */}
        <span className="i3-phone-time">9:41</span>
        <img className="i3-phone-signal" src={`${I3}/phone-signal.svg`} alt="" />
        <img className="i3-phone-battery" src={`${I3}/phone-battery.svg`} alt="" />
        <div className="i3-phone-island" />

        {/* noon app icon — static across both states (no morph) */}
        <div className="i3-appicon" style={{ boxShadow: NOON_SHADOW }}>
          <img className="i3-appicon-mark" src={`${I3}/noon.svg`} alt="noon" />
        </div>

        {/* refresh badge — noon state only; fades out for the notification */}
        <motion.div className="i3-refresh" initial={false} animate={{ opacity: isNoon ? 1 : 0, scale: isNoon ? 1 : 0.8 }} transition={MORPH}>
          <div className="i3-refresh-icon">
            <img src={`${I3}/refresh.svg`} alt="" />
          </div>
        </motion.div>
      </motion.div>

      {/* Surface wash (z2) — dissolves the card's lower edge into #F9F9FB */}
      <div className="i3-surface" aria-hidden>
        <div style={{ position: "absolute", inset: "-23.58% -19.27%" }}>
          <img src={`${I3}/surface-fade.svg`} alt="" style={{ display: "block", width: "100%", height: "100%", maxWidth: "none" }} />
        </div>
      </div>

      {/* Notification stack (z6/7) — each pill pops out of the noon icon and
          lands on top; the previous one greys out and scales down behind it.
          depth 0 = front/newest (white, content); depth ≥1 = demoted (grey,
          content faded, slightly smaller and higher so it peeks above). */}
      <AnimatePresence>
        {Array.from({ length: idx }, (_, i) => {
          const depth = idx - 1 - i; // 0 = front (newest)
          const isFront = depth === 0;
          const d = DEPTH[Math.min(depth, DEPTH.length - 1)];
          // Single pill sits a touch higher (y367); once stacked the front is y379.
          const restY = isFront && idx === 1 ? -12 : d.y;
          const size = d.w != null ? { width: d.w, height: d.h as number } : {};
          return (
            <motion.div
              key={i}
              className="i4-notif"
              aria-hidden
              style={{ transformOrigin: "center top", zIndex: 7 - depth }}
              initial={{ opacity: 0, y: -64, scale: 0.5, backgroundColor: "#ffffff", borderWidth: 2 }}
              animate={{
                opacity: 1,
                y: restY,
                scale: 1,
                backgroundColor: d.bg,
                borderWidth: d.bw,
                ...size,
              }}
              exit={{
                opacity: 0,
                y: -100,
                scale: 0.32,
                transition: { ...NOTIF_OUT, delay: depth * 0.09 },
              }}
              transition={NOTIF_IN}
            >
              <motion.span
                className="i4-notif-content"
                initial={{ opacity: 1 }}
                animate={{ opacity: isFront ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <span className="i4-notif-icon">
                  <img src={`${I4}/bag-thunder.svg`} alt="" />
                </span>
                <span className="i4-notif-text">{PILL_TEXT}</span>
              </motion.span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Headline + CTAs (z4) — slide up once on load */}
      <div className="content" style={{ top: 473, zIndex: 4 }}>
        <div className="content-text">
          <motion.h1 className="title" initial={ini({ opacity: 0, y: 30 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.85 }}>
            Time for an update
          </motion.h1>
          <motion.p className="body" initial={ini({ opacity: 0, y: 30 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.92 }}>
            This version of noon is no longer supported. Update now to keep
            shopping safely
          </motion.p>
        </div>
        <div className="buttons">
          <motion.button className="btn btn-primary" initial={ini({ opacity: 0, y: 30 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 1.0 }}>
            Let’s update
          </motion.button>
          <motion.button className="btn btn-secondary" initial={ini({ opacity: 0, y: 30 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 1.07 }}>
            Continue on web
          </motion.button>
        </div>
      </div>

      <motion.div className="version" style={{ zIndex: 4 }} initial={ini({ opacity: 0, y: 30 })} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 1.14 }}>
        VERSION 2.0
      </motion.div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="statusbar" style={{ zIndex: 5 }}>
      <span className="sb-time">9:41</span>
      <img className="sb-cellular" src={`${A}/cellular.svg`} alt="" />
      <img className="sb-wifi" src={`${A}/wifi.svg`} alt="" />
      <img className="sb-battery" src={`${A}/battery.svg`} alt="" />
    </div>
  );
}
