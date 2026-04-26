"use client";

import { useEffect, useState } from "react";

export default function CountUp({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;

    const tick = (time) => {
      const progress = Math.min(1, (time - start) / duration);
      setDisplay(Math.round(progress * value));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}
