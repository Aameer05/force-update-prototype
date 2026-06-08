import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Iteration 2 — screen 1 → screen 2 flow.
 * Frame 16 (91:1385, kept identical to iteration 1) → frame 22 (103:1892).
 *
 * Sequence on load:
 *  1. Entrance — the mockup moves in; headline / CTAs slide up ONCE then stay put.
 *  2. The noon icon morphs from its screen-1 spot (148px) to its screen-2 spot
 *     (124px); the refresh badge fades out.
 *  3. Green benefit pills rise from behind the text — only TWO visible at a time
 *     (front readable + one peeking, dissolved by the surface fade). The front
 *     holds ~2s, then quickly tucks UP into the noon icon (which pulses to
 *     "catch" it) while the next promotes to the front.
 *  4. Loops back to the screen-1 default.
 *
 * Layering (low→high): bg-fades(0) · pills(1) · mockup-group[phone, surface
 * fade, noon, badge](2) · content/text(4). So the fade overlaps the peeking
 * pills and the absorbing pill tucks behind the noon, while the front pill —
 * sitting above the fade's region — stays crisp and the text stays on top.
 */

const A = "/assets/figma";
const I2 = "/assets/figma/i2";
const EASE = [0.22, 1, 0.36, 1] as const;
const ENTRANCE = { duration: 0.7, ease: EASE, delay: 0.1 } as const; // "moves in"

const NOON_SHADOW =
  "0px 62.689px 17.222px 0px rgba(225,202,212,0), 0px 39.956px 15.844px 0px rgba(225,202,212,0.01), 0px 22.733px 13.778px 0px rgba(225,202,212,0.05), 0px 10.333px 10.333px 0px rgba(225,202,212,0.09), 0px 2.756px 5.511px 0px rgba(225,202,212,0.1)";
const PILL_SHADOW =
  "0px 15px 7.5px rgba(138,138,138,0.05), 0px 6px 6px rgba(138,138,138,0.08), 0px 3px 5px rgba(138,138,138,0.1)";
const PILL_BG = "linear-gradient(110deg, #ddfff2 10%, #f9fffd 80%)";
const PILL_BORDER = "1px solid rgba(44, 222, 86, 0.4)";

function useInstant() {
  return useState(
    () =>
      typeof document !== "undefined" &&
      (document.hidden ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  )[0];
}

const STEP = {
  1: { phoneTop: 151.27, noonLeft: 113, noonTop: 219, noonSize: 148, noonRadius: 29.6, noonBorder: 1.644, blue: 1 },
  2: { phoneTop: 101, noonLeft: 125, noonTop: 180.73, noonSize: 124, noonRadius: 24.8, noonBorder: 1.378, blue: 0 },
} as const;

const PILL_TEXTS = ["Faster, smoother check out", "Track your orders in real time", "Exclusive app-only deals"];
const PILL_START = 0.55; // wait for the noon morph
const PILL_SEQ_DUR = 7.8; // whole 3-pill sequence (≈2s read each, snappy in/out)
const ABSORB_Y = 242.73 - 391; // pill centre (391) → noon-icon centre (242.73)

// Slots: FRONT y0 / PEEK y64 (dissolved by the fade) / HIDE y150 / ICON.
// The pill NEVER fades — it stays fully opaque the whole time and simply shrinks
// up and tucks BEHIND the noon icon (which covers it). Opacity only goes 0→1 on
// emerge; from then on it's 1 and the icon hides it as it lands.
const PILL_KEYS: Record<number, { y: number[]; scale: number[]; opacity: number[]; times: number[] }> = {
  0: {
    y: [150, 0, 0, ABSORB_Y, ABSORB_Y],
    scale: [0.8, 1, 1, 0.18, 0.18],
    opacity: [0, 1, 1, 1, 1],
    times: [0, 0.0449, 0.3013, 0.3526, 1],
  },
  1: {
    y: [150, 64, 64, 0, 0, ABSORB_Y, ABSORB_Y],
    scale: [0.8, 0.9, 0.9, 1, 1, 0.18, 0.18],
    opacity: [0, 0.5, 0.5, 1, 1, 1, 1], // fainter while peeking, full at front
    times: [0, 0.0449, 0.3013, 0.3526, 0.609, 0.6603, 1],
  },
  2: {
    y: [150, 150, 64, 64, 0, 0, ABSORB_Y, ABSORB_Y],
    scale: [0.8, 0.8, 0.9, 0.9, 1, 1, 0.18, 0.18],
    opacity: [0, 0, 0.5, 0.5, 1, 1, 1, 1], // fainter while peeking, full at front
    times: [0, 0.3526, 0.3974, 0.609, 0.6603, 0.9167, 0.9679, 1],
  },
};
const PILL_REST = { y: 150, scale: 0.8, opacity: 0 };

// noon-icon "catch" pulse — stays at rest, then a quick ~0.18s pop exactly as
// each pill lands (landings at 0.353 / 0.660 / 0.968 of the sequence). Holding
// flat between pops keeps it snappy and on-rhythm rather than a slow swell.
const NOON_PULSE = [1, 1, 1.13, 1, 1, 1.13, 1, 1, 1.13, 1, 1];
const NOON_PULSE_TIMES = [0, 0.327, 0.3526, 0.378, 0.635, 0.6603, 0.686, 0.943, 0.9679, 0.993, 1];

export default function Iteration2Flow() {
  const instant = useInstant();
  const ini = (v: Record<string, number>) => (instant ? false : v);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (instant) return;
    const delay = step === 1 ? 2200 : (PILL_START + PILL_SEQ_DUR + 0.4) * 1000;
    const t = window.setTimeout(() => setStep(step === 1 ? 2 : 1), delay);
    return () => window.clearTimeout(t);
  }, [step, instant]);

  const S = STEP[step];
  const spring = { type: "spring", stiffness: 200, damping: 26 } as const;

  return (
    <div className="screen" onClick={() => setStep((s) => (s === 1 ? 2 : 1))}>
      <Fades />
      <StatusBar />

      {/* Mockup group — the whole mockup (phone + pills + fade + noon + badge)
          moves in TOGETHER on load (fade + zoom + rise), exactly like iteration
          1. Internal z-layers keep the stroke/overlap fixes:
          phone(1) < pills(2) < fade(3) < noon(5) < badge(6). */}
      <motion.div
        className="mockup-group"
        style={{ transformOrigin: "50% 36%", zIndex: 2 }}
        initial={ini({ opacity: 0, scale: 0.92, y: 10 })}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={ENTRANCE}
      >
        {/* phone card (z1) */}
        <motion.div className="phone" style={{ zIndex: 1 }} initial={false} animate={{ top: S.phoneTop }} transition={spring}>
          <div className="phone-island" />
          <img className="phone-camera" src={`${A}/phone-camera.svg`} alt="" />
          <span className="phone-time">9:41</span>
          <img className="phone-battery" src={`${A}/phone-battery.svg`} alt="" />
        </motion.div>

        {/* pills (z2) */}
        {[2, 1, 0].map((order) => (
          <BenefitPill key={order} active={step === 2} order={order} text={PILL_TEXTS[order]} />
        ))}

        {/* surface fade (z3) */}
        <FadeSurface />

        {/* noon icon (z5) — pulses as each pill lands */}
        <motion.div
          className="morph-noon"
          style={{ boxShadow: NOON_SHADOW, zIndex: 5 }}
          initial={false}
          animate={{
            left: S.noonLeft,
            top: S.noonTop,
            width: S.noonSize,
            height: S.noonSize,
            borderRadius: S.noonRadius,
            borderWidth: S.noonBorder,
            scale: step === 2 ? NOON_PULSE : 1,
          }}
          transition={{ ...spring, scale: step === 2 ? { duration: PILL_SEQ_DUR, delay: PILL_START, times: NOON_PULSE_TIMES, ease: "easeOut" } : spring }}
        >
          <img src={`${I2}/noon.svg`} alt="noon" className="morph-noon-mark" />
        </motion.div>

        {/* refresh badge (z6) — only on screen 1 */}
        <motion.div
          className="appicon-badge"
          style={{ left: 229, top: 335, zIndex: 6 }}
          initial={false}
          animate={{ opacity: S.blue, scale: S.blue ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          <img src={`${A}/refresh.svg`} alt="" style={{ width: 24, height: 24 }} />
        </motion.div>
      </motion.div>

      {/* Headline + CTAs — slide up ONCE on load, then never move */}
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

/* ------------------------------------------------------------------ */
/* Benefit pill                                                        */
/* ------------------------------------------------------------------ */

function BenefitPill({ active, order, text }: { active: boolean; order: number; text: string }) {
  const k = PILL_KEYS[order];
  const animate = active ? { y: k.y, scale: k.scale, opacity: k.opacity } : PILL_REST;
  const transition = active
    ? { duration: PILL_SEQ_DUR, delay: PILL_START, ease: [0.4, 0, 0.2, 1], times: k.times }
    : { duration: 0.3, opacity: { duration: 0.15 } }; // vanish fast on loop reset

  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 363, display: "flex", justifyContent: "center", zIndex: 2, pointerEvents: "none" }}>
      <motion.div
        style={{ display: "flex", alignItems: "center", gap: 8, height: 56, paddingLeft: 16, paddingRight: 20, borderRadius: 9999, border: PILL_BORDER, background: PILL_BG, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: PILL_SHADOW, transformOrigin: "center" }}
        initial={false}
        animate={animate}
        transition={transition}
      >
        <BagFilled size={28} />
        <span style={{ color: "#12a168", fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: 14, lineHeight: "20px", letterSpacing: "-0.1px", whiteSpace: "nowrap" }}>
          {text}
        </span>
      </motion.div>
    </div>
  );
}

function BagFilled({ size }: { size: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <img src={`${I2}/bag-filled.svg`} alt="" style={{ position: "absolute", left: "15.66%", top: "10.55%", width: "79.13%", height: "84.24%", display: "block" }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

function FadeSurface() {
  // Strong, readable surface fade (z3): transparent above the front pill,
  // ramping to solid #f9f9fb by the headline — dissolves the phone's lower edge
  // and the peeking pills, and reads clearly behind the text. Fades in with the
  // mockup group on load (no own entrance).
  return (
    <div
      className="surface-scrim"
      aria-hidden
      style={{ top: 415, zIndex: 3, background: "linear-gradient(180deg, rgba(249,249,251,0) 0%, rgba(249,249,251,0.92) 11%, #f9f9fb 18%)" }}
    />
  );
}

function Fades() {
  return (
    <div className="fades" aria-hidden>
      <div style={{ position: "absolute", left: -159.65, top: -80.46, width: 667.643, height: 721.575, transform: "rotate(180deg)" }}>
        <img src={`${A}/fade-1.svg`} style={{ position: "absolute", left: -100, top: -100, width: 867.643, height: 921.575, maxWidth: "none", display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: 107.99, top: -180.41, width: 809.22, height: 850.059, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "rotate(167.37deg)" }}>
          <div style={{ position: "relative", width: 667.643, height: 721.575 }}>
            <img src={`${A}/fade-2.svg`} style={{ position: "absolute", left: -100, top: -100, width: 867.643, height: 921.575, maxWidth: "none", display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="statusbar">
      <span className="sb-time">9:41</span>
      <img className="sb-cellular" src={`${A}/cellular.svg`} alt="" />
      <img className="sb-wifi" src={`${A}/wifi.svg`} alt="" />
      <img className="sb-battery" src={`${A}/battery.svg`} alt="" />
    </div>
  );
}
