"use client";

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTag from "@/app/components/ui/SectionTag";
import { skillCategories } from "@/app/components/data/portfolioData";
import { useIsMobile } from "@/app/components/hooks/useIsMobile";
import { useSplitReveal } from "@/app/components/hooks/useSplitReveal";

gsap.registerPlugin(ScrollTrigger);

const SkillsGlobeCanvas = dynamic(() => import("@/app/components/canvas/SkillsGlobeCanvas"), {
  ssr: false
});

export default function SkillsSection() {
  const isMobile = useIsMobile();
  const gateBadgeRef = useRef(null);
  const scopeRef = useRef(null);
  useSplitReveal(scopeRef);

  useLayoutEffect(() => {
    if (!gateBadgeRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from(gateBadgeRef.current, {
        x: -80,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gateBadgeRef.current,
          start: "top 85%"
        }
      });

      gsap.fromTo(
        gateBadgeRef.current,
        { boxShadow: "0 0 0 rgba(245,158,11,0)" },
        {
          boxShadow: "0 0 40px rgba(245,158,11,0.28)",
          duration: 0.45,
          yoyo: true,
          repeat: 1,
          scrollTrigger: {
            trigger: gateBadgeRef.current,
            start: "top 85%"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="section-shell relative">
      <div ref={scopeRef} className="mx-auto w-full max-w-[1440px]">
        <SectionTag text="// 03 - SKILLS" />
        <h2
          data-split
          className="font-headline mt-3 text-[clamp(2rem,5.2vw,3.7rem)] tracking-tight"
        >
          Systems, Languages, Tools
        </h2>

        {!isMobile ? (
          <SkillsGlobeCanvas />
        ) : (
          <div className="mt-8 flex flex-wrap gap-2">
            {skillCategories.flatMap((category) =>
              category.items.map((skill) => (
                <span key={skill} className="skill-chip font-mono text-muted">
                  {skill}
                </span>
              ))
            )}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skillCategories.map((category) => (
            <article key={category.title} className="hud-corners glow-border bg-[#080d14] p-4">
              <h3 className="font-headline text-lg" style={{ color: category.color }}>
                {category.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="skill-chip font-mono text-muted">
                    {"->"} {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div
          ref={gateBadgeRef}
          className="hud-corners mt-9 border border-gold/60 bg-[#120f07] p-5 font-mono text-gold"
        >
          <p className="text-[0.95rem] tracking-[0.15em]">★ GATE CS 2026 - QUALIFIED</p>
          <p className="mt-2 text-[0.76rem] uppercase tracking-[0.11em] text-gold/85">
            Graduate Aptitude Test in Engineering
          </p>
          <p className="text-[0.76rem] uppercase tracking-[0.11em] text-gold/85">
            Computer Science · All India Rank
          </p>
        </div>
      </div>
    </section>
  );
}
