import './PomodoroControls.css'

interface Props {
  running: boolean
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
}

export default function PomodoroControls({
  running,
  onToggle,
  onReset,
  onSkip,
}: Props) {
  return (
    <div className="pomo-controls">
      <button className="pomo-btn glass" onClick={onReset}>
        Reset
      </button>
      <button
        className="pomo-btn pomo-btn-primary glass"
        onClick={onToggle}
        aria-pressed={running}
      >
        {running ? 'Pause' : 'Start'}
      </button>
      <button className="pomo-btn glass" onClick={onSkip}>
        Skip
      </button>
    </div>
  )
}
