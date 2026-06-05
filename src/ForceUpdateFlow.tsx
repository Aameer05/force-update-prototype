import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Force app update — noon · entrance + screen 1 → screen 2 morph
 * Figma frames 16 (91:1385) and 18 (92:1543).
 *
 * Sequence on load:
 *  1. Entrance — the mockup (phone + noon icon + refresh badge + fade) moves in
 *     together, then the headline / CTAs slide up from the bottom.
 *  2. Morph — the big noon icon scales/moves down into the small noon badge, the
 *     green "Faster, smoother check out" stack pops in from the top, the refresh
 *     badge fades out, and the phone shifts up.
 *
 * Click anywhere to replay/toggle the morph.
 */

const A = "/assets/figma";
const A2 = "/assets/figma/s2";
const EASE = [0.22, 1, 0.36, 1] as const;

const NOON_SHADOW =
  "0px 74.822px 20.556px 0px rgba(225,202,212,0), 0px 47.689px 18.911px 0px rgba(225,202,212,0.01), 0px 27.133px 16.444px 0px rgba(225,202,212,0.05), 0px 12.333px 12.333px 0px rgba(225,202,212,0.09), 0px 3.289px 6.578px 0px rgba(225,202,212,0.1)";
const SHADOW_BACK =
  "0px 46.987px 12.908px rgba(225,202,212,0), 0px 29.948px 11.876px rgba(225,202,212,0.01), 0px 17.039px 10.327px rgba(225,202,212,0.05), 0px 7.745px 7.745px rgba(225,202,212,0.09), 0px 2.065px 4.131px rgba(225,202,212,0.1)";
const SHADOW_MID =
  "0px 56.384px 15.49px rgba(225,202,212,0), 0px 35.937px 14.251px rgba(225,202,212,0.01), 0px 20.447px 12.392px rgba(225,202,212,0.05), 0px 9.294px 9.294px rgba(225,202,212,0.09), 0px 2.478px 4.957px rgba(225,202,212,0.1)";
const SHADOW_FRONT =
  "0px 70.778px 19.444px rgba(225,202,212,0), 0px 45.111px 17.889px rgba(225,202,212,0.01), 0px 25.667px 15.556px rgba(225,202,212,0.05), 0px 11.667px 11.667px rgba(225,202,212,0.09), 0px 3.111px 6.222px rgba(225,202,212,0.1)";

/** Render at rest immediately for reduced motion / backgrounded tabs. */
function useInstant() {
  return useState(
    () =>
      typeof document !== "undefined" &&
      (document.hidden ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  )[0];
}

const STEP = {
  1: { phoneTop: 151.27, noonLeft: 113, noonTop: 219, noonSize: 148, noonRadius: 29.6, noonBorder: 1.644, blue: 1, green: 0 },
  2: { phoneTop: 123, noonLeft: 167, noonTop: 417, noonSize: 40, noonRadius: 8, noonBorder: 0.444, blue: 0, green: 1 },
} as const;

export default function ForceUpdateFlow() {
  const instant = useInstant();
  const ini = (v: Record<string, number>) => (instant ? false : v);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Looping sequence: default (1) → benefits (2) → absorb one-by-one (3) →
  // the noon icon grows back to the big centred default (1) → repeat.
  useEffect(() => {
    if (instant) return;
    const delay = step === 1 ? 2000 : step === 2 ? 1700 : 5600;
    const next = step === 1 ? 2 : step === 2 ? 3 : 1;
    const t = window.setTimeout(() => setStep(next as 1 | 2 | 3), delay);
    return () => window.clearTimeout(t);
  }, [step, instant]);

  // step 3 reuses the screen-2 layout; only the green container animates.
  const S = STEP[step === 3 ? 2 : step];
  const spring = { type: "spring", stiffness: 200, damping: 26 } as const;

  return (
    <div className="screen" onClick={() => setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : 1))}>
      <Fades />
      <StatusBar />

      {/* Phase 1 — the whole mockup moves in together */}
      <motion.div
        className="mockup-group"
        style={{ transformOrigin: "50% 36%" }}
        initial={ini({ opacity: 0, scale: 0.92, y: 10 })}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      >
        {/* Phone mockup card (holds the in-phone status bar + benefit stack) */}
        <motion.div
          className="phone"
          style={{ overflow: "hidden", zIndex: 1 }}
          initial={false}
          animate={{ top: S.phoneTop }}
          transition={spring}
        >
          <div className="phone-island" />
          <img className="phone-camera" src={`${A}/phone-camera.svg`} alt="" />
          <span className="phone-time">9:41</span>
          <img className="phone-battery" src={`${A}/phone-battery.svg`} alt="" />
        </motion.div>

        {/* surface fade — dissolves the mockup's lower edge into a clean
            surface behind the headline (above the phone, below the text).
            Sits 50px higher on screen 2. */}
        <motion.div
          className="surface-scrim"
          aria-hidden
          initial={false}
          animate={{ top: step >= 2 ? 250 : 300 }}
          transition={spring}
        />

        {/* Green benefit stack — pops in on screen 2, then scales down and
            flies into the noon icon on step 3 (absorbed into the app). */}
        <motion.div
          className="benefit-stack-wrap"
          style={{ transformOrigin: "187px 297px", zIndex: 3 }}
          initial={false}
          animate={
            step === 1
              ? { opacity: 0, y: -44, scale: 0.9 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ type: "spring", stiffness: 240, damping: 20, opacity: { duration: step === 1 ? 0.2 : 0.4, delay: step === 2 ? 0.18 : 0 } }}
        >
          <BenefitStack step={step} />
        </motion.div>

        {/* noon logo — morphs from the big icon to the small badge */}
        <motion.div
          className="morph-noon"
          style={{ boxShadow: NOON_SHADOW, zIndex: 4 }}
          initial={false}
          animate={{
            left: S.noonLeft,
            top: S.noonTop,
            width: S.noonSize,
            height: S.noonSize,
            borderRadius: S.noonRadius,
            borderWidth: S.noonBorder,
            scale: step === 3 ? [1, 1.1, 1, 1.1, 1, 1.1, 1] : 1,
          }}
          transition={{ ...spring, scale: step === 3 ? { duration: 5.2, delay: 0, times: [0, 0.065, 0.13, 0.548, 0.61, 0.97, 1], ease: "easeOut" } : spring }}
        >
          <img src={`${A}/noon.svg`} alt="noon" className="morph-noon-mark" />
        </motion.div>

        {/* refresh badge — sits ON TOP of the icon, fades out on the morph */}
        <motion.div
          className="appicon-badge"
          style={{ left: 229, top: 335, zIndex: 5 }}
          initial={false}
          animate={{ opacity: S.blue, scale: S.blue ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          <img src={`${A}/refresh.svg`} alt="" style={{ width: 24, height: 24 }} />
        </motion.div>
      </motion.div>

      {/* Phase 2 — headline + CTAs slide up from the bottom */}
      <div className="content" style={{ top: 473 }}>
        <div className="content-text">
          <motion.h1
            className="title"
            initial={ini({ opacity: 0, y: 30 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.85 }}
          >
            Time for an update
          </motion.h1>
          <motion.p
            className="body"
            initial={ini({ opacity: 0, y: 30 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.92 }}
          >
            This version of noon is no longer supported. Update now to keep
            shopping safely
          </motion.p>
        </div>
        <div className="buttons">
          <motion.button
            className="btn btn-primary"
            initial={ini({ opacity: 0, y: 30 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 1.0 }}
          >
            Let’s update
          </motion.button>
          <motion.button
            className="btn btn-secondary"
            initial={ini({ opacity: 0, y: 30 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 1.07 }}
          >
            Continue on web
          </motion.button>
        </div>
      </div>

      <motion.div
        className="version"
        initial={ini({ opacity: 0, y: 30 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE, delay: 1.14 }}
      >
        VERSION 2.0
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Benefit card stack                                                  */
/* ------------------------------------------------------------------ */

/**
 * The benefit stack absorbs into the noon icon ONE CARD AT A TIME on step 3:
 * each card slides up into the front slot, HOLDS ~2s so it can be read, then
 * scales down and flies into the noon icon — front card first, then the next,
 * then the back card.
 *
 * Every card is authored identically (140×140 green benefit card) so it reads
 * the same when promoted; a base transform places it in the stack. Cards use
 * transform-origin top-left, so x/y/scale move the top-left to the front slot
 * (117,226.95 @140) and then the icon (167,417 @40, i.e. x50 y190.05 s0.2857).
 */
const REST_T = { duration: 0.3, ease: [0.4, 0, 0.2, 1] } as const;

// Per-card resting transform (places the 140px card into its stacked spot).
const BASE = {
  front: { x: 0, y: 0, scale: 1 },
  mid: { x: 14.24, y: -9.93, scale: 0.7966 },
  back: { x: 23.53, y: -19.22, scale: 0.6639 },
} as const;

// Fly target: scaled to 33.6px (smaller than the 40px icon) and centred on the
// icon at (187,437), so the card tucks fully BEHIND the noon icon — it travels
// down and shrinks in, rather than fading out.
const FLY = { x: 53.2, y: 193.25, scale: 0.24 } as const;

function BenefitCard({
  step,
  base,
  promote, // animate via the front slot + 2s hold before flying
  delay,
  text,
  greenByDefault, // front card is green from the start; others start grey
}: {
  step: 1 | 2 | 3;
  base: { x: number; y: number; scale: number };
  promote: boolean;
  delay: number;
  text: string;
  greenByDefault: boolean;
}) {
  const a3 = step === 3;

  // Position/scale (no opacity fade — the card tucks behind the icon).
  const pos = !a3
    ? { x: base.x, y: base.y, scale: base.scale }
    : promote
    ? { x: [base.x, 0, 0, FLY.x], y: [base.y, 0, 0, FLY.y], scale: [base.scale, 1, 1, FLY.scale] }
    : { x: [base.x, FLY.x], y: [base.y, FLY.y], scale: [base.scale, FLY.scale] };
  const posT = !a3
    ? REST_T
    : promote
    ? { duration: 2.7, delay, ease: [0.4, 0, 0.4, 1], times: [0, 0.13, 0.87, 1] }
    : { duration: 0.4, delay, ease: [0.4, 0, 0.6, 1] };

  // Grey → green: the green overlay fades in as the card reaches the front slot.
  const greenOpacity = greenByDefault ? 1 : a3 && promote ? [0, 1, 1, 1] : 0;
  const greenT = greenByDefault
    ? { duration: 0 }
    : a3 && promote
    ? { duration: 2.7, delay, ease: "easeOut", times: [0, 0.15, 0.87, 1] }
    : { duration: 0.25 };

  return (
    <motion.div
      style={{ position: "absolute", left: 117, top: 226.95, width: 140, height: 140, borderRadius: 28, background: "#ececec", boxShadow: SHADOW_FRONT, overflow: "hidden", transformOrigin: "0 0" }}
      initial={false}
      animate={pos}
      transition={posT}
    >
      {/* green skin — fades in when the card promotes to the front slot */}
      <motion.div
        style={{ position: "absolute", inset: 0, borderRadius: 28, background: "linear-gradient(180deg, #33b253 0%, #3fe366 100%)", border: "1.892px solid #ffffff", boxSizing: "border-box" }}
        initial={false}
        animate={{ opacity: greenOpacity }}
        transition={greenT}
      />
      <BagIcon frame={56.757} left={41.62} top={17.03} />
      <p style={{ position: "absolute", top: 79.15, left: "50%", transform: "translateX(-50%)", width: 113, margin: 0, textAlign: "center", color: "#ffffff", fontFamily: "var(--font-primary)", fontWeight: 500, fontSize: 14, lineHeight: "20px", letterSpacing: "-0.1px" }}>
        {text}
      </p>
    </motion.div>
  );
}

function BenefitStack({ step }: { step: 1 | 2 | 3 }) {
  return (
    <>
      {/* back card — third to absorb (promote → grey→green → 2s hold → fly) */}
      <BenefitCard step={step} base={BASE.back} promote delay={2.5} greenByDefault={false} text="Exclusive app-only deals" />
      {/* middle card — second to absorb */}
      <BenefitCard step={step} base={BASE.mid} promote delay={0.15} greenByDefault={false} text="Track your orders in real time" />
      {/* front green card — flies into the icon first (already read on screen 2) */}
      <BenefitCard step={step} base={BASE.front} promote={false} delay={0} greenByDefault text="Faster, smoother check out" />
    </>
  );
}

function BagIcon({ frame, left, top }: { frame: number; left: number; top: number }) {
  return (
    <div style={{ position: "absolute", left, top, width: frame, height: frame, overflow: "hidden" }}>
      <img src={`${A2}/bag-front.svg`} alt="" style={{ position: "absolute", left: "15.66%", top: "10.55%", width: "79.14%", height: "84.24%", display: "block" }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

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
