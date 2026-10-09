"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { testimonialSources } from "@/data/testimonialSources";
import { StarRating } from "./ui/StarRating";

const MAX_WORDS = 2000;

function countWords(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function TestimonialForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const wordCount = countWords(comment);
  const overLimit = wordCount > MAX_WORDS;
  const canSubmit =
    !overLimit &&
    comment.trim().length > 0 &&
    company.length > 0 &&
    rating >= 1 &&
    (isAnonymous || name.trim().length > 0) &&
    status !== "submitting";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, isAnonymous, company, rating, comment }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error || "Échec de l'envoi, réessaie plus tard.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMessage("Échec de l'envoi, réessaie plus tard.");
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-bg-primary/90 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-white/10 bg-bg-surface p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-ink-primary">
            Ajouter un avis
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-1 text-ink-secondary transition-colors hover:text-ink-primary"
          >
            <X size={18} />
          </button>
        </div>

        {status === "done" ? (
          <div className="mt-6 rounded-lg border border-accent-emerald/30 bg-accent-emerald/10 p-4 text-sm text-accent-emerald">
            Merci ! Ton avis a été transmis et sera publié après vérification.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex-1 min-w-[180px]">
                <span className="text-xs font-medium text-ink-secondary">Nom &amp; Prénom</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isAnonymous}
                  maxLength={120}
                  placeholder={isAnonymous ? "Avis anonyme" : "Jeanne Dupont"}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:border-accent-cyan/50 focus:outline-none disabled:opacity-50"
                />
              </label>
              <label className="flex items-center gap-2 pb-2 text-xs text-ink-secondary">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-bg-primary accent-accent-cyan"
                />
                Rester anonyme
              </label>
            </div>

            <label>
              <span className="text-xs font-medium text-ink-secondary">Entreprise / École</span>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary focus:border-accent-cyan/50 focus:outline-none"
              >
                <option value="" disabled>
                  Choisir…
                </option>
                {testimonialSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="text-xs font-medium text-ink-secondary">Note</span>
              <div className="mt-1 flex items-center gap-2">
                <StarRating value={rating} onChange={setRating} size={24} />
                <span className="text-xs text-ink-secondary">
                  {rating > 0 ? `${rating} / 5` : "Choisis une note"}
                </span>
              </div>
            </div>

            <label>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-secondary">Commentaire</span>
                <span className={`text-xs ${overLimit ? "text-red-400" : "text-ink-secondary"}`}>
                  {wordCount} / {MAX_WORDS} mots
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                required
                placeholder="Partage ton expérience de travail avec Emmanuel…"
                className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:border-accent-cyan/50 focus:outline-none"
              />
            </label>

            {status === "error" && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}

            <div className="mt-1 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-ink-secondary transition-colors hover:text-ink-primary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-lg bg-signature-gradient px-4 py-2 text-sm font-semibold text-bg-primary transition-opacity disabled:opacity-40"
              >
                {status === "submitting" ? "Envoi…" : "Publier"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
