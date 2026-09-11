import { languages, interests } from "@/data/profile";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";

export function LanguagesInterests() {
  return (
    <section className="section-container py-24">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <AnimatedSection>
          <SectionHeading eyebrow="Communication" title="Langues" />
          <div className="mt-8 space-y-4">
            {languages.map((lang) => (
              <div
                key={lang.name}
                className="rounded-xl border border-white/5 bg-bg-surface p-4"
              >
                <p className="font-heading text-base font-semibold text-ink-primary">
                  {lang.name}
                </p>
                <p className="mt-1 text-sm text-ink-secondary">{lang.level}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <SectionHeading eyebrow="En dehors du travail" title="Centres d'intérêt" />
          <div className="mt-8 space-y-4">
            {interests.map((interest) => (
              <div
                key={interest.name}
                className="rounded-xl border border-white/5 bg-bg-surface p-4"
              >
                <p className="font-heading text-base font-semibold text-ink-primary">
                  {interest.name}
                </p>
                <p className="mt-1 text-sm text-ink-secondary">{interest.detail}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
