"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import SectionTag from "@/app/components/ui/SectionTag";
import ScrambleText from "@/app/components/ui/ScrambleText";
import { contactLinks } from "@/app/components/data/portfolioData";
import { useIsMobile } from "@/app/components/hooks/useIsMobile";
import { useSplitReveal } from "@/app/components/hooks/useSplitReveal";

const ContactTorusCanvas = dynamic(() => import("@/app/components/canvas/ContactTorusCanvas"), {
  ssr: false
});

export default function ContactSection() {
  const isMobile = useIsMobile();
  const scopeRef = useRef(null);
  useSplitReveal(scopeRef);

  return (
    <section id="contact" className="section-shell relative min-h-[100dvh] overflow-hidden">
      {!isMobile ? (
        <ContactTorusCanvas />
      ) : (
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,240,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "scanline-move 10s linear infinite"
          }}
        />
      )}

      <div
        ref={scopeRef}
        className="hud-corners relative z-10 mx-auto flex min-h-[78vh] w-full max-w-[980px] flex-col justify-center border border-cyan/15 bg-[rgba(3,8,13,0.72)] px-4 py-8 backdrop-blur-[2px] md:px-10"
      >
        <p className="ghost-watermark absolute left-0 top-8 text-[clamp(4rem,18vw,14rem)] opacity-[0.03]">
          CONTACT
        </p>

        <SectionTag text="// 05 - CONTACT" />
        <h2
          data-split
          className="font-headline mt-3 text-[clamp(2.6rem,8vw,4.6rem)] leading-[0.88] tracking-tight"
        >
          Let&apos;s Build
        </h2>
        <h3 className="font-headline text-[clamp(2rem,6.3vw,3.5rem)] leading-[0.95] text-cyan">
          <ScrambleText text="Something Great." delay={200} />
        </h3>
        <p
          data-split
          className="mt-5 max-w-[660px] font-mono text-[0.82rem] uppercase tracking-[0.08em] text-muted"
        >
          Open to internships, full-time roles, freelance projects, and collaboration.
        </p>

        <div className="mt-9 space-y-1">
          {contactLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="contact-link">
              <span className="font-mono text-[clamp(0.86rem,2.2vw,1.1rem)] tracking-[0.05em]">
                -&gt; {item.label}
              </span>
              <span className="link-icon font-mono text-cyan">[↗]</span>
            </a>
          ))}
        </div>

        <p className="mt-8 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted">
          📍 Maligaon, Guwahati 781012, Assam, India
        </p>

        <div className="mt-8 inline-flex w-max items-center gap-2 border border-rose/35 px-3 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-rose [box-shadow:0_0_18px_rgba(244,63,94,0.2)]">
          <span className="availability-dot">●</span>
          <span>CURRENTLY AVAILABLE</span>
        </div>
      </div>
    </section>
  );
}
