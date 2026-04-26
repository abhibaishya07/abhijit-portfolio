"use client";

import { useEffect, useRef } from "react";
import { usePortfolioStore } from "@/app/components/store/portfolioStore";

export default function CustomCursor() {
  const cursorState = usePortfolioStore((state) => state.cursorState);
  const setCursorState = usePortfolioStore((state) => state.setCursorState);
  const coreRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);

  useEffect(() => {
    const onMove = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      if (coreRef.current) {
        coreRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%) scale(var(--cursor-core-scale,1))`;
      }
    };

    const onOver = (event) => {
      const canvasTarget = event.target.closest("[data-cursor='crosshair']");
      const hoverTarget = event.target.closest("a, button, [data-cursor='hover']");
      if (canvasTarget) {
        setCursorState("crosshair");
      } else if (hoverTarget) {
        setCursorState("hover");
      } else {
        setCursorState("default");
      }
    };

    const onOut = () => {
      setCursorState("default");
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%) scale(var(--cursor-ring-scale,1))`;
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [setCursorState]);

  return (
    <>
      <div
        ref={coreRef}
        className={`cursor-layer cursor-core ${
          cursorState === "hover" ? "cursor-hover" : ""
        } ${cursorState === "crosshair" ? "cursor-crosshair" : ""}`}
      />
      <div
        ref={ringRef}
        className={`cursor-layer cursor-ring ${
          cursorState === "hover" ? "cursor-hover" : ""
        } ${cursorState === "crosshair" ? "cursor-crosshair" : ""}`}
      />
    </>
  );
}
