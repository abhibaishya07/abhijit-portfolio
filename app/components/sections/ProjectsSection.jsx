"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionTag from "@/app/components/ui/SectionTag";
import { projects } from "@/app/components/data/portfolioData";
import { useIsMobile } from "@/app/components/hooks/useIsMobile";
import { usePortfolioStore } from "@/app/components/store/portfolioStore";
import { useSplitReveal } from "@/app/components/hooks/useSplitReveal";

gsap.registerPlugin(ScrollTrigger);

const ProjectMiniCanvas = dynamic(() => import("@/app/components/canvas/ProjectMiniCanvas"), {
  ssr: false
});

function ProjectCard({ project }) {
  const cardRef = useRef(null);

  const onMove = (event) => {
    if (!cardRef.current) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateX(${(-y * 12).toFixed(
      2
    )}deg) rotateY(${(x * 12).toFixed(2)}deg) translateY(-8px)`;
  };

  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }
  };

  return (
    <article
      ref={cardRef}
      className="project-card hud-corners"
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
      style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, ${project.accent}22, transparent 50%), radial-gradient(circle at 80% 90%, ${project.accent}15, transparent 55%)`
      }}
    >
      <ProjectMiniCanvas variant={project.slug} />
      <div className="relative p-6">
        <span className="absolute right-5 top-3 font-mono text-[4rem] leading-none text-white/5">
          {project.id}
        </span>
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-cyan">{project.tags}</p>
        <h3 className="font-headline mt-3 text-[1.55rem] tracking-tight">{project.title}</h3>
        <p className="mt-3 font-mono text-[0.8rem] leading-6 text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((item) => (
            <span
              key={item}
              className="border border-cyan/20 px-2 py-[0.28rem] font-mono text-[0.62rem] uppercase tracking-[0.12em] text-primary/85"
            >
              {item}
            </span>
          ))}
        </div>
        <a
          href="#contact"
          className="mt-6 inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-cyan transition-transform duration-300 hover:translate-x-1"
        >
          [ View Project {"->"} ]
        </a>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const scopeRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const setScrollProgress = usePortfolioStore((state) => state.setScrollProgress);
  useSplitReveal(scopeRef);

  useLayoutEffect(() => {
    if (isMobile || !sectionRef.current || !trackRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const getDistance = () =>
        Math.max(0, trackRef.current.scrollWidth - sectionRef.current.clientWidth + 64);

      const tween = gsap.to(trackRef.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getDistance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            setScrollProgress(self.progress);
          }
        }
      });

      return () => tween.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, setScrollProgress]);

  const cards = useMemo(() => projects.map((project) => <ProjectCard key={project.id} project={project} />), []);

  return (
    <section id="projects" ref={sectionRef} className="section-shell relative overflow-hidden">
      <div ref={scopeRef} className="mx-auto w-full max-w-[1440px]">
        <p className="ghost-watermark absolute -top-2 left-2 text-[clamp(4rem,20vw,18rem)] opacity-[0.03]">
          WORK
        </p>
        <SectionTag text="// 02 - PROJECTS" />
        <h2
          data-split
          className="font-headline mt-3 text-[clamp(2rem,5.4vw,3.8rem)] tracking-tight"
        >
          Selected Work
        </h2>
        <p
          data-split
          className="mt-2 font-mono text-[0.76rem] uppercase tracking-[0.18em] text-muted"
        >
          3 projects - full-stack - AI - 3D web
        </p>

        <div
          ref={trackRef}
          className={`mt-10 flex gap-7 ${
            isMobile ? "flex-col" : "w-max flex-row"
          }`}
        >
          {cards}
        </div>

        {!isMobile ? (
          <div className="mt-8 h-[2px] w-full bg-cyan/20">
            <div
              className="h-full bg-cyan transition-[width]"
              style={{ width: `${Math.max(6, progress * 100)}%` }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
