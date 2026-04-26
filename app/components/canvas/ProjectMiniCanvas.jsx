"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useSafari } from "@/app/components/hooks/useSafari";

function SentiScene() {
  const meshRef = useRef(null);
  const matRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.36;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
    }
  });

  const vertex = `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragment = `
    uniform float uTime;
    varying vec3 vPos;
    void main() {
      float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + vPos.y * 4.0);
      vec3 col = mix(vec3(0.34, 0.12, 0.75), vec3(0.0, 0.94, 1.0), pulse);
      gl_FragColor = vec4(col, 0.9);
    }
  `;

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.85, 2]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>
      <Sparkles count={70} size={2} scale={[3.2, 1.4, 2.2]} color="#a0f6ff" speed={0.3} />
    </group>
  );
}

function KivaraScene() {
  const sphereRef = useRef(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.28;
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.78, 64, 64]} />
        <meshPhysicalMaterial
          color="#fda5c9"
          roughness={0}
          metalness={0.35}
          transmission={0.94}
          thickness={1.8}
          ior={1.55}
          iridescence={1}
          iridescenceIOR={1.8}
          clearcoat={1}
          transparent
          opacity={0.86}
        />
      </mesh>
      <Sparkles count={85} size={2.3} scale={[3.2, 1.6, 2.2]} color="#ffd1de" speed={0.5} />
    </group>
  );
}

function IOCLScene() {
  const groupRef = useRef(null);
  const geoRef = useRef(null);
  const edgeGeoRef = useRef(null);
  const materialRef = useRef(null);

  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.25, 1.25, 1.25)), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.35;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  useEffect(
    () => () => {
      geoRef.current?.dispose();
      edgeGeoRef.current?.dispose();
      materialRef.current?.dispose();
      edgeGeometry.dispose();
    },
    [edgeGeometry]
  );

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry ref={geoRef} args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial color="#111925" transparent opacity={0.25} />
      </mesh>
      <lineSegments>
        <primitive ref={edgeGeoRef} object={edgeGeometry} attach="geometry" />
        <lineBasicMaterial ref={materialRef} color="#00f0ff" transparent opacity={0.8} />
      </lineSegments>
    </group>
  );
}

export default function ProjectMiniCanvas({ variant }) {
  const isSafari = useSafari();

  return (
    <div className="h-[220px] w-full bg-[#050a12]">
      <Canvas camera={{ position: [0, 0, 3.3], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 2, 3]} intensity={0.9} color="#00f0ff" />
          <pointLight position={[-2, -1, 3]} intensity={0.6} color="#7c3aed" />
          {variant === "sentiscope" ? <SentiScene /> : null}
          {variant === "kivarabeauty" ? <KivaraScene /> : null}
          {variant === "iocl-gatepass" ? <IOCLScene /> : null}
          {!isSafari ? (
            <EffectComposer>
              <Bloom intensity={0.9} luminanceThreshold={0.25} />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
