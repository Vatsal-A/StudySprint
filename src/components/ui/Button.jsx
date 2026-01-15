export default function Button({ children, onClick, variant = "primary", disabled = false }) {
  const base = "rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-white text-zinc-950 hover:bg-zinc-200"
      : "bg-zinc-800/80 border border-zinc-700 text-zinc-100 hover:bg-zinc-700/70";

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed active:scale-100" : "";

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles} ${disabledStyles}`}>
      {children}
    </button>
  );
}
