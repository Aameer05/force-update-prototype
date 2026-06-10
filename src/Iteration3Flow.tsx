import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Iteration 3 — noon icon ↔ rotating benefit shields.
 * Pixel-faithful build of Figma frames 161:1543 (screen 1) and 122:3452
 * (screen 2). The two frames are identical except for the *icon zone* inside
 * the phone mockup:
 *   · noon state:    yellow noon app icon + refresh badge.
 *   · benefit state: an orange gradient *shield* + check-circle badge + a
 *     rotating benefit tagline (copy drawn from iteration 2).
 *
 * Cycle: noon icon → benefit 1 → benefit 2 → benefit 3 → back to noon → loop.
 * The shield + check badge stay mounted across the three benefits; only the
 * tagline crossfades. Click/tap advances to the next state.
 *
 * Everything else (ripple-ring background, phone card, in-phone status bar,
 * surface wash, headline, CTAs, version) is shared and static across states.
 *
 * Layering (low→high): rings(0) · mockup group(1) · surface wash(2) ·
 * content(4) · status bar(5). All coordinates are the literal Figma values
 * (mockup-relative: the mockup is a 260×375 clipped box at top 134).
 */

const A = "/assets/figma"; // shared status-bar icons
const I3 = "/assets/figma/i3"; // this frame's real exports
const EASE = [0.22, 1, 0.36, 1] as const;
const MORPH = { duration: 0.5, ease: EASE } as const; // noon ↔ benefit enter/exit
// Benefit ↔ benefit swap: a slow, symmetric ease-in-out so the icon + caption
// dissolve smoothly rather than snapping (the EASE curve front-loads opacity).
const CROSSFADE = { duration: 0.7, ease: [0.4, 0, 0.2, 1] } as const;

const NOON_SHADOW =
  "0px 62.689px 17.222px 0px rgba(225,202,212,0), 0px 39.956px 15.844px 0px rgba(225,202,212,0.01), 0px 22.733px 13.778px 0px rgba(225,202,212,0.05), 0px 10.333px 10.333px 0px rgba(225,202,212,0.09), 0px 2.756px 5.511px 0px rgba(225,202,212,0.1), 0px 3.631px 29.045px 0px rgba(0,0,0,0.04)";

// Concentric ripple rings — [name, left, top, width, height, inset%] from Figma.
const RINGS: Array<[string, number, number, number, number, number]> = [
  ["ring2", -33.94, 52.06, 428.348, 428.348, 3.35],
  ["ring4", -82, 4, 524.469, 524.47, 2.74],
  ["ring3", 12.97, 98.98, 334.519, 334.519, 4.29],
  ["ring1", 61.92, 147.92, 236.629, 236.629, 6.07],
];

// Ripple wave — the same rings, sorted inner→outer so the per-ring stagger
// reads as one continuous emanation. Smooth expo-out ease for a fluid travel.
const WAVE_RINGS = [...RINGS].sort((a, b) => a[3] - b[3]);
const WAVE_EASE = [0.16, 1, 0.3, 1] as const;
const WAVE_DUR = 1.3; // each ring's travel (s)
const WAVE_STAGGER = 0.12; // delay between rings (s)

// Benefit slides — each pairs a glossy gradient icon with a tagline (copy from
// iteration 2; the shield + first line match Figma 122:3452). The pin and tag
// are authored in the shield's visual language (same gradient/rim/shadow).
const BENEFITS = [
  { icon: "shield", text: "Faster & smoother check out" },
  { icon: "pin", text: "Track your orders in real time" },
  { icon: "tag", text: "Exclusive app-only deals" },
];
const STATES = 1 + BENEFITS.length; // 0 = noon icon, 1..N = benefits
const HOLD_NOON = 2400; // noon-icon dwell (ms)
const HOLD_BENEFIT = 2200; // each benefit dwell (ms)

function useInstant() {
  return useState(
    () =>
      typeof document !== "undefined" &&
      (document.hidden ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  )[0];
}

export default function Iteration3Flow() {
  const instant = useInstant();
  const ini = (v: Record<string, number>) => (instant ? false : v);
  const [idx, setIdx] = useState(0); // 0 = noon, 1..N = benefit taglines

  // Expanding ripple wave — remounted (via waveKey) on each real icon change so
  // it replays from scratch. prevIdx guards against firing on load / React's
  // dev double-invoke: it only triggers when idx actually moves off its prior value.
  const [waveKey, setWaveKey] = useState(0);
  const prevIdx = useRef(0);

  // Auto-cycle: noon → benefit 1 → 2 → 3 → noon → …
  useEffect(() => {
    if (instant) return;
    const t = window.setTimeout(
      () => setIdx((i) => (i + 1) % STATES),
      idx === 0 ? HOLD_NOON : HOLD_BENEFIT
    );
    return () => window.clearTimeout(t);
  }, [idx, instant]);

  // Fire a wave only when the icon actually changes — never on mount.
  useEffect(() => {
    if (instant) return;
    if (prevIdx.current === idx) return;
    prevIdx.current = idx;
    setWaveKey((k) => k + 1);
  }, [idx, instant]);

  const isNoon = idx === 0;
  const isBenefit = idx !== 0;

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

      {/* Expanding ripple wave (z0) — a copy of the design's ring set. Keyed by
          waveKey so it remounts and replays on each real icon change. Rings are
          staggered inner→outer for a fluid, continuous emanation that travels
          off-screen and fades. Same faint light-grey tone as the static rings. */}
      {waveKey > 0 && (
        <div className="i3-ripple" aria-hidden key={waveKey}>
          {WAVE_RINGS.map(([name, left, top, w, h, inset], i) => (
            <motion.div
              key={name}
              style={{ position: "absolute", left, top, width: w, height: h }}
              initial={{ scale: 0.78, opacity: 0.15 }}
              animate={{ scale: 2.0, opacity: 0 }}
              transition={{ duration: WAVE_DUR, ease: WAVE_EASE, delay: i * WAVE_STAGGER }}
            >
              <div style={{ position: "absolute", inset: `${-inset}%` }}>
                <img src={`${I3}/${name}.svg`} alt="" style={{ display: "block", width: "100%", height: "100%", maxWidth: "none" }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <StatusBar />

      {/* Phone mockup group (z1) — zooms + fades in as one unit */}
      <motion.div
        className="i3-mockup"
        style={{ transformOrigin: "50% 32%" }}
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

        {/* ---- ICON ZONE: noon icon crossfades to a rotating benefit shield ---- */}

        {/* noon state — yellow noon app icon */}
        <motion.div
          className="i3-appicon"
          style={{ boxShadow: NOON_SHADOW }}
          initial={false}
          animate={{ opacity: isNoon ? 1 : 0, scale: isNoon ? 1 : 0.85 }}
          transition={MORPH}
        >
          <img className="i3-appicon-mark" src={`${I3}/noon.svg`} alt="noon" />
        </motion.div>

        {/* noon state — refresh badge */}
        <motion.div className="i3-refresh" initial={false} animate={{ opacity: isNoon ? 1 : 0, scale: isNoon ? 1 : 0.8 }} transition={MORPH}>
          <div className="i3-refresh-icon">
            <img src={`${I3}/refresh.svg`} alt="" />
          </div>
        </motion.div>

        {/* benefit state — gradient icon. The container handles the noon↔benefit
            enter/exit; the inner keyed layer crossfades shape per benefit. */}
        <motion.div className="i3-shield" initial={false} animate={{ opacity: isBenefit ? 1 : 0, scale: isBenefit ? 1 : 0.85 }} transition={MORPH}>
          <AnimatePresence>
            {isBenefit && (
              <motion.div key={idx} className="i3-shield-glow" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={CROSSFADE}>
                <img src={`${I3}/${BENEFITS[idx - 1].icon}.svg`} alt="" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* benefit state — check-circle badge */}
        <motion.div className="i3-check" initial={false} animate={{ opacity: isBenefit ? 1 : 0, scale: isBenefit ? 1 : 0.8 }} transition={MORPH}>
          <img src={`${I3}/check-circle.svg`} alt="" />
        </motion.div>

        {/* benefit state — rotating tagline (each crossfades to the next) */}
        <AnimatePresence>
          {isBenefit && (
            <motion.p
              key={idx}
              className="i3-benefit-caption"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={CROSSFADE}
            >
              {BENEFITS[idx - 1].text}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Surface wash (z2) — dissolves the card's lower edge into #F9F9FB */}
      <div className="i3-surface" aria-hidden>
        <div style={{ position: "absolute", inset: "-23.58% -19.27%" }}>
          <img src={`${I3}/surface-fade.svg`} alt="" style={{ display: "block", width: "100%", height: "100%", maxWidth: "none" }} />
        </div>
      </div>

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
