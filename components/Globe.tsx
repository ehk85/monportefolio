"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import createGlobe from "cobe";
import type { Marker } from "cobe";

const AUTO_SPEED = 0.0022;
const DRAG_SENSITIVITY = 0.006;
const THETA_MIN = -1.1;
const THETA_MAX = 1.1;

export function Globe({
  markers,
  size = 300,
  hidden = false,
}: {
  markers: Marker[];
  size?: number;
  hidden?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.35);
  const velocityRef = useRef(0);
  const markersRef = useRef(markers);
  markersRef.current = markers;
  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;

  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.15,
      scale: 1,
      mapSamples: 14000,
      mapBrightness: 5.5,
      baseColor: [0.24, 0.32, 0.5],
      markerColor: [0.13, 0.83, 0.93],
      glowColor: [0.13, 0.5, 0.6],
      opacity: 0.92,
      markers: markersRef.current,
    });
    globeRef.current = globe;

    let frame: number;
    const animate = () => {
      if (!hiddenRef.current) {
        if (draggingRef.current) {
          // phi/theta already updated directly by pointer move
        } else if (Math.abs(velocityRef.current) > 0.0002) {
          phiRef.current += velocityRef.current;
          velocityRef.current *= 0.92;
        } else {
          phiRef.current += AUTO_SPEED;
        }
        globe.update({
          phi: phiRef.current,
          theta: thetaRef.current,
          markers: markersRef.current,
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (hiddenRef.current) return;
    draggingRef.current = true;
    velocityRef.current = 0;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    setGrabbing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    const dy = e.clientY - lastYRef.current;
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;

    const dPhi = dx * DRAG_SENSITIVITY;
    phiRef.current += dPhi;
    velocityRef.current = dPhi;
    thetaRef.current = Math.min(
      THETA_MAX,
      Math.max(THETA_MIN, thetaRef.current - dy * DRAG_SENSITIVITY)
    );
  };

  const endDrag = () => {
    draggingRef.current = false;
    setGrabbing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      className="transition-opacity duration-500 ease-out"
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        aspectRatio: "1",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        touchAction: "none",
        cursor: grabbing ? "grabbing" : "grab",
      }}
    />
  );
}
