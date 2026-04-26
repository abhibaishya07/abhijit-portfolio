"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import SectionTag from "@/app/components/ui/SectionTag";
import { useSplitReveal } from "@/app/components/hooks/useSplitReveal";

const AboutParticleCanvas = dynamic(() => import("@/app/components/canvas/AboutParticleCanvas"), {
  ssr: false
});

export default function AboutSection() {
  const scopeRef = useRef(null);
  useSplitReveal(scopeRef);

  return (
    <section id="about" ref={scopeRef} className="section-shell relative overflow-hidden">
      <AboutParticleCanvas />
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[46%_54%]">
        <div className="relative">
          <div className="pointer-events-none absolute -left-10 top-8 origin-top-left -rotate-90">
            <p className="ghost-watermark text-[clamp(2rem,6vw,5rem)] opacity-5">
              ABHIJIT KR. BAISHYA
            </p>
          </div>
          <div className="hud-corners glow-border mt-20 bg-[#080d14] p-6 md:p-8">
            <pre className="font-mono text-[0.75rem] leading-7 text-cyan">
{`> whoami
  name:     Abhijit Kr. Baishya
  degree:   B.Tech IT (2022-Present)
  uni:      GUIST, Guwahati
  gate:     CS 2026 ✓
  email:    abhibaishya07@gmail.com
  status:   [ AVAILABLE ]_`}
            </pre>
            <div className="scanline-layer opacity-20" aria-hidden="true" />
          </div>
        </div>

        <div className="relative z-10">
          <SectionTag text="// 01 - ABOUT" />
          <h2
            data-split
            className="font-headline mt-3 text-[clamp(2rem,5vw,3rem)] leading-tight tracking-tight"
          >
            Who I Am
          </h2>
          <p data-split className="mt-5 max-w-[760px] font-mono text-[0.9rem] leading-8 text-muted">
            I&apos;m a final-year IT student at GUIST with a passion for building systems that merge
            intelligence with usability. From industrial gatepass systems at IOCL to AI-powered
            multilingual sentiment analysis, I work at the intersection of practical engineering and
            creative technology. GATE CS 2026 qualified. Always building.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["FULL STACK", "AI / ML", "3× INTERNED"].map((pill) => (
              <span
                key={pill}
                className="hud-corners border border-cyan/30 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.15em] text-cyan [box-shadow:0_0_18px_rgba(0,240,255,0.16)]"
              >
                [{pill}]
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
