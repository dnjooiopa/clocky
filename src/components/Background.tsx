import { useMemo } from 'react'
import './Background.css'

/** Deterministic pseudo-random so layout is stable between renders. */
function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** Subtle, slow-drifting dust motes for gentle ambiance on the dark theme. */
function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: seeded(i + 5) * 100,
        delay: -seeded(i + 15) * 26,
        dur: 18 + seeded(i + 25) * 20,
        size: 1.5 + seeded(i + 35) * 3,
      })),
    [],
  )
  return (
    <div className="layer particles" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${d.left}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function Background() {
  return (
    <div className="background" aria-hidden="true">
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <Particles />
    </div>
  )
}
