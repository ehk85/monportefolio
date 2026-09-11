import { education } from "@/data/education";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";

export function Education() {
  return (
    <section id="education" className="bg-bg-surface/40 py-24">
      <div className="section-container">
        <SectionHeading eyebrow="Formation" title="Diplômes & Formations" />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {education.map((edu, i) => (
            <AnimatedSection key={edu.degree} delay={(i % 2) * 0.1}>
              <div className="h-full rounded-xl border border-white/5 bg-bg-surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent-cyan">
                    {edu.period}
                  </span>
                  {edu.current && (
                    <span className="rounded-full bg-accent-emerald/10 px-3 py-0.5 text-xs font-medium text-accent-emerald">
                      En cours
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-heading text-lg font-semibold text-ink-primary">
                  {edu.degree}
                </h3>
                <p className="mt-1 text-sm text-ink-secondary">
                  {edu.school} — {edu.location}
                </p>
                {edu.detail && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{edu.detail}</p>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
