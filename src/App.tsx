import { useEffect, useState } from "react";
import Iteration3Flow from "./Iteration3Flow";
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

  // Default: iteration 3 standalone (keeps per-iteration deploys unchanged).
  // Iteration-2 flow lives in ./Iteration2Flow; iteration-1 in ./ForceUpdateFlow.
  return (
    <div className="device">
      <Iteration3Flow />
    </div>
  );
}
