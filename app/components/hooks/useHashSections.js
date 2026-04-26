"use client";

import { useEffect } from "react";
import { usePortfolioStore } from "@/app/components/store/portfolioStore";

export function useHashSections(sectionIds) {
  const setActiveSection = usePortfolioStore((state) => state.setActiveSection);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const nextId = entry.target.id;
          setActiveSection(nextId);
          const hash = `#${nextId}`;
          if (window.location.hash !== hash) {
            window.history.replaceState({}, "", hash);
          }
        });
      },
      {
        threshold: 0.48
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds, setActiveSection]);
}
