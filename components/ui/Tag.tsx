export function Tag({ label, tone = "cyan" }: { label: string; tone?: "cyan" | "emerald" }) {
  const toneClasses =
    tone === "cyan"
      ? "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan"
      : "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${toneClasses}`}
    >
      {label}
    </span>
  );
}
