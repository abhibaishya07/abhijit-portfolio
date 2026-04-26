"use client";

import { useEffect } from "react";
import { usePortfolioStore } from "@/app/components/store/portfolioStore";
import GlobalEffects from "@/app/components/ui/GlobalEffects";
import Navigation from "@/app/components/ui/Navigation";
import CustomCursor from "@/app/components/ui/CustomCursor";
import LoadingScreen from "@/app/components/ui/LoadingScreen";

export default function ClientShell({ children }) {
  const isLoading = usePortfolioStore((state) => state.isLoading);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <>
      <svg className="page-noise" aria-hidden="true">
        <filter id="portfolio-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div className="grid-overlay" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      <GlobalEffects />
      <Navigation />
      <CustomCursor />

      {isLoading ? <LoadingScreen /> : null}
      <div className="relative z-10">{children}</div>
    </>
  );
}
