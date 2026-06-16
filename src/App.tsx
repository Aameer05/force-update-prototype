import { useEffect, useState } from "react";
import Iteration4Flow from "./Iteration4Flow";
import Gallery from "./Gallery";

/** Tiny hash router so the gallery is reachable without changing the default. */
function useHash() {
  const [hash, setHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash
  );
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();

  // #gallery / #all → every iteration side by side.
  if (hash === "#gallery" || hash === "#all") {
    return <Gallery />;
  }

  // Default: iteration 4 standalone (keeps per-iteration deploys unchanged).
  // Earlier flows live in ./Iteration3Flow, ./Iteration2Flow, ./ForceUpdateFlow.
  return (
    <div className="device">
      <Iteration4Flow />
    </div>
  );
}
