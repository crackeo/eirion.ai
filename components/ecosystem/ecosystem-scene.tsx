"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/** Solar-system model of the ELLIE agent ecosystem: the MCP core is the sun,
 *  specialized agents orbit it as planets on tilted rings.
 *  Performance contract: mounted only when scrolled near the viewport,
 *  rendering pauses when offscreen, DPR capped, reduced-motion freezes orbits.
 */

interface AgentDef {
  label: string;
  kind: "internal" | "external";
  /** starting angle offset in radians */
  offset: number;
}

interface OrbitDef {
  radius: number;
  speed: number;
  /** inclination of the orbital plane, radians */
  tiltX: number;
  tiltZ: number;
  agents: AgentDef[];
}

const ORBITS: OrbitDef[] = [
  {
    radius: 1.9,
    speed: 0.16,
    tiltX: 0.32,
    tiltZ: 0.1,
    agents: [
      { label: "Workflow Agent", kind: "internal", offset: 0 },
      { label: "Health Coach", kind: "external", offset: 2.1 },
      { label: "Analytics Agent", kind: "internal", offset: 4.2 },
    ],
  },
  {
    radius: 2.85,
    speed: -0.11,
    tiltX: 0.5,
    tiltZ: -0.18,
    agents: [
      { label: "RPM Monitor", kind: "external", offset: 0.6 },
      { label: "Compliance Agent", kind: "internal", offset: 2.2 },
      { label: "Genetic Advisor", kind: "external", offset: 3.8 },
      { label: "Assistant Agent", kind: "internal", offset: 5.3 },
    ],
  },
  {
    radius: 3.2,
    speed: 0.08,
    tiltX: 0.24,
    tiltZ: 0.3,
    agents: [{ label: "Care Coordinator", kind: "external", offset: 1.2 }],
  },
];

const COLORS = {
  internal: "#eef8e6",
  internalGlow: "#ffffff",
  external: "#0d3d20",
  externalGlow: "#11562d",
  ring: "#d6f5df",
};

/** Points forming an orbit ring circle in the XZ plane. */
function useRingGeometry(radius: number) {
  return useMemo(() => {
    const points: number[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      points.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    }
    return new Float32Array(points);
  }, [radius]);
}

function Planet({ agent, radius, reduceMotion }: { agent: AgentDef; radius: number; reduceMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const angle = useRef(agent.offset);
  const color = COLORS[agent.kind];
  const glow = agent.kind === "internal" ? COLORS.internalGlow : COLORS.externalGlow;

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Angle advances via the parent orbit's speed stored in userData
    const speed = (ref.current.parent?.userData.speed as number) ?? 0.1;
    if (!reduceMotion) angle.current += delta * speed;
    ref.current.position.set(
      Math.cos(angle.current) * radius,
      0,
      Math.sin(angle.current) * radius
    );
  });

  return (
    <group ref={ref} position={[Math.cos(agent.offset) * radius, 0, Math.sin(agent.offset) * radius]}>
      {/* Planet body */}
      <mesh>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color={color} emissive={glow} emissiveIntensity={0.55} roughness={0.35} />
      </mesh>
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshBasicMaterial color={glow} transparent opacity={0.18} depthWrite={false} />
      </mesh>
      {/* Label chip (DOM, fixed pixel size regardless of depth) */}
      <Html center style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
        <div
          style={{
            transform: "translateY(-26px)",
            whiteSpace: "nowrap",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "11.5px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: "#fbf9f1",
            background: "rgba(18,69,41,0.72)",
            border: `1px solid ${agent.kind === "internal" ? "rgba(125,219,157,0.45)" : "rgba(210,169,43,0.45)"}`,
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 24px -8px rgba(0,0,0,0.6)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              marginRight: 7,
              background: glow,
              boxShadow: `0 0 8px ${glow}`,
            }}
          />
          {agent.label}
        </div>
      </Html>
    </group>
  );
}

function Orbit({ orbit, reduceMotion }: { orbit: OrbitDef; reduceMotion: boolean }) {
  const ringPositions = useRingGeometry(orbit.radius);

  return (
    <group rotation={[orbit.tiltX, 0, orbit.tiltZ]} userData={{ speed: orbit.speed }}>
      {/* Orbit ring */}
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ringPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={COLORS.ring} transparent opacity={0.35} depthWrite={false} />
      </line>
      {orbit.agents.map((agent) => (
        <Planet key={agent.label} agent={agent} radius={orbit.radius} reduceMotion={reduceMotion} />
      ))}
    </group>
  );
}

/** The ELLIE / MCP sun: pulsing golden core with halo and corona light. */
function Sun() {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.05);
    if (halo.current) {
      halo.current.scale.setScalar(1.6 + Math.sin(t * 1.4 + 0.9) * 0.12);
      (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(t * 1.4) * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshBasicMaterial color="#fbf9f1" wireframe transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#d6f5df" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <pointLight color="#ffffff" intensity={14} distance={12} decay={1.6} />
      {/* Core label */}
      <Html center style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
        <div style={{ textAlign: "center", transform: "translateY(46px)", whiteSpace: "nowrap" }}>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "#fbf9f1",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            ELLIE
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            MCP Core
          </p>
        </div>
      </Html>
    </group>
  );
}

/** Faint starfield for depth. */
function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(220 * 3);
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 220; i++) {
      const r = 7 + rand() * 6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr.set(
        [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta) * 0.6, r * Math.cos(phi)],
        i * 3
      );
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#eef8e6" size={0.03} sizeAttenuation transparent opacity={0.6} depthWrite={false} />
    </points>
  );
}

function System({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current && !reduceMotion) group.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={group}>
      <Sun />
      {ORBITS.map((orbit) => (
        <Orbit key={orbit.radius} orbit={orbit} reduceMotion={reduceMotion} />
      ))}
      <Stars />
    </group>
  );
}

export default function EcosystemScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [lost, setLost] = useState(false);
  // Client-only component (dynamic ssr:false), so window is safe at first render
  const [reduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

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
    <div ref={wrapper} className="h-full w-full cursor-grab active:cursor-grabbing" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={frameloop}
        camera={{ position: [0, 2.2, 6.9], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        // overflow visible lets the DOM label chips travel past the canvas
        // edge instead of being clipped mid-orbit (R3F merges this style
        // into its internal container, which defaults to overflow:hidden)
        style={{ background: "transparent", overflow: "visible" }}
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
        <ambientLight intensity={0.35} />
        <System reduceMotion={reduceMotion} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.72}
        />
      </Canvas>
    </div>
  );
}
