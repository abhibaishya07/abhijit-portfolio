"use client";

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroStats } from "@/app/components/data/portfolioData";
import CountUp from "@/app/components/ui/CountUp";
import ScrambleText from "@/app/components/ui/ScrambleText";
import { useIsMobile } from "@/app/components/hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

const HeroNeuralCanvas = dynamic(() => import("@/app/components/canvas/HeroNeuralCanvas"), {
  ssr: false
});

export default function HeroSection() {
  const isMobile = useIsMobile();
  const canvasRef = useRef(null);
  const scrollHintRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (canvasRef.current) {
        gsap.to(canvasRef.current, {
          scale: 0.84,
          opacity: 0.22,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: 1.1
          }
        });
      }

      if (scrollHintRef.current) {
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "top+=140 top",
            scrub: true
          }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero-panel section-shell relative flex items-stretch">
      <div className="scanline-layer" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-[55%_45%] lg:items-center">
        <div className="relative z-10 pt-8">
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="font-mono text-[0.75rem] uppercase tracking-[0.17em] text-muted"
          >
            {"// PORTFOLIO - 2025"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.04 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="ghost-watermark absolute left-0 top-8 text-[clamp(3.4rem,18vw,16rem)]"
          >
            ABHIJIT
          </motion.div>

          <div className="relative z-10 mt-5 space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="font-headline text-[clamp(2.7rem,8vw,7rem)] leading-[0.9] tracking-tight"
            >
              FULL STACK
            </motion.h1>
            <h1 className="font-headline text-[clamp(2.7rem,8vw,7rem)] leading-[0.9] tracking-tight">
              <ScrambleText text="DEVELOPER" />
            </h1>
            <motion.h2
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.2 }}
              className="font-headline text-[clamp(1.3rem,3vw,2.2rem)] italic text-cyan"
            >
              & AI Engineer
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.55 }}
            className="mt-8 max-w-[420px] space-y-2 font-mono text-[0.82rem] leading-7 text-muted"
          >
            <p>B.Tech IT - GUIST, Guwahati - GATE CS 2026</p>
            <p>Building systems that think, interfaces that feel.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.58 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              data-cursor="hover"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="cta-button font-mono hud-corners"
            >
              [ View Projects {"->"} ]
            </button>
            <a
              data-cursor="hover"
              href="#contact"
              className="cta-button ghost-button font-mono hud-corners"
            >
              [ Download Resume ]
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.58 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {heroStats.map((stat, index) => (
              <div key={stat.label} className="hero-stat">
                <CountUp value={stat.value} suffix={stat.suffix} />
                <span>{stat.label}</span>
                {index < heroStats.length - 1 ? <span className="text-cyan">·</span> : null}
              </div>
            ))}
          </motion.div>
        </div>

        <div ref={canvasRef} className="relative lg:pl-2">
          <HeroNeuralCanvas simplified={isMobile} />
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted"
      >
        <div className="mx-auto mb-2 h-10 w-px bg-cyan/65 animate-pulse" />
        <p>[ Scroll ]</p>
      </div>
    </section>
  );
}
