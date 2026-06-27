import { dayProgress, minutesToLabel } from '../utils/time'
import type { PeriodInfo } from '../utils/time'
import type { Activity } from '../types'
import './Clock.css'

interface Props {
  now: Date
  period: PeriodInfo
  /**
   * Angle (in degrees) where the day-progress ring begins, measured clockwise
   * from the 3 o'clock position. Defaults to -90 (the top / 12 o'clock).
   */
  progressStartAngle?: number
  /** Whether the day-progress percentage is shown in the center. */
  showPercent?: boolean
  /** Toggles the percentage visibility when the center is clicked. */
  onTogglePercent?: () => void
  /** Activities to plot as markers around the ring at their time of day. */
  activities?: Activity[]
  /** Id of the currently active activity (rendered emphasized). */
  activeId?: string | null
  /** Called when an activity marker is clicked. */
  onActivityClick?: (id: string) => void
}

const R = 92
const CIRC = 2 * Math.PI * R

export default function Clock({
  now,
  period,
  progressStartAngle = -90,
  showPercent = true,
  onTogglePercent,
  activities = [],
  activeId,
  onActivityClick,
}: Props) {
  const progress = dayProgress(now)
  const dashoffset = CIRC * (1 - progress)

  const ticks = Array.from({ length: 12 }, (_, i) => i)

  // Markers sit at their 12-hour analog clock position (12 at the top), the
  // same convention as the hour ticks. Each hour spans 30°. Morning and evening
  // times therefore share a position (e.g. 06:00 and 18:00).
  const markerPos = (startMinute: number) => {
    const deg = ((startMinute / 60) % 12) * 30
    const rad = (deg * Math.PI) / 180
    return { x: 100 + R * Math.sin(rad), y: 100 - R * Math.cos(rad) }
  }

  return (
    <div className="clock">
      <svg viewBox="0 0 200 200" className="clock-svg">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
          </linearGradient>
        </defs>

        {/* Track + progress ring */}
        <circle
          cx="100"
          cy="100"
          r={R}
          className="ring-track"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r={R}
          className="ring-progress"
          fill="none"
          stroke="url(#ringGrad)"
          strokeDasharray={CIRC}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          transform={`rotate(${progressStartAngle} 100 100)`}
        />

        {/* Hour markers */}
        {ticks.map((i) => {
          const angle = (i * 30 * Math.PI) / 180
          const isMajor = i % 3 === 0
          const r1 = isMajor ? 72 : 76
          const r2 = 82
          const x1 = 100 + r1 * Math.sin(angle)
          const y1 = 100 - r1 * Math.cos(angle)
          const x2 = 100 + r2 * Math.sin(angle)
          const y2 = 100 - r2 * Math.cos(angle)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className={isMajor ? 'tick tick-major' : 'tick'}
            />
          )
        })}

        {/* Activity markers, placed around the ring at their time of day */}
        {activities.map((a) => {
          const { x, y } = markerPos(a.startMinute)
          const active = a.id === activeId
          return (
            <g
              key={a.id}
              className={`activity-marker${active ? ' active' : ''}${
                onActivityClick ? ' clickable' : ''
              }`}
              onClick={
                onActivityClick ? () => onActivityClick(a.id) : undefined
              }
            >
              <title>{`${minutesToLabel(a.startMinute)} — ${a.title}`}</title>
              {active && (
                <circle cx={x} cy={y} r={7.5} className="marker-halo" />
              )}
              <circle
                cx={x}
                cy={y}
                r={active ? 4.6 : 3.4}
                fill={a.color}
                className="marker-dot"
              />
            </g>
          )
        })}
      </svg>

      {/* Inner readout — click to show/hide the percentage */}
      <button
        type="button"
        className="clock-center"
        onClick={onTogglePercent}
        aria-pressed={showPercent}
        title={showPercent ? 'Hide percentage' : 'Show percentage'}
      >
        <span className="clock-period">{period.label}</span>
        {showPercent && (
          <>
            <span className="clock-progress">
              {Math.round(progress * 100)}%
            </span>
            <span className="clock-progress-label">of 12h</span>
          </>
        )}
      </button>
    </div>
  )
}
