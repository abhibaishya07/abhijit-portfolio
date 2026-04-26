import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, RoundedBox, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import useBeautyStore from '../../store/beautyStore';
import heroMermaid from '../../assets/hero-mermaid.jpg';

const GOLD = '#d4a96a';
const BLUSH = '#f2a7bb';
const MAGENTA = '#c0446a';
const CHAMPAGNE = '#f7e4c8';

function seededValue(seed) {
  const value = Math.sin(seed * 127.1) * 43758.5453123;
  return value - Math.floor(value);
}

function createParticleData() {
  const count = 240;
  const base = new Float32Array(count * 3);
  const live = new Float32Array(count * 3);
  const speed = new Float32Array(count);
  const colorBuffer = new Float32Array(count * 3);
  const palette = [new THREE.Color(BLUSH), new THREE.Color(CHAMPAGNE), new THREE.Color(GOLD)];

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = 2.1 + seededValue(index + 1) * 2.7;
    const angle = seededValue(index + 11) * Math.PI * 2;
    const height = (seededValue(index + 21) - 0.5) * 5.4;
    const x = Math.cos(angle) * radius * (0.55 + seededValue(index + 31) * 0.6);
    const z = Math.sin(angle) * radius * (0.5 + seededValue(index + 41) * 0.5);

    base[stride] = x;
    base[stride + 1] = height;
    base[stride + 2] = z;
    live[stride] = x;
    live[stride + 1] = height;
    live[stride + 2] = z;
    speed[index] = 0.08 + seededValue(index + 51) * 0.12;

    const color = palette[index % palette.length];
    colorBuffer[stride] = color.r;
    colorBuffer[stride + 1] = color.g;
    colorBuffer[stride + 2] = color.b;
  }

  return {
    basePositions: base,
    positions: live,
    velocities: speed,
    colors: colorBuffer,
  };
}

function FloatingGlow() {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.35) * 0.08;

    if (outerRef.current) {
      outerRef.current.scale.setScalar(5.8 * pulse);
      outerRef.current.material.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
    }

    if (innerRef.current) {
      innerRef.current.scale.setScalar(3.9 * (1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.05));
      innerRef.current.material.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 1.7) * 0.03;
    }
  });

  return (
    <group position={[0, 0.55, -4.8]}>
      <mesh ref={outerRef}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial
          color={MAGENTA}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={innerRef}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial
          color={BLUSH}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function GlitterField({ enabled }) {
  const pointsRef = useRef();
  const particleDataRef = useRef(createParticleData());
  const mouseNorm = useBeautyStore((state) => state.mouseNorm);

  useEffect(() => {
    if (!pointsRef.current) {
      return undefined;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particleDataRef.current.positions, 3),
    );
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(particleDataRef.current.colors, 3),
    );

    const material = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    pointsRef.current.geometry = geometry;
    pointsRef.current.material = material;

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    if (!enabled || !pointsRef.current) {
      return;
    }

    const { basePositions, positions, velocities } = particleDataRef.current;
    const attribute = pointsRef.current.geometry.attributes.position;

    for (let index = 0; index < velocities.length; index += 1) {
      const stride = index * 3;
      const offsetX = mouseNorm.x * 0.9;
      const offsetY = mouseNorm.y * 0.4;
      const swirl = Math.sin((stride + state.clock.elapsedTime * 0.8) * 0.16) * 0.04;

      positions[stride] = THREE.MathUtils.lerp(
        positions[stride],
        basePositions[stride] + offsetX + swirl,
        0.02,
      );
      positions[stride + 2] = THREE.MathUtils.lerp(
        positions[stride + 2],
        basePositions[stride + 2] - mouseNorm.x * 0.35,
        0.02,
      );
      positions[stride + 1] += velocities[index] * delta * 3.5;

      if (positions[stride + 1] > 3.5) {
        positions[stride + 1] = -3.4 + offsetY;
      }
    }

    attribute.needsUpdate = true;
  });

  if (!enabled) {
    return null;
  }

  return (
    <points ref={pointsRef} position={[0, 0.1, 0]} />
  );
}

function FlowerKnowsProduct({ isMobile }) {
  const groupRef = useRef();
  const accentRef = useRef();
  const mouseNorm = useBeautyStore((state) => state.mouseNorm);
  const scrollProgress = useBeautyStore((state) => state.scrollProgress);
  const texture = useTexture(heroMermaid);
  const pearls = useMemo(
    () => [
      { position: [-1.92, 1.78, 0.42], scale: 0.18 },
      { position: [-1.52, 2.12, 0.18], scale: 0.13 },
      { position: [1.72, 1.96, 0.32], scale: 0.16 },
      { position: [1.88, -1.42, 0.28], scale: 0.11 },
      { position: [-1.8, -1.65, 0.22], scale: 0.14 },
    ],
    [],
  );
  const cards = useMemo(
    () => [
      { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
      { position: [0.14, -0.06, -0.16], rotation: [0, 0.08, -0.03], scale: 0.98 },
    ],
    [],
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const floatOffset = Math.sin(state.clock.elapsedTime * (Math.PI / 1.8)) * 0.16;
    const scrollRotation = scrollProgress * Math.PI * 0.58;
    const targetRotationX = mouseNorm.y * 0.12 + Math.sin(scrollProgress * Math.PI * 5) * 0.01;
    const targetRotationZ = -mouseNorm.x * 0.08;
    const targetPositionX = mouseNorm.x * 0.18;

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      floatOffset,
      3.4,
      delta,
    );
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetPositionX,
      3.6,
      delta,
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      scrollRotation + mouseNorm.x * 0.12,
      3.5,
      delta,
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotationX,
      3.8,
      delta,
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotationZ,
      3.6,
      delta,
    );

    if (accentRef.current) {
      accentRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
      accentRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.15, 0]}>
      <group rotation={[0.03, 0, 0]}>
        {cards.map((card, index) => (
          <group
            key={index}
            position={card.position}
            rotation={card.rotation}
            scale={card.scale}
          >
            <RoundedBox
              args={[3.72, 5.16, 0.22]}
              radius={0.26}
              smoothness={8}
              castShadow
              receiveShadow
            >
              <meshPhysicalMaterial
                color={index === 0 ? '#f7e4c8' : '#fceef4'}
                metalness={0.62}
                roughness={0.18}
                clearcoat={1}
                clearcoatRoughness={0.12}
                reflectivity={0.85}
              />
            </RoundedBox>

            <mesh position={[0, 0, 0.12]} castShadow receiveShadow>
              <planeGeometry args={[3.28, 4.68]} />
              <meshStandardMaterial map={texture} roughness={0.22} metalness={0.02} />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={accentRef} position={[0.82, -2.25, 0.58]} rotation={[0.2, 0.3, -0.45]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.18, 1.8, 24]} />
          <meshStandardMaterial color="#f0afc7" metalness={0.24} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.2, 0.42, 24]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.16} />
        </mesh>
      </group>

      <group position={[0, 2.72, 0.48]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[0.82, 0.07, 16, 72]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshPhysicalMaterial
            color="#fff6fb"
            emissive="#f7e4c8"
            emissiveIntensity={0.16}
            roughness={0.12}
            transmission={0.78}
            thickness={0.4}
          />
        </mesh>
      </group>

      {pearls.map((pearl, index) => (
        <mesh key={index} position={pearl.position} castShadow receiveShadow>
          <sphereGeometry args={[pearl.scale, isMobile ? 14 : 18, isMobile ? 14 : 18]} />
          <meshPhysicalMaterial
            color="#fff7fb"
            emissive="#fff0f6"
            emissiveIntensity={0.18}
            roughness={0.1}
            metalness={0.08}
            transmission={0.68}
            thickness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.28} color="#fff1f6" />
      <spotLight
        position={[5.5, 6.2, 5.8]}
        angle={0.48}
        penumbra={1}
        intensity={115}
        color={GOLD}
        castShadow
      />
      <pointLight position={[-4.4, 2.2, 4.4]} intensity={32} color={BLUSH} />
      <pointLight position={[0, 1.4, -5.2]} intensity={28} color={MAGENTA} />
      <pointLight position={[0, -2.6, 3.6]} intensity={8} color="#fff5f8" />
    </>
  );
}

function CameraRig({ isMobile }) {
  const scrollProgress = useBeautyStore((state) => state.scrollProgress);
  const mouseNorm = useBeautyStore((state) => state.mouseNorm);

  useFrame((state, delta) => {
    const heroArc = scrollProgress * Math.PI * 1.08;
    const distance = (isMobile ? 7.4 : 6.2) - Math.sin(scrollProgress * Math.PI) * 0.75;
    const height = 0.35 + Math.sin(scrollProgress * Math.PI * 1.8) * 0.55 + mouseNorm.y * 0.18;
    const targetX = Math.sin(heroArc) * distance + mouseNorm.x * 0.2;
    const targetZ = Math.cos(heroArc) * distance + 1.8;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.7, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, height, 2.7, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 2.9, delta);
    state.camera.lookAt(0, 0.45 + scrollProgress * 0.6, 0);
  });

  return null;
}

function Scene({ isMobile }) {
  return (
    <>
      <color attach="background" args={['#1a0a10']} />
      <fog attach="fog" args={['#1a0a10', 7.5, 16]} />

      <FloatingGlow />
      <SceneLights />
      <GlitterField enabled={!isMobile} />
      <FlowerKnowsProduct isMobile={isMobile} />
      <CameraRig isMobile={isMobile} />

      <ContactShadows
        position={[0, -2.8, 0]}
        opacity={0.42}
        scale={8.4}
        blur={2.6}
        far={4.5}
        color="#1a0a10"
      />

      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom intensity={isMobile ? 0.55 : 0.9} luminanceThreshold={0.1} luminanceSmoothing={0.8} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export default function HeroCanvas({ isMobile = false }) {
  return (
    <Canvas
      shadows
      dpr={isMobile ? [1, 1.1] : [1, 1.6]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.3, 7.2], fov: isMobile ? 40 : 34 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene isMobile={isMobile} />
    </Canvas>
  );
}
