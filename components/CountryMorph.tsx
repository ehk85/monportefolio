"use client";

import { useEffect, useRef } from "react";
import { countryDots, cityPoints, type Point } from "@/data/countryDots";
import { regions, type RegionKey, type CountryCode } from "@/data/experiences";

const EXPLODE_MS = 380;
const CONVERGE_MS = 760;
const CLOSE_EXPLODE_MS = 300;
const CLOSE_CONVERGE_MS = 620;
const STRIDE = 2;

const POOL: Record<CountryCode, Point[]> = {
  fra: countryDots.fra.points.filter((_, i) => i % STRIDE === 0),
  gbr: countryDots.gbr.points.filter((_, i) => i % STRIDE === 0),
  civ: countryDots.civ.points.filter((_, i) => i % STRIDE === 0),
};
const POOL_SIZE = POOL.fra.length;

type Land = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  opacity: number;
  startOpacity: number;
  targetOpacity: number;
};

type CityDot = {
  key: RegionKey;
  x: number;
  y: number;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  radius: number;
  targetRadius: number;
  opacity: number;
  startOpacity: number;
  targetOpacity: number;
  active: boolean;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutBack(t: number) {
  const c1 = 1.6;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function randRange(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const citiesByCountry: Record<CountryCode, RegionKey[]> = { fra: [], gbr: [], civ: [] };
(Object.keys(regions) as RegionKey[]).forEach((key) => {
  citiesByCountry[regions[key].countryCode].push(key);
});

type Phase = "idle-sphere" | "exploding" | "converging" | "settled";
type Mode = "opening" | "closing" | "switching" | null;

export function CountryMorph({
  activeRegion,
  size = 300,
  onPinPixel,
  onSphereHiddenChange,
}: {
  activeRegion: RegionKey | null;
  size?: number;
  onPinPixel: (pos: { x: number; y: number; opacity: number } | null) => void;
  onSphereHiddenChange: (hidden: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landRef = useRef<Land[]>([]);
  const cityRef = useRef<CityDot[]>([]);
  const phaseRef = useRef<Phase>("idle-sphere");
  const modeRef = useRef<Mode>(null);
  const elapsedRef = useRef(0);
  const prevRegionRef = useRef<RegionKey | null>(null);
  const activeRegionRef = useRef<RegionKey | null>(null);
  activeRegionRef.current = activeRegion;
  const onPinPixelRef = useRef(onPinPixel);
  onPinPixelRef.current = onPinPixel;
  const onSphereHiddenChangeRef = useRef(onSphereHiddenChange);
  onSphereHiddenChangeRef.current = onSphereHiddenChange;

  // build the land particle pool once
  useEffect(() => {
    const center = size / 2;
    landRef.current = Array.from({ length: POOL_SIZE }, () => ({
      x: center,
      y: center,
      vx: 0,
      vy: 0,
      startX: center,
      startY: center,
      targetX: center,
      targetY: center,
      opacity: 0,
      startOpacity: 0,
      targetOpacity: 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prevRegion = prevRegionRef.current;
    prevRegionRef.current = activeRegion;
    const center = size / 2;
    const radius = size * 0.42;

    const spawnCityDots = (country: CountryCode, active: RegionKey, keepExisting: boolean) => {
      const keys = citiesByCountry[country];
      const existing = cityRef.current;
      cityRef.current = keys.map((key) => {
        const [px, py] = cityPoints[key];
        const targetX = center + px * radius;
        const targetY = center + py * radius;
        const isActive = key === active;
        const prev = keepExisting ? existing.find((c) => c.key === key) : undefined;
        return {
          key,
          x: prev ? prev.x : center,
          y: prev ? prev.y : center,
          vx: 0,
          vy: 0,
          startX: prev ? prev.x : center,
          startY: prev ? prev.y : center,
          targetX,
          targetY,
          radius: prev ? prev.radius : 0,
          targetRadius: isActive ? 6 : 3.5,
          opacity: prev ? prev.opacity : 0,
          startOpacity: prev ? prev.opacity : 0,
          targetOpacity: 1,
          active: isActive,
        };
      });
    };

    if (activeRegion === null) {
      if (prevRegion !== null) {
        // closing: explode current positions outward briefly, then collapse to center + fade
        const land = landRef.current;
        for (const p of land) {
          p.startX = p.x;
          p.startY = p.y;
          const angle = randRange(0, Math.PI * 2);
          const speed = randRange(1.5, 4.5);
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.targetX = center;
          p.targetY = center;
          p.startOpacity = p.opacity;
          p.targetOpacity = 0;
        }
        for (const c of cityRef.current) {
          c.startX = c.x;
          c.startY = c.y;
          const angle = randRange(0, Math.PI * 2);
          const speed = randRange(1.5, 4);
          c.vx = Math.cos(angle) * speed;
          c.vy = Math.sin(angle) * speed;
          c.targetX = center;
          c.targetY = center;
          c.startOpacity = c.opacity;
          c.targetOpacity = 0;
          c.targetRadius = 0;
        }
        phaseRef.current = "exploding";
        modeRef.current = "closing";
        elapsedRef.current = 0;
        onSphereHiddenChangeRef.current(true);
      }
      return;
    }

    const newCountry = regions[activeRegion].countryCode;
    const prevCountry = prevRegion ? regions[prevRegion].countryCode : null;

    if (prevCountry === newCountry) {
      // same country: just retarget which city is active, no re-explode
      for (const c of cityRef.current) {
        const isActive = c.key === activeRegion;
        c.active = isActive;
        c.targetRadius = isActive ? 6 : 3.5;
      }
      return;
    }

    const pool = POOL[newCountry];
    const land = landRef.current;
    const opening = prevRegion === null;

    for (let i = 0; i < land.length; i++) {
      const p = land[i];
      const [px, py] = pool[i % pool.length];
      p.startX = p.x;
      p.startY = p.y;
      const angle = randRange(0, Math.PI * 2);
      const speed = opening ? randRange(2.5, 7) : randRange(1.8, 5);
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.targetX = center + px * radius;
      p.targetY = center + py * radius;
      p.startOpacity = p.opacity;
      p.targetOpacity = 1;
    }

    spawnCityDots(newCountry, activeRegion, !opening);

    phaseRef.current = "exploding";
    modeRef.current = opening ? "opening" : "switching";
    elapsedRef.current = 0;
    if (opening) onSphereHiddenChangeRef.current(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRegion, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let raf: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const speedFactor = dt / 16.67;
      const land = landRef.current;
      const cities = cityRef.current;

      const closing = modeRef.current === "closing";
      const explodeMs = closing ? CLOSE_EXPLODE_MS : EXPLODE_MS;
      const convergeMs = closing ? CLOSE_CONVERGE_MS : CONVERGE_MS;
      const materializing = modeRef.current === "opening";

      if (phaseRef.current === "exploding") {
        elapsedRef.current += dt;
        const t = Math.min(1, elapsedRef.current / explodeMs);
        for (const p of land) {
          p.x += p.vx * speedFactor;
          p.y += p.vy * speedFactor;
          p.vx *= 0.94;
          p.vy *= 0.94;
          if (materializing) p.opacity += (1 - p.opacity) * 0.2;
        }
        for (const c of cities) {
          c.x += c.vx * speedFactor;
          c.y += c.vy * speedFactor;
          c.vx *= 0.94;
          c.vy *= 0.94;
          if (materializing) c.opacity += (1 - c.opacity) * 0.2;
        }
        if (t >= 1) {
          phaseRef.current = "converging";
          elapsedRef.current = 0;
          for (const p of land) {
            p.startX = p.x;
            p.startY = p.y;
            p.startOpacity = p.opacity;
          }
          for (const c of cities) {
            c.startX = c.x;
            c.startY = c.y;
            c.startOpacity = c.opacity;
          }
          if (closing) onSphereHiddenChangeRef.current(false);
        }
      } else if (phaseRef.current === "converging") {
        elapsedRef.current += dt;
        const t = Math.min(1, elapsedRef.current / convergeMs);
        const posEase = closing ? easeOutCubic(t) : easeOutBack(t);
        for (const p of land) {
          p.x = lerp(p.startX, p.targetX, posEase);
          p.y = lerp(p.startY, p.targetY, posEase);
          p.opacity = lerp(p.startOpacity, p.targetOpacity, t);
        }
        for (const c of cities) {
          c.x = lerp(c.startX, c.targetX, posEase);
          c.y = lerp(c.startY, c.targetY, posEase);
          c.opacity = lerp(c.startOpacity, c.targetOpacity, t);
        }
        if (t >= 1) {
          phaseRef.current = closing ? "idle-sphere" : "settled";
          modeRef.current = null;
        }
      }

      // smooth city radius toward target regardless of phase (keeps switch-in-place snappy)
      for (const c of cities) {
        c.radius = lerp(c.radius, c.targetRadius, 0.18);
      }

      ctx.clearRect(0, 0, size, size);

      for (const p of land) {
        if (p.opacity <= 0.02) continue;
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "#22D3EE";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      const time = now / 1000;
      for (const c of cities) {
        if (c.opacity <= 0.02) continue;
        if (c.active) {
          const pulse = 0.5 + 0.5 * Math.sin(time * 3.2);
          ctx.globalAlpha = c.opacity * (0.35 + 0.25 * pulse);
          ctx.fillStyle = "#10B981";
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius + 5 + pulse * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = c.opacity;
        ctx.fillStyle = c.active ? "#10B981" : "#22D3EE";
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const activeCity = cities.find((c) => c.active);
      const isSettledOrAnimating = activeRegionRef.current !== null;
      if (activeCity && isSettledOrAnimating && activeCity.opacity > 0.05) {
        onPinPixelRef.current({ x: activeCity.x, y: activeCity.y, opacity: activeCity.opacity });
      } else {
        onPinPixelRef.current(null);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute left-0 top-0"
      style={{ width: size, height: size }}
    />
  );
}
