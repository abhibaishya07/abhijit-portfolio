"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { skillCategories } from "@/app/components/data/portfolioData";

const EXTRA_WORDS = [
  "XLM-RoBERTa",
  "Streamlit",
  "Whisper",
  "Plotly",
  "Lenis",
  "Framer Motion",
  "GSAP",
  "Neon",
  "Express.js",
  "REST",
  "Docker",
  "GitHub"
];

const FLATTENED = skillCategories.flatMap((category) =>
  category.items.map((item, index) => ({
    name: item,
    color: category.color,
    scale: index < 3 ? 1.2 : 1
  }))
);

const WORDS = [
  ...FLATTENED,
  ...EXTRA_WORDS.map((word) => ({
    name: word,
    color: "var(--text-muted)",
    scale: 0.9
  }))
];

function fibonacciSphere(items, radius = 3.2) {
  const total = items.length;
  return items.map((item, index) => {
    const y = 1 - (index / (total - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    return {
      ...item,
      position: [x * radius, y * radius, z * radius]
    };
  });
}

function WordSphere() {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const points = useMemo(() => fibonacciSphere(WORDS), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0035;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.26) * 0.14;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((item, index) => {
        const isActive = hovered === null || hovered === index;
        return (
          <Html
            key={`${item.name}-${index}`}
            position={item.position}
            transform
            distanceFactor={1.1}
            center
            zIndexRange={[30, 0]}
            occlude={false}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHovered(index);
            }}
            onPointerOut={() => setHovered(null)}
          >
            <span
              className="font-mono uppercase tracking-[0.08em]"
              style={{
                display: "inline-block",
                fontSize: `${0.52 * item.scale}rem`,
                color: item.color,
                opacity: isActive ? 1 : 0.25,
                textShadow: isActive ? "0 0 18px rgba(0,240,255,0.55)" : "none",
                transform: `scale(${hovered === index ? 1.18 : 1})`,
                transition: "opacity 0.2s ease, transform 0.2s ease, text-shadow 0.2s ease",
                pointerEvents: "auto",
                whiteSpace: "nowrap"
              }}
            >
              {item.name}
            </span>
          </Html>
        );
      })}
    </group>
  );
}

export default function SkillsGlobeCanvas() {
  return (
    <div className="mx-auto h-[min(600px,75vw)] w-full max-w-[680px]" data-cursor="crosshair">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]} frameloop="always">
        <Suspense fallback={null}>
          <ambientLight intensity={0.24} />
          <pointLight position={[4, 4, 4]} intensity={0.75} color="#00f0ff" />
          <WordSphere />
        </Suspense>
      </Canvas>
    </div>
  );
}
