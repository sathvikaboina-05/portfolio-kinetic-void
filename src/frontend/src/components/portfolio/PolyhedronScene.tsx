import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function IcosahedronWireframe() {
  const primaryRef = useRef<THREE.Mesh>(null);
  const secondaryRef = useRef<THREE.Mesh>(null);
  const tertiaryRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (primaryRef.current) {
      primaryRef.current.rotation.y = t * 0.15;
      primaryRef.current.rotation.x = t * 0.08;
    }
    if (secondaryRef.current) {
      secondaryRef.current.rotation.y = -t * 0.1;
      secondaryRef.current.rotation.x = t * 0.12;
      secondaryRef.current.rotation.z = t * 0.05;
    }
    if (tertiaryRef.current) {
      tertiaryRef.current.rotation.y = t * 0.07;
      tertiaryRef.current.rotation.z = -t * 0.09;
    }
  });

  return (
    <>
      {/* Primary cyan wireframe */}
      <mesh ref={primaryRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#2FE6FF"
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Secondary magenta wireframe — slightly larger, counter-rotating */}
      <mesh ref={secondaryRef} scale={1.22}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#FF3BD4"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Tertiary violet — outermost shell */}
      <mesh ref={tertiaryRef} scale={1.45}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial
          color="#7B4DFF"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 250;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.4 + Math.random() * 3.0;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      pointsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.02) * 0.15;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#2FE6FF"
        size={0.03}
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  );
}

function MagentaParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 80;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.6 + Math.random() * 1.2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = -state.clock.elapsedTime * 0.07;
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#FF3BD4"
        size={0.025}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function PolyhedronScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <IcosahedronWireframe />
      <FloatingParticles />
      <MagentaParticles />
    </Canvas>
  );
}
