"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 20,
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const interactive = !readOnly && Boolean(onChange);
  const displayValue = interactive && hoverValue !== null ? hoverValue : value;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => interactive && setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.max(0, Math.min(1, displayValue - (star - 1))) * 100;
        return (
          <div key={star} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-ink-secondary/30" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
              <Star size={size} className="text-accent-amber" fill="currentColor" />
            </div>
            {interactive && (
              <>
                <button
                  type="button"
                  aria-label={`${star - 0.5} étoile${star - 0.5 > 1 ? "s" : ""}`}
                  className="absolute left-0 top-0 h-full w-1/2"
                  onMouseEnter={() => setHoverValue(star - 0.5)}
                  onClick={() => onChange?.(Math.max(1, star - 0.5))}
                />
                <button
                  type="button"
                  aria-label={`${star} étoiles`}
                  className="absolute right-0 top-0 h-full w-1/2"
                  onMouseEnter={() => setHoverValue(star)}
                  onClick={() => onChange?.(star)}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
