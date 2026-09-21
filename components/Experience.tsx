"use client";

import { useMemo, useRef, useState } from "react";
import type { Marker } from "cobe";
import { MapPin, X } from "lucide-react";
import { experiences, regions, type RegionKey } from "@/data/experiences";
import { SectionHeading } from "./ui/SectionHeading";
import { AnimatedSection } from "./ui/AnimatedSection";
import { Tag } from "./ui/Tag";
import { Globe } from "./Globe";
import { CountryMorph } from "./CountryMorph";

const regionOrder: RegionKey[] = ["lyon", "paris", "londres", "abidjan"];
const GLOBE_SIZE = 300;

export function Experience() {
  const [activeRegion, setActiveRegion] = useState<RegionKey | null>(null);
  const [sphereHidden, setSphereHidden] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const globeWrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const sphereMarkers: Marker[] = useMemo(
    () =>
      regionOrder.map((key) => ({
        id: key,
        location: [regions[key].lat, regions[key].lng] as [number, number],
        size: 0.05,
      })),
    []
  );

  const handlePinPixel = (pos: { x: number; y: number; opacity: number } | null) => {
    const pin = pinRef.current;
    const path = pathRef.current;
    const container = containerRef.current;
    const globeWrap = globeWrapRef.current;
    const card = cardRef.current;
    if (!pin || !path || !container || !globeWrap) return;

    if (!pos) {
      pin.style.opacity = "0";
      path.style.opacity = "0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const globeRect = globeWrap.getBoundingClientRect();
    const pinX = globeRect.left - containerRect.left + pos.x;
    const pinY = globeRect.top - containerRect.top + pos.y;

    pin.style.opacity = String(pos.opacity);
    pin.style.transform = `translate(${pinX}px, ${pinY}px) translate(-50%, -50%)`;

    if (card) {
      const cardRect = card.getBoundingClientRect();
      const anchorX = cardRect.left - containerRect.left;
      const anchorY = cardRect.top - containerRect.top + Math.min(30, cardRect.height / 2);

      const dx = anchorX - pinX;
      const dy = anchorY - pinY;
      const c1x = pinX + dx * 0.3;
      const c1y = pinY + dy * 0.1 - 46;
      const c2x = pinX + dx * 0.72;
      const c2y = anchorY - dy * 0.12 + 20;

      path.setAttribute(
        "d",
        `M ${pinX} ${pinY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${anchorX} ${anchorY}`
      );
      path.style.opacity = String(pos.opacity);
    }
  };

  const toggleRegion = (key: RegionKey) => {
    setActiveRegion((prev) => (prev === key ? null : key));
  };

  return (
    <section id="experience" className="bg-bg-surface/40 py-24">
      <div className="section-container">
        <SectionHeading eyebrow="Parcours" title="Expériences professionnelles" />
        <p className="mt-4 max-w-2xl text-sm text-ink-secondary">
          Fais glisser le globe pour l'explorer, ou clique une ville : il éclate et se reforme
          en carte du pays, avec ses missions reliées par un fil.
        </p>

        <div
          ref={containerRef}
          className="relative mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-[300px_1fr]"
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="connector-gradient">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              fill="none"
              stroke="url(#connector-gradient)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray="2 7"
              className="connector-path"
              style={{ opacity: 0 }}
            />
          </svg>

          <AnimatedSection className="relative mx-auto flex justify-center">
            <div ref={globeWrapRef} className="relative" style={{ width: GLOBE_SIZE, height: GLOBE_SIZE }}>
              <Globe markers={sphereMarkers} size={GLOBE_SIZE} hidden={sphereHidden} />
              <CountryMorph
                activeRegion={activeRegion}
                size={GLOBE_SIZE}
                onPinPixel={handlePinPixel}
                onSphereHiddenChange={setSphereHidden}
              />
              <div
                ref={pinRef}
                className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-accent-emerald opacity-0 shadow-[0_0_12px_2px_rgba(16,185,129,0.7)]"
              />
            </div>
          </AnimatedSection>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {regionOrder.map((key) => {
                const region = regions[key];
                const jobs = experiences.filter((e) => e.region === key);
                const isActive = activeRegion === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleRegion(key)}
                    className={`flex items-center justify-between gap-3 rounded-xl border bg-bg-surface p-4 text-left transition-colors ${
                      isActive ? "border-accent-emerald/50" : "border-white/5 hover:border-accent-cyan/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`rounded-lg p-2 transition-colors ${
                          isActive
                            ? "bg-accent-emerald/10 text-accent-emerald"
                            : "bg-accent-cyan/10 text-accent-cyan"
                        }`}
                      >
                        <MapPin size={16} />
                      </span>
                      <div>
                        <h3 className="font-heading text-base font-semibold text-ink-primary">
                          {region.label}
                        </h3>
                        <p className="text-xs text-ink-secondary">{region.country}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-ink-secondary">
                      {jobs.length} {jobs.length > 1 ? "expériences" : "expérience"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div ref={cardRef} className="relative">
              {activeRegion ? (
                <div
                  key={activeRegion}
                  className="animate-fadeUp rounded-xl border border-accent-emerald/30 bg-bg-surface p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-emerald">
                      {regions[activeRegion].label}, {regions[activeRegion].country}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveRegion(null)}
                      className="rounded-full p-1 text-ink-secondary transition-colors hover:text-ink-primary"
                      aria-label="Fermer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-5">
                    {experiences
                      .filter((e) => e.region === activeRegion)
                      .map((job) => (
                        <div key={job.company}>
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h4 className="text-sm font-semibold text-ink-primary">{job.role}</h4>
                            <span className="text-xs font-medium text-accent-cyan">{job.period}</span>
                          </div>
                          <p className="text-xs text-ink-secondary">
                            {job.company} — {job.location}
                          </p>
                          {job.missions.length > 0 && (
                            <ul className="mt-2 space-y-1.5">
                              {job.missions.map((m) => (
                                <li
                                  key={m}
                                  className="flex gap-2 text-xs leading-relaxed text-ink-secondary"
                                >
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-emerald" />
                                  {m}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.stack.map((s, idx) => (
                              <Tag key={s} label={s} tone={idx % 2 === 0 ? "cyan" : "emerald"} />
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-ink-secondary">
                  Clique une ville pour afficher le détail des missions.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
