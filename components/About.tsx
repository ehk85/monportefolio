import { Compass, Puzzle, MessageCircle } from "lucide-react";
import { strengths, profile } from "@/data/profile";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";

const icons = [Compass, Puzzle, MessageCircle];

export function About() {
  return (
    <section id="about" className="section-container py-24">
      <SectionHeading eyebrow="À propos" title="Sérieux dans la méthode, curieux dans l'approche" />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr]">
        <AnimatedSection>
          <p className="text-lg leading-relaxed text-ink-secondary">{profile.aboutText}</p>
          <p className="mt-4 text-sm text-ink-secondary">
            Basé à {profile.location} — {profile.workMode}.
          </p>
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-1">
          {strengths.map((s, i) => {
            const Icon = icons[i % icons.length];
            return (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="group flex items-start gap-4 rounded-xl border border-white/5 bg-bg-surface p-5 transition-all hover:-translate-y-1 hover:border-accent-cyan/40">
                  <div className="rounded-lg bg-accent-cyan/10 p-2 text-accent-cyan">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-ink-primary">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-secondary">{s.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
