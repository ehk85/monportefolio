import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="section-container flex flex-col items-center justify-between gap-4 text-sm text-ink-secondary sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          <a href={profile.linkedin.url} target="_blank" rel="noreferrer" className="hover:text-accent-cyan">
            LinkedIn
          </a>
          <a href={profile.github.url} target="_blank" rel="noreferrer" className="hover:text-accent-cyan">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
