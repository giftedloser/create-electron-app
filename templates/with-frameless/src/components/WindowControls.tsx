export default function WindowControls() {
  return (
    <div
      className="flex justify-end gap-2 p-1 bg-transparent text-white select-none"
      style={{ WebkitAppRegion: "drag", backgroundColor: "transparent" }}
    >
      <button
        className="px-2"
        onClick={() => window.windowControls.minimize()}
        style={{ WebkitAppRegion: "no-drag" }}
      >
        –
      </button>
      <button
        className="px-2"
        onClick={() => window.windowControls.maximize()}
        style={{ WebkitAppRegion: "no-drag" }}
      >
        ⬜
      </button>
      <button
        className="px-2 text-red-500"
        onClick={() => window.windowControls.close()}
        style={{ WebkitAppRegion: "no-drag" }}
      >
        ✕
      </button>
    </div>
  );
}
