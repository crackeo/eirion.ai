"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Deterministic PRNG so the constellation is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NODE_COUNT = 140;
const LINK_DISTANCE = 1.55;

function useConstellation() {
  return useMemo(() => {
    const rand = mulberry32(20260724);
    const positions = new Float32Array(NODE_COUNT * 3);
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      // Spherical shell distribution with organic jitter
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 2.5 + rand() * 1.4;
      const v = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.72,
        r * Math.cos(phi)
      );
      nodes.push(v);
      positions.set([v.x, v.y, v.z], i * 3);
    }

    const linePositions: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodes[i].distanceTo(nodes[j]) < LINK_DISTANCE) {
          linePositions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }

    return {
      nodePositions: positions,
      linePositions: new Float32Array(linePositions),
    };
  }, []);
}

function Constellation() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const { nodePositions, linePositions } = useConstellation();

  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;
    // Slow ambient rotation + eased mouse parallax
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x, 0.04);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y, 0.04);

    group.current.rotation.y += delta * 0.07;
    group.current.rotation.x = pointer.current.y * 0.16;
    group.current.rotation.z = pointer.current.x * 0.06;

    const t = state.clock.elapsedTime;
    if (core.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.08;
      core.current.scale.setScalar(pulse);
    }
    if (halo.current) {
      const pulse = 1.25 + Math.sin(t * 1.6 + 0.8) * 0.12;
      halo.current.scale.setScalar(pulse);
      (halo.current.material as THREE.MeshBasicMaterial).opacity =
        0.16 + Math.sin(t * 1.6) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Agent nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#eef8e6"
          size={0.055}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>

      {/* MCP connection mesh */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0d3d20"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </lineSegments>

      {/* ELLIE core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.62, 2]} />
        <meshBasicMaterial color="#fbf9f1" wireframe transparent opacity={0.85} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial color="#d6f5df" transparent opacity={0.16} depthWrite={false} />
      </mesh>

      {/* Orbiting golden satellites */}
      <Satellites />
    </group>
  );
}

function Satellites() {
  const ref = useRef<THREE.Group>(null);
  const satellites = useMemo(() => {
    const rand = mulberry32(7);
    return Array.from({ length: 6 }, (_, i) => ({
      radius: 1.35 + i * 0.28,
      speed: 0.32 + rand() * 0.35,
      offset: rand() * Math.PI * 2,
      tilt: (rand() - 0.5) * 1.1,
    }));
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const s = satellites[i];
      const angle = t * s.speed + s.offset;
      child.position.set(
        Math.cos(angle) * s.radius,
        Math.sin(angle * 0.9) * s.radius * Math.sin(s.tilt) * 0.4,
        Math.sin(angle) * s.radius
      );
    });
  });

  return (
    <group ref={ref}>
      {satellites.map((s) => (
        <mesh key={s.offset}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#0a2e18" />
        </mesh>
      ))}
    </group>
  );
}

/** Full R3F scene, mounted client-side only via dynamic import.
 *  Rendering pauses when the hero scrolls out of view to keep TBT/INP low. */
export default function HeroScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "never"),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (lost) return null;

  return (
    <div ref={wrapper} className="h-full w-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.8]}
        frameloop={frameloop}
        camera={{ position: [0, 0, 7.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              setLost(true);
            },
            { once: true }
          );
        }}
      >
        <Constellation />
      </Canvas>
    </div>
  );
}
