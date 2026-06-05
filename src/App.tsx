import Iteration2Flow from "./Iteration2Flow";

export default function App() {
  return (
    <div className="device">
      {/* Iteration 2 flow: screen 1 (frame 16) → noon morphs → 3 green pills
          rise from behind the text, hold 2s, and absorb into the icon → loop.
          Iteration-1 flow lives in ./ForceUpdateFlow; static screen 2 in
          ./Iteration2Screen2. */}
      <Iteration2Flow />
    </div>
  );
}
