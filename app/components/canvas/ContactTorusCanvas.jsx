"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useSafari } from "@/app/components/hooks/useSafari";

function TorusWireframe({ mobile }) {
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
      <torusKnotGeometry ref={geometryRef} args={mobile ? [6.6, 2, 96, 12] : [8, 2.5, 128, 16]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#00f0ff"
        transparent
        opacity={mobile ? 0.02 : 0.025}
        wireframe
      />
    </mesh>
  );
}

export default function ContactTorusCanvas({ mobile = false }) {
  const isSafari = useSafari();

  return (
    <div className="absolute inset-0 -z-10 opacity-65">
      <Canvas camera={{ position: mobile ? [0, 0, 26] : [0, 0, 30], fov: mobile ? 46 : 40 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={mobile ? 0.16 : 0.14} />
          <pointLight position={[8, 8, 6]} intensity={mobile ? 0.2 : 0.24} color="#00f0ff" />
          <TorusWireframe mobile={mobile} />
          {!mobile && !isSafari ? (
            <EffectComposer>
              <Bloom intensity={0.2} luminanceThreshold={0.72} />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
