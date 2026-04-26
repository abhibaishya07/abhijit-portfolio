"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePortfolioStore } from "@/app/components/store/portfolioStore";

export default function LoadingScreen() {
  const setIsLoading = usePortfolioStore((state) => state.setIsLoading);
  const screenRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.8,
        ease: "power2.out"
      }
    ).to(screenRef.current, {
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      yPercent: -25,
      duration: 0.7,
      ease: "power4.inOut",
      onComplete: () => setIsLoading(false)
    });

    return () => tl.kill();
  }, [setIsLoading]);

  return (
    <div ref={screenRef} className="loading-screen">
      <div className="loading-shell">
        <svg width="190" height="120" viewBox="0 0 190 120" aria-hidden="true">
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="transparent"
            stroke="var(--accent-cyan)"
            strokeWidth="1.2"
            className="font-headline text-[92px] [stroke-dasharray:420] [stroke-dashoffset:420] animate-[draw-stroke_1.8s_ease_forwards]"
          >
            AB
          </text>
        </svg>
        <div className="loading-bar">
          <div ref={barRef} className="loading-bar-fill" />
        </div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          Initializing · Abhijit Kr. Baishya · Portfolio
        </p>
      </div>
    </div>
  );
}
