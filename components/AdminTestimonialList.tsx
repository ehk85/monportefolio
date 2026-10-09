"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Testimonial } from "@/data/testimonialTypes";

export function AdminTestimonialList({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handle = async (id: string, action: "approve" | "reject") => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } finally {
      setPendingId(null);
    }
  };

  if (items.length === 0) {
    return <p className="mt-10 text-sm text-ink-secondary">Aucun avis en attente.</p>;
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-white/5 bg-bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-heading text-sm font-semibold text-ink-primary">
              {item.is_anonymous ? "Anonyme" : item.name} — {item.company}
            </p>
            <span className="text-xs text-ink-secondary">
              {new Date(item.created_at).toLocaleString("fr-FR")}
            </span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">
            {item.comment}
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={pendingId === item.id}
              onClick={() => handle(item.id, "approve")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-emerald/10 px-3 py-1.5 text-sm font-medium text-accent-emerald transition-colors hover:bg-accent-emerald/20 disabled:opacity-50"
            >
              <Check size={14} /> Publier
            </button>
            <button
              type="button"
              disabled={pendingId === item.id}
              onClick={() => handle(item.id, "reject")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <X size={14} /> Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
