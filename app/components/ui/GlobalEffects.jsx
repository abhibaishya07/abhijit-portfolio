"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolioStore } from "@/app/components/store/portfolioStore";

gsap.registerPlugin(ScrollTrigger);

export default function GlobalEffects() {
  const setScrollProgress = usePortfolioStore((state) => state.setScrollProgress);

  useEffect(() => {
    let frame = null;
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.4,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t))
    });

    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    lenis.on("scroll", ({ progress }) => {
      ScrollTrigger.update();
      setScrollProgress(progress);
    });

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onResize);
      if (frame) {
        cancelAnimationFrame(frame);
      }
      lenis.destroy();
      ScrollTrigger.killAll();
    };
  }, [setScrollProgress]);

  return null;
}
