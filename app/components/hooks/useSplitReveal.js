"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function useSplitReveal(scopeRef, selector = "[data-split]") {
  useLayoutEffect(() => {
    if (!scopeRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray(selector);
      nodes.forEach((node) => {
        const split = new SplitText(node, { type: "words" });
        gsap.from(split.words, {
          opacity: 0,
          yPercent: 120,
          duration: 0.85,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 84%"
          },
          onComplete: () => split.revert()
        });
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, selector]);
}
