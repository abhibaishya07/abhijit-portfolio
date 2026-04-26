import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Sphere, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ── Lipstick tube ────────────────────────────────────────────────────────────
function LipstickTube({ position, scale = 1, color = '#e91e8c', speed = 1 }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4 * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.2;
    }
  });
  return (
    <Float speed={2 * speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Tube body */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 1.2, 32]} />
          <meshStandardMaterial color="#c2185b" metalness={0.7} roughness={0.15} />
        </mesh>
        {/* Bullet top */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.6, 32]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.05} />
        </mesh>
        {/* Tip */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0, 0.12, 0.3, 32]} />
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.05} />
        </mesh>
        {/* Gold band */}
        <mesh position={[0, -0.08, 0]}>
          <torusGeometry args={[0.195, 0.025, 16, 64]} />
          <meshStandardMaterial color="#f7d56e" metalness={1} roughness={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Blush compact ────────────────────────────────────────────────────────────
function BlushCompact({ position, scale = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      ref.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.2}>
      <group ref={ref} position={position} scale={scale}>
        {/* Compact lid */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 64]} />
          <meshStandardMaterial color="#f48fb1" metalness={0.6} roughness={0.1} />
        </mesh>
        {/* Compact base */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.12, 64]} />
          <meshStandardMaterial color="#e91e8c" metalness={0.8} roughness={0.1} />
        </mesh>
        {/* Blush pan */}
        <mesh position={[0, 0.115, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 64]} />
          <meshStandardMaterial color="#f9a8c9" roughness={0.95} metalness={0} />
        </mesh>
        {/* Mirror shine */}
        <mesh position={[0, 0.135, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Perfume bottle ───────────────────────────────────────────────────────────
function PerfumeBottle({ position, scale = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={1}>
      <group ref={ref} position={position} scale={scale}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.9, 0.25, 4, 4, 4]} />
          <meshStandardMaterial color="#fce4ec" metalness={0.1} roughness={0.05} transparent opacity={0.9} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.1, 0.18, 0.25, 16]} />
          <meshStandardMaterial color="#f8bbd0" metalness={0.2} roughness={0.05} />
        </mesh>
        {/* Cap */}
        <mesh position={[0, 0.77, 0]}>
          <cylinderGeometry args={[0.13, 0.1, 0.18, 16]} />
          <meshStandardMaterial color="#c2185b" metalness={0.9} roughness={0.05} />
        </mesh>
        {/* Label */}
        <mesh position={[0, -0.05, 0.13]}>
          <planeGeometry args={[0.38, 0.5]} />
          <meshStandardMaterial color="#fff" transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

// ── Eyeshadow palette ────────────────────────────────────────────────────────
function EyeshadowPalette({ position, scale = 1 }) {
  const ref = useRef();
  const colors = ['#f48fb1', '#f06292', '#e91e8c', '#c2185b', '#ad1457', '#880e4f', '#fce4ec', '#f8bbd0', '#f48fb1'];
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.15;
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.25} floatIntensity={0.8}>
      <group ref={ref} position={position} scale={scale}>
        {/* Base */}
        <mesh>
          <boxGeometry args={[1.1, 0.08, 0.7]} />
          <meshStandardMaterial color="#c2185b" metalness={0.7} roughness={0.15} />
        </mesh>
        {/* Pans 3x3 */}
        {colors.map((c, i) => (
          <mesh
            key={i}
            position={[(i % 3 - 1) * 0.34, 0.055, (Math.floor(i / 3) - 1) * 0.22]}
          >
            <cylinderGeometry args={[0.14, 0.14, 0.04, 24]} />
            <meshStandardMaterial color={c} roughness={0.9} metalness={0.1} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// ── Gloss orb ────────────────────────────────────────────────────────────────
function GlossOrb({ position, scale = 1, color = '#f48fb1' }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.12;
    }
  });
  return (
    <Sphere ref={ref} args={[scale * 0.3, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        distort={0.25}
        speed={2}
        metalness={0.4}
        roughness={0.05}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

// ── Background gradient sphere ───────────────────────────────────────────────
function BackgroundBlob({ position, color, scale = 3 }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.08;
  });
  return (
    <Sphere ref={ref} args={[scale, 32, 32]} position={position}>
      <MeshDistortMaterial color={color} distort={0.4} speed={1.5} transparent opacity={0.12} />
    </Sphere>
  );
}

// ── Stars / glitter ──────────────────────────────────────────────────────────
function GlitterField() {
  return (
    <Sparkles
      count={180}
      scale={12}
      size={3}
      speed={0.4}
      opacity={0.7}
      color="#f48fb1"
    />
  );
}

// ── Main scene ───────────────────────────────────────────────────────────────
export default function MakeupScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.2} color="#fff5f9" />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#fce4ec" />
      <directionalLight position={[-5, 3, -3]} intensity={1.5} color="#f48fb1" />
      <pointLight position={[0, 3, 3]} intensity={3} color="#e91e8c" distance={10} />
      <pointLight position={[3, -2, 0]} intensity={2} color="#f9a8c9" distance={8} />
      <pointLight position={[-3, 2, 0]} intensity={1.5} color="#fff8e1" distance={8} />

      {/* Background atmosphere */}
      <BackgroundBlob position={[-4, 1, -4]} color="#f48fb1" scale={3.5} />
      <BackgroundBlob position={[4, -1, -4]} color="#e91e8c" scale={2.8} />

      {/* Glitter */}
      <GlitterField />

      {/* Makeup items */}
      <LipstickTube position={[-2.8, 0.5, 0]} scale={1.3} color="#e91e8c" speed={1.1} />
      <LipstickTube position={[2.2, -0.8, -0.5]} scale={1} color="#c2185b" speed={0.8} />
      <LipstickTube position={[0.5, 1.5, -1]} scale={0.7} color="#f06292" speed={1.4} />

      <BlushCompact position={[0, -0.4, 0.5]} scale={1.4} />
      <BlushCompact position={[-3.5, -1, -1]} scale={0.9} />

      <PerfumeBottle position={[3.5, 0.8, 0]} scale={1.2} />

      <EyeshadowPalette position={[-1.2, 1.2, -0.5]} scale={1.1} />

      <GlossOrb position={[-0.5, -1.5, 1]} scale={1.8} color="#f48fb1" />
      <GlossOrb position={[1.8, 1.8, -1]} scale={1.2} color="#e91e8c" />
      <GlossOrb position={[-3, 1.5, -1.5]} scale={1} color="#f9a8c9" />
      <GlossOrb position={[3.8, -1.5, -0.5]} scale={1.4} color="#fce4ec" />
    </Canvas>
  );
}
