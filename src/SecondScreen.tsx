/**
 * Force app update — noon · Screen 2
 * Pixel-faithful build of Figma node 92:1543 (frame "18", 375 × 812).
 *
 * Reuses the same shell as screen 1 (background fades, status bar, phone card,
 * surface fade, headline, CTAs, version). What differs: inside the mockup is a
 * stacked "Faster, smoother check out" benefit card (3 layered cards) instead
 * of the app icon, and a small yellow noon badge sits just below the mockup.
 *
 * Values, asset SVGs and placement are taken 1:1 from the Figma Dev Mode export.
 */

const A = "/assets/figma"; // shared status-bar assets
const A2 = "/assets/figma/s2"; // screen-2 specific assets

// Pink layered drop-shadows, exact from Figma (rgba 225,202,212).
const SHADOW_BACK =
  "0px 46.987px 12.908px rgba(225,202,212,0), 0px 29.948px 11.876px rgba(225,202,212,0.01), 0px 17.039px 10.327px rgba(225,202,212,0.05), 0px 7.745px 7.745px rgba(225,202,212,0.09), 0px 2.065px 4.131px rgba(225,202,212,0.1)";
const SHADOW_MID =
  "0px 56.384px 15.49px rgba(225,202,212,0), 0px 35.937px 14.251px rgba(225,202,212,0.01), 0px 20.447px 12.392px rgba(225,202,212,0.05), 0px 9.294px 9.294px rgba(225,202,212,0.09), 0px 2.478px 4.957px rgba(225,202,212,0.1)";
const SHADOW_FRONT =
  "0px 70.778px 19.444px rgba(225,202,212,0), 0px 45.111px 17.889px rgba(225,202,212,0.01), 0px 25.667px 15.556px rgba(225,202,212,0.05), 0px 11.667px 11.667px rgba(225,202,212,0.09), 0px 3.111px 6.222px rgba(225,202,212,0.1)";
const SHADOW_BADGE =
  "0px 20px 6px rgba(225,202,212,0), 0px 14px 6px rgba(225,202,212,0.01), 0px 8px 5px rgba(225,202,212,0.05), 0px 4px 4px rgba(225,202,212,0.09), 0px 2px 6px rgba(225,202,212,0.1)";

export default function SecondScreen() {
  return (
    <div className="screen">
      <Fades />
      <StatusBar />

      {/* Phone mockup card — clips the benefit card stack */}
      <div className="phone" style={{ top: 123, overflow: "hidden" }}>
        <div className="phone-island" />
        <img className="phone-camera" src={`${A}/phone-camera.svg`} alt="" />
        <span className="phone-time">9:41</span>
        <img className="phone-battery" src={`${A}/phone-battery.svg`} alt="" />

        <BenefitStack />
      </div>

      {/* Small yellow noon badge just below the mockup */}
      <div className="noon-badge" style={{ boxShadow: SHADOW_BADGE }}>
        <img src={`${A2}/noon-badge.svg`} alt="noon" style={{ width: 35.083, height: 37.89, display: "block" }} />
      </div>

      <FadeSurface />

      <div className="content" style={{ top: 473 }}>
        <div className="content-text">
          <h1 className="title">Time for an update</h1>
          <p className="body">
            This version of noon is no longer supported. Update now to keep
            shopping safely
          </p>
        </div>

        <div className="buttons">
          <button className="btn btn-primary">Let’s update</button>
          <button className="btn btn-secondary">Continue on web</button>
        </div>
      </div>

      <div className="version">VERSION 2.0</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Benefit card stack (replaces the app icon)                          */
/* ------------------------------------------------------------------ */

function BenefitStack() {
  return (
    <>
      {/* back card */}
      <div
        style={{ position: "absolute", left: 83.53, top: 84.73, width: 92.941, height: 92.941, borderRadius: 17.583, background: "#f6f6f6", boxShadow: SHADOW_BACK, overflow: "hidden" }}
      >
        <BagIcon frame={37.679} left={27.63} top={11.3} />
      </div>

      {/* middle card */}
      <div
        style={{ position: "absolute", left: 74.24, top: 94.02, width: 111.529, height: 111.529, borderRadius: 21.1, background: "#eeeeee", boxShadow: SHADOW_MID, overflow: "hidden" }}
      >
        <BagIcon frame={45.215} left={33.16} top={13.57} />
      </div>

      {/* front green card */}
      <div
        style={{ position: "absolute", left: 60, top: 103.95, width: 140, height: 140, borderRadius: 28, background: "linear-gradient(180deg, #33b253 0%, #3fe366 100%)", border: "1.892px solid #ffffff", boxShadow: SHADOW_FRONT, overflow: "hidden" }}
      >
        <BagIcon frame={56.757} left={41.62} top={17.03} />
        <p
          style={{ position: "absolute", top: 79.15, left: "50%", transform: "translateX(-50%)", width: 113, margin: 0, textAlign: "center", color: "#ffffff", fontFamily: "var(--font-primary)", fontWeight: 500, fontSize: 14, lineHeight: "20px", letterSpacing: "-0.1px" }}
        >
          Faster, smoother check out
        </p>
      </div>
    </>
  );
}

function BagIcon({ frame, left, top }: { frame: number; left: number; top: number }) {
  // The glyph is inset within its icon frame (Figma inset 10.55/5.2/5.21/15.66%).
  return (
    <div style={{ position: "absolute", left, top, width: frame, height: frame, overflow: "hidden" }}>
      <img
        src={`${A2}/bag-front.svg`}
        alt=""
        style={{ position: "absolute", left: "15.66%", top: "10.55%", width: "79.14%", height: "84.24%", display: "block" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared chrome (screen-2 fade vectors)                               */
/* ------------------------------------------------------------------ */

function Fades() {
  return (
    <div className="fades" aria-hidden>
      {/* Vector 20172 — yellow glow, rotated 180° */}
      <div style={{ position: "absolute", left: -160, top: -83, width: 668, height: 764, transform: "rotate(180deg)" }}>
        <img src={`${A2}/fade-1.svg`} style={{ position: "absolute", left: -100, top: -100, width: 868, height: 964, maxWidth: "none", display: "block" }} />
      </div>
      {/* Vector 20174 — green glow, rotated 167.37° */}
      <div style={{ position: "absolute", left: 107.99, top: -180.41, width: 809.22, height: 850.059, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "rotate(167.37deg)" }}>
          <div style={{ position: "relative", width: 667.643, height: 721.575 }}>
            <img src={`${A2}/fade-2.svg`} style={{ position: "absolute", left: -100, top: -100, width: 867.643, height: 921.575, maxWidth: "none", display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FadeSurface() {
  return (
    <div className="fade-surface" aria-hidden>
      <div style={{ position: "absolute", left: -96, top: 373, width: 519, height: 439 }}>
        <img src={`${A2}/fade-3.svg`} style={{ position: "absolute", left: -100, top: -100, width: 719, height: 639, maxWidth: "none", display: "block" }} />
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
