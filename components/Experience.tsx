import { experiences } from "@/data/experiences";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";
import { Tag } from "./ui/Tag";

export function Experience() {
  return (
    <section id="experience" className="bg-bg-surface/40 py-24">
      <div className="section-container">
        <SectionHeading eyebrow="Parcours" title="Expériences professionnelles" />

        <div className="relative mt-14 border-l border-white/10 pl-8">
          {experiences.map((exp, i) => (
            <AnimatedSection key={exp.company} delay={i * 0.12} className="relative mb-12 last:mb-0">
              <span
                className={`absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-bg-primary ${
                  exp.current ? "bg-accent-emerald" : "bg-accent-cyan"
                }`}
              />
              <div className="rounded-xl border border-white/5 bg-bg-surface p-6 transition-colors hover:border-accent-cyan/30">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-heading text-lg font-semibold text-ink-primary">
                    {exp.role}
                  </h3>
                  <span className="text-sm font-medium text-accent-cyan">{exp.period}</span>
                </div>
                <p className="mt-1 text-sm text-ink-secondary">
                  {exp.company} — {exp.location}
                </p>

                <ul className="mt-4 space-y-2">
                  {exp.missions.map((m) => (
                    <li key={m} className="flex gap-2 text-sm text-ink-secondary">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-emerald" />
                      {m}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.stack.map((s, idx) => (
                    <Tag key={s} label={s} tone={idx % 2 === 0 ? "cyan" : "emerald"} />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
