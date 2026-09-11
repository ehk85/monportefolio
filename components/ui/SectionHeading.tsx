export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <span className="text-sm font-semibold uppercase tracking-widest text-accent-cyan">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-heading text-3xl font-semibold text-ink-primary sm:text-4xl">
        {title}
      </h2>
      <div
        className={`mt-4 h-1 w-16 rounded-full bg-signature-gradient ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
