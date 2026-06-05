import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Force app update — noon
 * Pixel-faithful build of Figma node 91:1385 (frame "16", 375 × 812).
 *
 * Values, asset SVGs and placement are taken 1:1 from the Figma Dev Mode
 * export. The soft background glows are the real exported blur/gradient
 * vectors (Vector 20172 / 20174 / 7693), not CSS approximations.
 *
 * A `stage` drives two keyframes: "intro" (this frame) and "live" (frame 19,
 * with the stacked notification cards) so the two can tween into each other.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const A = "/assets/figma";
const PHONE_W = 260;

/** Render the resting state immediately for reduced motion / backgrounded tabs. */
function useInstant() {
  return useState(
    () =>
      typeof document !== "undefined" &&
      (document.hidden ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  )[0];
}

export type Stage = "intro" | "live";

const LAYOUT: Record<
  Stage,
  {
    phoneTop: number;
    iconSize: number;
    iconTop: number;
    iconRadius: number;
    contentTop: number;
    notif: number;
    badge: number;
  }
> = {
  intro: {
    phoneTop: 151.27,
    iconSize: 148,
    iconTop: 67.73,
    iconRadius: 29.6,
    contentTop: 473,
    notif: 0,
    badge: 1,
  },
  live: {
    phoneTop: 101,
    iconSize: 124,
    iconTop: 79,
    iconRadius: 25,
    contentTop: 492,
    notif: 1,
    badge: 0,
  },
};

export default function ForceUpdateScreen({
  autoplay = true,
  initialStage,
}: {
  autoplay?: boolean;
  initialStage?: Stage;
} = {}) {
  const [action, setAction] = useState<null | "update" | "web">(null);
  const instant = useInstant();
  const ini = (v: Record<string, number>) => (instant ? false : v);

  const [stage, setStage] = useState<Stage>(
    initialStage ?? (instant ? "live" : "intro")
  );
  useEffect(() => {
    if (!autoplay || instant || stage === "live") return;
    const t = window.setTimeout(() => setStage("live"), 1400);
    return () => window.clearTimeout(t);
  }, [autoplay, instant, stage]);

  const L = LAYOUT[stage];

  const handleUpdate = () => {
    if (action) return;
    setAction("update");
    window.setTimeout(() => setAction(null), 2600);
  };
  const handleWeb = () => {
    if (action) return;
    setAction("web");
    window.setTimeout(() => setAction(null), 2600);
  };

  return (
    <div className="screen">
      <Fades />
      <StatusBar />

      {/* Phase 1 — the whole mockup (phone + noon icon + refresh badge + the
          surface fade) moves in together as one unit. */}
      <motion.div
        className="mockup-group"
        style={{ transformOrigin: "50% 36%" }}
        initial={ini({ opacity: 0, scale: 0.92, y: 10 })}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      >
        <PhoneMockup
          top={L.phoneTop}
          iconSize={L.iconSize}
          iconTop={L.iconTop}
          iconRadius={L.iconRadius}
          showBadge={L.badge === 1}
        />
        {/* Light surface glow (Vector 7693) — dissolves the phone's lower edge
            and sits behind the headline. Painted ABOVE the phone, below text. */}
        <FadeSurface />
      </motion.div>

      <NotificationStack visible={L.notif === 1} />

      <motion.div
        className="content"
        animate={{ top: L.contentTop }}
        initial={{ top: L.contentTop }}
        transition={{ duration: 0.6, ease: EASE }}
      >
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
            onClick={handleUpdate}
            disabled={!!action}
            whileTap={{ scale: 0.98 }}
            initial={ini({ opacity: 0, y: 30 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 1.0 }}
          >
            {action === "update" ? (
              <span className="btn-loading">
                <Spinner />
                Opening App Store…
              </span>
            ) : (
              "Let’s update"
            )}
          </motion.button>

          <motion.button
            className="btn btn-secondary"
            onClick={handleWeb}
            disabled={!!action}
            whileTap={{ scale: 0.98 }}
            initial={ini({ opacity: 0, y: 30 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 1.07 }}
          >
            {action === "web" ? (
              <span className="btn-loading">
                <Spinner dark />
                Opening noon.com…
              </span>
            ) : (
              "Continue on web"
            )}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="version"
        initial={ini({ opacity: 0, y: 30 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE, delay: 1.14 }}
      >
        VERSION 2.0
      </motion.div>

      <Toast action={action} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Background glows — real exported blur/gradient vectors              */
/* ------------------------------------------------------------------ */

function Fades() {
  return (
    <div className="fades" aria-hidden>
      {/* Vector 20172 — yellow glow, rotated 180° */}
      <div
        style={{ position: "absolute", left: -159.65, top: -80.46, width: 667.643, height: 721.575, transform: "rotate(180deg)" }}
      >
        <img src={`${A}/fade-1.svg`} style={{ position: "absolute", left: -100, top: -100, width: 867.643, height: 921.575, maxWidth: "none", display: "block" }} />
      </div>
      {/* Vector 20174 — green glow, rotated 167.37° */}
      <div
        style={{ position: "absolute", left: 107.99, top: -180.41, width: 809.22, height: 850.059, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ transform: "rotate(167.37deg)" }}>
          <div style={{ position: "relative", width: 667.643, height: 721.575 }}>
            <img src={`${A}/fade-2.svg`} style={{ position: "absolute", left: -100, top: -100, width: 867.643, height: 921.575, maxWidth: "none", display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Vector 7693 — light surface glow that fades the phone out behind the text. */
function FadeSurface() {
  return (
    <div className="fade-surface" aria-hidden>
      <div style={{ position: "absolute", left: -92, top: 347, width: 519, height: 465 }}>
        <img src={`${A}/fade-3.svg`} style={{ position: "absolute", left: -100, top: -100, width: 719, height: 665, maxWidth: "none", display: "block" }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Device status bar                                                   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Phone mockup card + noon app icon + update badge                    */
/* ------------------------------------------------------------------ */

function PhoneMockup({
  top,
  iconSize,
  iconTop,
  iconRadius,
  showBadge,
}: {
  top: number;
  iconSize: number;
  iconTop: number;
  iconRadius: number;
  showBadge: boolean;
}) {
  const iconLeft = (PHONE_W - iconSize) / 2;

  // No per-element entrance here — the parent <motion.div className="mockup-group">
  // moves everything in together. These only tween on stage (intro ↔ live) change.
  return (
    <motion.div
      className="phone"
      initial={false}
      animate={{ top }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {/* faux iOS status bar inside the mockup (light / inactive) */}
      <div className="phone-island" />
      <img className="phone-camera" src={`${A}/phone-camera.svg`} alt="" />
      <span className="phone-time">9:41</span>
      <img className="phone-battery" src={`${A}/phone-battery.svg`} alt="" />

      <motion.div
        className="appicon"
        initial={false}
        animate={{ width: iconSize, height: iconSize, left: iconLeft, top: iconTop, borderRadius: iconRadius }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <img
          src={`${A}/noon.svg`}
          alt="noon"
          className="appicon-mark"
          style={{ width: iconSize * 0.877, height: iconSize * 0.947 }}
        />
      </motion.div>

      {/* "Update available" badge — frame 16 only */}
      <motion.div
        className="appicon-badge"
        initial={false}
        animate={{ opacity: showBadge ? 1 : 0, scale: showBadge ? 1 : 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <img src={`${A}/refresh.svg`} alt="" style={{ width: 24, height: 24 }} />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked notification cards (live stage)                             */
/* ------------------------------------------------------------------ */

function NotificationStack({ visible }: { visible: boolean }) {
  const instant = useInstant();
  return (
    <div className="notif-stack" style={{ pointerEvents: visible ? "auto" : "none" }}>
      <motion.div
        className="notif notif-back"
        initial={instant ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 18 }}
        transition={{ duration: 0.5, ease: EASE, delay: visible ? 0.46 : 0 }}
      />
      <motion.div
        className="notif notif-mid"
        initial={instant ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 18 }}
        transition={{ duration: 0.5, ease: EASE, delay: visible ? 0.56 : 0 }}
      />
      <motion.div
        className="notif notif-front"
        initial={instant ? false : { opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 22, scale: visible ? 1 : 0.98 }}
        transition={{ duration: 0.55, ease: EASE, delay: visible ? 0.66 : 0 }}
      >
        <span className="notif-icon">
          <BagThunderIcon />
        </span>
        <span className="notif-title">Faster, smoother check out</span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toast feedback                                                      */
/* ------------------------------------------------------------------ */

function Toast({ action }: { action: null | "update" | "web" }) {
  return (
    <AnimatePresence>
      {action && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {action === "update"
            ? "Redirecting you to the App Store to update…"
            : "Opening noon.com in your browser…"}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Misc icons                                                          */
/* ------------------------------------------------------------------ */

function Spinner({ dark }: { dark?: boolean }) {
  return (
    <span
      className="spinner"
      style={{
        borderColor: dark ? "rgba(29,37,57,0.25)" : "rgba(255,255,255,0.35)",
        borderTopColor: dark ? "#1d2539" : "#ffffff",
      }}
    />
  );
}

function BagThunderIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M7.5 11.5h17l-1.2 14.2a2.4 2.4 0 0 1-2.39 2.2H11.1a2.4 2.4 0 0 1-2.39-2.2L7.5 11.5Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11.5 12.5V9.5a4.5 4.5 0 0 1 9 0v3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.8 14.5l-3.3 5h2.7l-.6 4 3.6-5.2h-2.8l.4-3.8Z" fill="#fff" />
    </svg>
  );
}
