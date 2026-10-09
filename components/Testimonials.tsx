import { Quote } from "lucide-react";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";
import { AddTestimonialButton } from "./AddTestimonialButton";
import { StarRating } from "./ui/StarRating";
import type { Testimonial } from "@/data/testimonialTypes";

async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, is_anonymous, company, comment, rating, status, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Testimonial[];
}

export async function Testimonials() {
  const testimonials = await getApprovedTestimonials();

  return (
    <section id="testimonials" className="section-container py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Témoignages" title="Ils m'ont fait confiance ou m'ont formé" />
        <AddTestimonialButton />
      </div>

      {testimonials.length === 0 ? (
        <p className="mt-12 text-sm text-ink-secondary">
          Aucun avis publié pour l&apos;instant — sois le premier à en laisser un.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.id} delay={(i % 3) * 0.08}>
              <div className="flex h-full flex-col rounded-xl border border-white/5 bg-bg-surface p-6">
                <div className="flex items-center justify-between">
                  <Quote size={20} className="text-accent-cyan/60" />
                  <StarRating value={t.rating} readOnly size={14} />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-secondary">
                  {t.comment}
                </p>
                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="text-sm font-semibold text-ink-primary">
                    {t.is_anonymous ? "Avis anonyme" : t.name}
                  </p>
                  <p className="text-xs text-ink-secondary">{t.company}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}
    </section>
  );
}
