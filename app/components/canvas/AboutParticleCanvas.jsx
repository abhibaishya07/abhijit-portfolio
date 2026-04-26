"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/app/components/hooks/useIsMobile";

function ParticleField({ count }) {
  const pointsRef = useRef(null);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);

  const positions = useMemo(() => {
    const buffer = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      buffer[i * 3] = THREE.MathUtils.randFloatSpread(16);
      buffer[i * 3 + 1] = THREE.MathUtils.randFloatSpread(8);
      buffer[i * 3 + 2] = THREE.MathUtils.randFloatSpread(9);
    }
    return buffer;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) {
      return;
    }
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.position.x = Math.sin(t * 0.2) * 0.18;
  });

  useEffect(
    () => () => {
      geometryRef.current?.dispose();
      materialRef.current?.dispose();
    },
    []
  );

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#d9f8ff"
        size={0.03}
        transparent
        opacity={0.02}
        sizeAttenuation
      />
    </points>
  );
}

export default function AboutParticleCanvas() {
  const isMobile = useIsMobile();
  const count = isMobile ? 220 : 500;

  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas dpr={[1, 1.2]} camera={{ position: [0, 0, 7], fov: 55 }}>
        <Suspense fallback={null}>
          <ParticleField count={count} />
        </Suspense>
      </Canvas>
    </div>
  );
}
