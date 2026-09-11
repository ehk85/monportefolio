"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-accent-cyan/20 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-accent-emerald/20 blur-3xl animate-blob-delay" />

      <div className="section-container relative grid grid-cols-1 items-center gap-12 py-24 md:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center rounded-full border border-accent-emerald/30 bg-accent-emerald/10 px-4 py-1 text-sm font-medium text-accent-emerald">
            {profile.availability}
          </span>

          <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-ink-primary sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-xl font-medium text-gradient sm:text-2xl">{profile.title}</p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-secondary">
            {profile.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#experience"
              className="inline-flex items-center gap-2 rounded-lg bg-signature-gradient px-6 py-3 text-sm font-semibold text-bg-primary transition-transform hover:scale-[1.03]"
            >
              Voir mon parcours <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-ink-primary transition-colors hover:border-accent-amber/50 hover:text-accent-amber"
            >
              <Mail size={16} /> Me contacter
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-signature-gradient p-1 sm:h-72 sm:w-72"
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-bg-surface">
            <Image
              src="/profile-photo.png"
              alt={profile.name}
              fill
              sizes="(min-width: 640px) 288px, 224px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
