export default function CanvasLoader({ label = "Rendering scene..." }) {
  return (
    <div className="flex h-full min-h-[220px] w-full items-center justify-center bg-[#050a12]">
      <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
    </div>
  );
}
