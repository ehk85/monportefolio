import { Github, FileText, Award } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";
import { Tag } from "./ui/Tag";

export function Projects() {
  return (
    <section id="projects" className="section-container py-24">
      <SectionHeading eyebrow="Réalisations" title="Projets académiques et personnels" />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <AnimatedSection key={project.title} delay={(i % 2) * 0.1}>
            <div className="flex h-full flex-col rounded-xl border border-white/5 bg-bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent-cyan/30">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-heading text-base font-semibold text-ink-primary">
                  {project.title}
                </h3>
                <span className="text-xs font-medium text-accent-cyan">{project.period}</span>
              </div>
              <p className="mt-1 text-sm text-ink-secondary">{project.organization}</p>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-secondary">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <Tag key={tag} label={tag} tone={idx % 2 === 0 ? "cyan" : "emerald"} />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {project.grade && (
                  <span className="inline-flex items-center gap-1.5 text-accent-amber">
                    <Award size={14} /> {project.grade}
                  </span>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-secondary transition-colors hover:text-accent-cyan"
                  >
                    <Github size={14} /> Code source
                  </a>
                )}
                {project.fileUrl && (
                  <a
                    href={project.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink-secondary transition-colors hover:text-accent-cyan"
                  >
                    <FileText size={14} /> Rapport
                  </a>
                )}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
