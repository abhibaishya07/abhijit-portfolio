"use client";

import { useEffect, useMemo, useState } from "react";

const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function ScrambleText({ text, className = "", delay = 0 }) {
  const [output, setOutput] = useState(text);
  const chars = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    let frame = null;
    let count = 0;
    let start = null;

    const animate = (time) => {
      if (!start) {
        start = time;
      }

      const elapsed = time - start;
      if (elapsed < delay) {
        frame = requestAnimationFrame(animate);
        return;
      }

      count += 1;
      const next = chars
        .map((char, index) => {
          if (char === " ") {
            return " ";
          }
          if (index < count / 2) {
            return char;
          }
          return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
        })
        .join("");

      setOutput(next);

      if (count < chars.length * 2 + 6) {
        frame = requestAnimationFrame(animate);
      } else {
        setOutput(text);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [chars, delay, text]);

  return <span className={className}>{output}</span>;
}
