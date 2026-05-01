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

function WordSphere({ mobile }) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const dragState = useRef({ active: false, x: 0, y: 0 });
  const points = useMemo(() => {
    const subset = mobile ? WORDS.slice(0, 32) : WORDS;
    return fibonacciSphere(subset, mobile ? 2.45 : 3.2);
  }, [mobile]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0035;
      const targetX = Math.sin(state.clock.elapsedTime * 0.26) * 0.14 + dragState.current.y * 0.18;
      const targetY = groupRef.current.rotation.y + dragState.current.x * 0.18;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
      dragState.current.x *= 0.92;
      dragState.current.y *= 0.92;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={() => {
        dragState.current.active = true;
      }}
      onPointerUp={() => {
        dragState.current.active = false;
      }}
      onPointerOut={() => {
        dragState.current.active = false;
      }}
      onPointerMove={(event) => {
        if (!dragState.current.active) {
          return;
        }
        dragState.current.x = event.pointerType === "touch" ? event.movementX * 0.01 : event.movementX * 0.004;
        dragState.current.y = event.pointerType === "touch" ? event.movementY * 0.01 : event.movementY * 0.004;
      }}
    >
      {points.map((item, index) => {
        const isActive = mobile || hovered === null || hovered === index;
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
              if (mobile) {
                return;
              }
              event.stopPropagation();
              setHovered(index);
            }}
            onPointerOut={() => {
              if (!mobile) {
                setHovered(null);
              }
            }}
          >
            <span
              className="font-mono uppercase tracking-[0.08em]"
              style={{
                display: "inline-block",
                fontSize: `${0.52 * item.scale}rem`,
                color: item.color,
                opacity: isActive ? 1 : 0.25,
                textShadow: isActive ? "0 0 18px rgba(0,240,255,0.55)" : "none",
                transform: `scale(${!mobile && hovered === index ? 1.18 : 1})`,
                transition: "opacity 0.2s ease, transform 0.2s ease, text-shadow 0.2s ease",
                pointerEvents: mobile ? "none" : "auto",
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

export default function SkillsGlobeCanvas({ mobile = false }) {
  return (
    <div
      className={`mx-auto w-full max-w-[680px] ${mobile ? "h-[320px]" : "h-[min(600px,75vw)]"}`}
      data-cursor="crosshair"
    >
      <Canvas
        camera={{ position: mobile ? [0, 0, 6.6] : [0, 0, 8], fov: mobile ? 56 : 50 }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.24} />
          <pointLight position={[4, 4, 4]} intensity={0.75} color="#00f0ff" />
          <WordSphere mobile={mobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
