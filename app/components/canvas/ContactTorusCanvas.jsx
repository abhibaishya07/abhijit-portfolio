"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useSafari } from "@/app/components/hooks/useSafari";

function TorusWireframe() {
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.04;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.06;
    }
  });

  useEffect(
    () => () => {
      geometryRef.current?.dispose();
      materialRef.current?.dispose();
    },
    []
  );

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry ref={geometryRef} args={[8, 2.5, 128, 16]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#00f0ff"
        transparent
        opacity={0.025}
        wireframe
      />
    </mesh>
  );
}

export default function ContactTorusCanvas() {
  const isSafari = useSafari();

  return (
    <div className="absolute inset-0 -z-10 opacity-65">
      <Canvas camera={{ position: [0, 0, 30], fov: 40 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.14} />
          <pointLight position={[8, 8, 6]} intensity={0.24} color="#00f0ff" />
          <TorusWireframe />
          {!isSafari ? (
            <EffectComposer>
              <Bloom intensity={0.2} luminanceThreshold={0.72} />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
