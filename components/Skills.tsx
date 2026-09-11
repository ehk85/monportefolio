import { skillGroups } from "@/data/skills";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";
import { Tag } from "./ui/Tag";

export function Skills() {
  return (
    <section id="skills" className="section-container py-24">
      <SectionHeading eyebrow="Savoir-faire" title="Compétences" />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <AnimatedSection key={group.category} delay={(i % 3) * 0.08}>
            <div className="h-full rounded-xl border border-white/5 bg-bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent-emerald/30">
              <h3 className="font-heading text-base font-semibold text-ink-primary">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item, idx) => (
                  <Tag key={item} label={item} tone={idx % 2 === 0 ? "cyan" : "emerald"} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
