import ForceUpdateFlow from "./ForceUpdateFlow";

export default function App() {
  return (
    <div className="device">
      {/* Screen 1 (Figma 91:1385) morphs into screen 2 (92:1543). Auto-plays on
          load; click anywhere to replay/toggle. */}
      <ForceUpdateFlow />
    </div>
  );
}
