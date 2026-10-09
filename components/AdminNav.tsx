import Link from "next/link";

const links = [
  { href: "/admin", label: "Avis en attente" },
  { href: "/admin/experiences", label: "Expériences" },
  { href: "/admin/education", label: "Formations" },
];

export function AdminNav({ active }: { active: "testimonials" | "experiences" | "education" }) {
  const activeHref =
    active === "testimonials" ? "/admin" : active === "experiences" ? "/admin/experiences" : "/admin/education";

  return (
    <nav className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            link.href === activeHref
              ? "bg-accent-cyan/10 text-accent-cyan"
              : "text-ink-secondary hover:text-ink-primary"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
