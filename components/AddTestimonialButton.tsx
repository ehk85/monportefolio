"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TestimonialForm } from "./TestimonialForm";

export function AddTestimonialButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 overflow-hidden rounded-full border border-accent-cyan/40 bg-bg-surface py-3 pl-3 pr-3 text-accent-cyan transition-all hover:gap-3 hover:border-accent-emerald/50 hover:pr-5 hover:text-accent-emerald"
      >
        <Plus size={18} className="shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100">
          Ajouter un avis
        </span>
      </button>

      {open && <TestimonialForm onClose={() => setOpen(false)} />}
    </>
  );
}
