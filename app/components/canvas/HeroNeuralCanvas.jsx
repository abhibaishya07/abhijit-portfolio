"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { useSafari } from "@/app/components/hooks/useSafari";
import { usePortfolioStore } from "@/app/components/store/portfolioStore";

const vertexShader = `
uniform float uTime;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vWorldPosition;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 p = position;
  float breathe = sin(uTime * 0.5) * 0.15;
  float displacement = snoise(position * 0.8 + uTime * 0.3) * (0.15 + breathe);
  vec3 transformed = p + normal * displacement;
  vNoise = displacement;
  vNormal = normalMatrix * normal;
  vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const fragmentShader = `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  float gradient = smoothstep(-1.2, 1.2, vWorldPosition.y + vNoise * 2.0);
  vec3 baseColor = mix(uColorB, uColorA, gradient);
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.4);
  vec3 finalColor = baseColor + fresnel * vec3(0.5, 0.8, 1.0);
  gl_FragColor = vec4(finalColor, 0.86);
}
`;

function NeuralMesh({ simplified }) {
  const meshRef = useRef(null);
  const pointsRef = useRef(null);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const pointGeometryRef = useRef(null);
  const pointMaterialRef = useRef(null);

  const particleCount = simplified ? 50 : 200;

  const positions = useMemo(() => {
    const data = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = THREE.MathUtils.randFloat(1.7, 2.6);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.cos(phi);
      data[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return data;
  }, [particleCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0008;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        state.pointer.y * 0.15,
        0.08
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        meshRef.current.rotation.y + state.pointer.x * 0.015,
        0.08
      );
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y -= 0.0018;
      pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
  });

  useEffect(
    () => () => {
      geometryRef.current?.dispose();
      materialRef.current?.dispose();
      pointGeometryRef.current?.dispose();
      pointMaterialRef.current?.dispose();
    },
    []
  );

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry ref={geometryRef} args={[1.35, 3]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          uniforms={{
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color("#00f0ff") },
            uColorB: { value: new THREE.Color("#7c3aed") }
          }}
        />
      </mesh>

      <points ref={pointsRef}>
        <bufferGeometry ref={pointGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={pointMaterialRef}
          color="#9beeff"
          size={simplified ? 0.018 : 0.022}
          sizeAttenuation
          transparent
          opacity={0.7}
        />
      </points>
    </group>
  );
}

export default function HeroNeuralCanvas({ simplified = false }) {
  const isSafari = useSafari();
  const setCursorState = usePortfolioStore((state) => state.setCursorState);

  return (
    <div
      className="relative h-[clamp(300px,58vh,720px)] w-full"
      data-cursor="crosshair"
      onPointerEnter={() => setCursorState("crosshair")}
      onPointerLeave={() => setCursorState("default")}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense
          fallback={
            <Html center>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-muted">
                Calibrating neural field...
              </p>
            </Html>
          }
        >
          <color attach="background" args={["#030508"]} />
          <pointLight position={[3, 3, 3]} intensity={0.4} color="#00f0ff" distance={18} />
          <pointLight position={[-3, -2, 2]} intensity={0.4} color="#7c3aed" distance={18} />
          <ambientLight intensity={0.18} />
          <NeuralMesh simplified={simplified} />

          {!simplified && !isSafari ? (
            <EffectComposer>
              <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.25} />
              <ChromaticAberration offset={[0.0014, 0.001]} />
              <Vignette eskil={false} offset={0.14} darkness={0.55} />
              <Noise opacity={0.018} />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
