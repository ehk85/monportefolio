import { Mail, Phone, Linkedin, Github } from "lucide-react";
import { profile } from "@/data/profile";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";

const contactLinks = [
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { icon: Linkedin, label: profile.linkedin.label, href: profile.linkedin.url },
  { icon: Github, label: profile.github.label, href: profile.github.url },
];

export function Contact() {
  return (
    <section id="contact" className="bg-bg-surface/40 py-24">
      <div className="section-container">
        <SectionHeading eyebrow="Contact" title="Discutons de votre projet" align="center" />

        <AnimatedSection className="mx-auto mt-4 max-w-xl text-center">
          <p className="text-ink-secondary">
            {profile.availability}. N'hésitez pas à me contacter pour échanger sur une
            opportunité ou un projet Data & IA.
          </p>
        </AnimatedSection>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {contactLinks.map((c, i) => (
            <AnimatedSection key={c.label} delay={i * 0.08}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-white/5 bg-bg-surface p-4 transition-all hover:-translate-y-1 hover:border-accent-cyan/40"
              >
                <span className="rounded-lg bg-signature-gradient p-2 text-bg-primary">
                  <c.icon size={18} />
                </span>
                <span className="text-sm font-medium text-ink-primary">{c.label}</span>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
