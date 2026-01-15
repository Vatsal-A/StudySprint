export default function Card({ title, children }) {
  return (
    <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-6 backdrop-blur">
      <div className="text-sm text-zinc-300 mb-4">{title}</div>
      {children}
    </div>
  );
}
