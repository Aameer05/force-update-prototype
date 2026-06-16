import { useEffect, useState } from "react";
import ForceUpdateFlow from "./ForceUpdateFlow";
import Iteration2Flow from "./Iteration2Flow";
import Iteration3Flow from "./Iteration3Flow";
import Iteration4Flow from "./Iteration4Flow";

/**
 * Iteration switcher — one device frame with a segmented toggle to flip between
 * iterations 1, 2 and 3 (the same flow components App.tsx renders standalone).
 * Reached at the #gallery route; switching remounts the selected flow so its
 * entrance animation replays. The default single-iteration view is untouched.
 */

const ITEMS: Array<{ label: string; sub: string; Flow: () => JSX.Element }> = [
  { label: "Iteration 1", sub: "main", Flow: ForceUpdateFlow },
  { label: "Iteration 2", sub: "iteration-2", Flow: Iteration2Flow },
  { label: "Iteration 3", sub: "iteration-3", Flow: Iteration3Flow },
  { label: "Iteration 4", sub: "iteration-4", Flow: Iteration4Flow },
];

const DEVICE_W = 375;
const DEVICE_H = 812;
const CHROME = 180; // toggle + labels + padding around the device

// Scale the device so the whole frame always fits the viewport.
function fitScale() {
  if (typeof window === "undefined") return 0.8;
  return Math.max(
    0.4,
    Math.min(0.92, (window.innerHeight - CHROME) / DEVICE_H, (window.innerWidth - 80) / DEVICE_W)
  );
}

export default function Gallery() {
  const [sel, setSel] = useState(ITEMS.length - 1); // default to the latest iteration
  const [scale, setScale] = useState(fitScale);

  useEffect(() => {
    const on = () => setScale(fitScale());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const Flow = ITEMS[sel].Flow;

  return (
    <div className="switcher">
      <div className="seg" role="tablist" aria-label="Iteration">
        {ITEMS.map((it, i) => (
          <button
            key={it.label}
            role="tab"
            aria-selected={i === sel}
            className={`seg-btn${i === sel ? " is-active" : ""}`}
            onClick={() => setSel(i)}
          >
            {it.label}
          </button>
        ))}
      </div>

      <div
        className="switcher-slot"
        style={{ width: DEVICE_W * scale, height: DEVICE_H * scale }}
      >
        <div
          className="device"
          key={sel}
          style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          <Flow />
        </div>
      </div>

      <div className="switcher-sub">{ITEMS[sel].sub}</div>
    </div>
  );
}
