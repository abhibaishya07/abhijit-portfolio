"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTag from "@/app/components/ui/SectionTag";
import { timelineInternships, timelineLeadership } from "@/app/components/data/portfolioData";
import { useIsMobile } from "@/app/components/hooks/useIsMobile";
import { useSplitReveal } from "@/app/components/hooks/useSplitReveal";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const containerRef = useRef(null);
  const dotRef = useRef(null);
  const scopeRef = useRef(null);
  const isMobile = useIsMobile();
  useSplitReveal(scopeRef);

  useLayoutEffect(() => {
    if (!containerRef.current || !dotRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.to(dotRef.current, {
        y: () => Math.max(0, containerRef.current.clientHeight - 24),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="section-shell relative">
      <div ref={scopeRef} className="mx-auto w-full max-w-[1440px]">
        <SectionTag text="// 04 - EXPERIENCE" />
        <h2
          data-split
          className="font-headline mt-3 text-[clamp(2rem,5.2vw,3.6rem)] tracking-tight"
        >
          Where I&apos;ve Been
        </h2>

        <div ref={containerRef} className="relative mt-14">
          <div className="timeline-line" aria-hidden="true" />
          <div ref={dotRef} className="timeline-dot" aria-hidden="true" />

          <div className="space-y-9">
            {timelineInternships.map((entry, idx) => (
              <article
                key={entry.org}
                className={`hud-corners glow-border relative bg-[#080d14] p-5 md:p-6 ${
                  !isMobile && idx % 2 === 0
                    ? "md:ml-[54%] md:max-w-[46%]"
                    : !isMobile
                      ? "md:mr-[54%] md:max-w-[46%]"
                      : "ml-6"
                }`}
              >
                <span className="absolute right-4 top-4 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-gold">
                  {entry.date}
                </span>
                <h3 className="font-headline text-[1.2rem]">{entry.org}</h3>
                <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.17em] text-cyan">
                  {entry.role}
                </p>
                <ul className="mt-4 space-y-2 font-mono text-[0.8rem] leading-6 text-muted">
                  {entry.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.tech.map((tag) => (
                    <span
                      key={tag}
                      className="border border-cyan/20 px-2 py-[0.27rem] font-mono text-[0.62rem] uppercase tracking-[0.12em] text-primary/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}

            {timelineLeadership.map((entry, idx) => (
              <article
                key={entry.title}
                className={`hud-corners glow-border relative bg-[#0d1019] p-5 md:p-6 ${
                  !isMobile && idx % 2 === 0
                    ? "md:mr-[54%] md:max-w-[46%]"
                    : !isMobile
                      ? "md:ml-[54%] md:max-w-[46%]"
                      : "ml-6"
                }`}
              >
                <span className="absolute right-4 top-4 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-gold">
                  {entry.date}
                </span>
                <h3 className="font-headline text-[1.1rem]">{entry.title}</h3>
                <p className="mt-2 font-mono text-[0.76rem] uppercase tracking-[0.16em] text-muted">
                  {entry.org}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
