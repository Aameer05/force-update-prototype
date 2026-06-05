/**
 * Iteration 2 — Screen 2
 * Pixel-faithful build of Figma node 103:1892 (frame "22", 375 × 812).
 *
 * Same shell + phone mockup + noon icon (124px) as iteration 1's live state,
 * but the benefit shows as a CASCADE of rounded notification pills:
 *   - front: crisp green pill ("Faster, smoother check out") on top of all
 *   - mid:   faded green pill, behind the surface fade
 *   - back:  grey empty pill, behind the surface fade
 * The surface fade (Vector 7693) sits between the back/mid pills and the front,
 * so the receding pills read as dissolving into the background.
 */

const A = "/assets/figma"; // shared assets (status bar, fades 1/2)
const I2 = "/assets/figma/i2"; // iteration-2 specific (fade-3, bag-filled, noon)

const NOON_SHADOW =
  "0px 62.689px 17.222px 0px rgba(225,202,212,0), 0px 39.956px 15.844px 0px rgba(225,202,212,0.01), 0px 22.733px 13.778px 0px rgba(225,202,212,0.05), 0px 10.333px 10.333px 0px rgba(225,202,212,0.09), 0px 2.756px 5.511px 0px rgba(225,202,212,0.1)";
const PILL_SHADOW =
  "0px 15px 7.5px rgba(138,138,138,0.05), 0px 6px 6px rgba(138,138,138,0.08), 0px 3px 5px rgba(138,138,138,0.1)";
const PILL_BG = "linear-gradient(110deg, #ddfff2 10%, #f9fffd 80%)";
const PILL_BORDER = "1px solid rgba(44, 222, 86, 0.4)";

export default function Iteration2Screen2() {
  return (
    <div className="screen">
      <Fades />
      <StatusBar />

      {/* Phone mockup card + noon icon */}
      <div className="phone" style={{ top: 101 }}>
        <div className="phone-island" />
        <img className="phone-camera" src={`${A}/phone-camera.svg`} alt="" />
        <span className="phone-time">9:41</span>
        <img className="phone-battery" src={`${A}/phone-battery.svg`} alt="" />

        <div
          style={{ position: "absolute", left: 68, top: 79.73, width: 124, height: 124, borderRadius: 24.8, background: "#feee00", border: "1.378px solid #ffffff", boxShadow: NOON_SHADOW, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img src={`${I2}/noon.svg`} alt="noon" style={{ width: "87.7%", height: "94.7%", display: "block" }} />
        </div>
      </div>

      {/* Back pill — grey, empty (behind the surface fade) */}
      <div
        style={{ position: "absolute", left: "50%", top: 490, transform: "translateX(-50%)", width: 182.875, height: 56, borderRadius: 9999, background: "#f4f4f4", backdropFilter: "blur(8.75px)", WebkitBackdropFilter: "blur(8.75px)", boxShadow: PILL_SHADOW, zIndex: 1 }}
        aria-hidden
      />

      {/* Mid pill — faded green (behind the surface fade) */}
      <div
        style={{ position: "absolute", left: "calc(50% - 0.5px)", top: 429, transform: "translateX(-50%)", height: 52, display: "flex", alignItems: "center", gap: 8, paddingLeft: 16, paddingRight: 20, borderRadius: 9999, border: PILL_BORDER, background: PILL_BG, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", opacity: 0.4, zIndex: 1 }}
      >
        <BagFilled size={24} opacity={0.3} />
        <span style={{ opacity: 0.3, color: "#12a168", fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: 12, lineHeight: "18px", letterSpacing: "-0.1px", whiteSpace: "nowrap" }}>
          Faster, smoother check out
        </span>
      </div>

      {/* Surface fade — above the receding pills, below the content/phone */}
      <FadeSurface />

      {/* Front pill — crisp green, on top of everything */}
      <div
        style={{ position: "absolute", left: "calc(50% - 0.5px)", top: 363, transform: "translateX(-50%)", height: 56, display: "flex", alignItems: "center", gap: 8, paddingLeft: 16, paddingRight: 20, borderRadius: 9999, border: PILL_BORDER, background: PILL_BG, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: PILL_SHADOW, zIndex: 5 }}
      >
        <BagFilled size={28} />
        <span style={{ color: "#12a168", fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: 14, lineHeight: "20px", letterSpacing: "-0.1px", whiteSpace: "nowrap" }}>
          Faster, smoother check out
        </span>
      </div>

      {/* Bottom content */}
      <div className="content" style={{ top: 492, zIndex: 4 }}>
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

      <div className="version" style={{ zIndex: 4 }}>VERSION 2.0</div>
    </div>
  );
}

function BagFilled({ size, opacity = 1 }: { size: number; opacity?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, opacity, flexShrink: 0 }}>
      <img
        src={`${I2}/bag-filled.svg`}
        alt=""
        style={{ position: "absolute", left: "15.66%", top: "10.55%", width: "79.13%", height: "84.24%", display: "block" }}
      />
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

function FadeSurface() {
  return (
    <div className="fade-surface" aria-hidden style={{ zIndex: 2 }}>
      <div style={{ position: "absolute", left: -89, top: 440, width: 519, height: 451.571 }}>
        <img src={`${I2}/fade-3.svg`} style={{ position: "absolute", left: -100, top: -100, width: 719, height: 651.571, maxWidth: "none", display: "block" }} />
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
