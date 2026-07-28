/** Animated orbital ring that encircles ELLIE.
 *
 *  Rendered as two layers so the ring reads as three-dimensional:
 *
 *    <HeroOrbit />                  behind her            (z-0)
 *    <Image ELLIE />                the character         (auto)
 *    <HeroOrbit variant="front" />  lower arc only        (z-20)
 *    <HeroCards />                  the stat cards        (z-30)
 *
 *  The front layer is clipped to the bottom of the circle, so the ring passes
 *  *behind* her head and shoulders but *in front* of her legs. Combined with
 *  the geometry below — the circle is centred on her torso and deliberately
 *  small — her outstretched hand and the yoga mat cross outside the ring,
 *  which is what makes them read as breaking out of it.
 *
 *  Pure CSS/SVG: no WebGL, no JavaScript, no measurable cost. Rotation stops
 *  automatically under prefers-reduced-motion (see globals.css).
 */

// Geometry in viewBox units. Centred on her torso, not on the frame, so the
// left edge of the ring falls *inside* her extended arm.
const CX = 220;
const CY = 190;
const R_OUTER = 132; // dashed ring + orbiting nodes
const R_TICKS = 118; // tick ring
const R_DISC = 114; // soft light pool
const TICKS = Array.from({ length: 44 }, (_, i) => i);

function Rings() {
  return (
    <svg viewBox="0 0 400 400" className="size-full overflow-visible" aria-hidden="true">
      {/* soft disc so she sits in a pool of light */}
      <circle cx={CX} cy={CY} r={R_DISC} fill="url(#orbitDisc)" />

      {/* outer dashed ring — slow clockwise */}
      <g className="animate-spin-slow" style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <circle
          cx={CX} cy={CY} r={R_OUTER}
          fill="none" stroke="#eef8e6" strokeOpacity="0.7"
          strokeWidth="1.7" strokeDasharray="3 12" strokeLinecap="round"
        />
      </g>

      {/* tick ring — counter-rotating, so the motion is legible */}
      <g className="animate-orbit-reverse" style={{ transformOrigin: `${CX}px ${CY}px` }}>
        <circle cx={CX} cy={CY} r={R_TICKS} fill="none" stroke="#fbf9f1" strokeOpacity="0.34" strokeWidth="1" />
        {TICKS.map((i) => {
          const a = (i / TICKS.length) * Math.PI * 2;
          const long = i % 4 === 0;
          const r1 = long ? R_TICKS - 9 : R_TICKS - 5;
          return (
            <line
              key={i}
              x1={CX + Math.cos(a) * r1} y1={CY + Math.sin(a) * r1}
              x2={CX + Math.cos(a) * R_TICKS} y2={CY + Math.sin(a) * R_TICKS}
              stroke="#eef8e6" strokeOpacity={long ? 0.64 : 0.36} strokeWidth={long ? 1.6 : 1}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* orbiting nodes riding the outer ring */}
      <g className="animate-spin-slower" style={{ transformOrigin: `${CX}px ${CY}px` }}>
        {[0, 120, 240].map((deg) => {
          const a = (deg * Math.PI) / 180;
          const x = CX + Math.cos(a) * R_OUTER;
          const y = CY + Math.sin(a) * R_OUTER;
          return (
            <g key={deg}>
              <circle cx={x} cy={y} r="8" fill="#eef8e6" fillOpacity="0.16" />
              <circle cx={x} cy={y} r="3.2" fill="#fbf9f1" fillOpacity="0.9" />
            </g>
          );
        })}
      </g>

      <defs>
        <radialGradient id="orbitDisc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eef8e6" stopOpacity="0.17" />
          <stop offset="60%" stopColor="#eef8e6" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#eef8e6" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function HeroOrbit({ variant = "back" }: { variant?: "back" | "front" }) {
  const front = variant === "front";
  return (
    <div
      aria-hidden="true"
      className={
        front
          ? // only the arc below her hand is drawn in front, so the ring wraps
            // her body while the hand and mat stay outside and on top
            "pointer-events-none absolute inset-0 z-20 [clip-path:inset(60%_0_0_0)]"
          : "pointer-events-none absolute inset-0 z-0"
      }
    >
      <Rings />
    </div>
  );
}
