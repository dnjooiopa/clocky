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
      <button
        className="pomo-btn glass"
        onClick={onReset}
        aria-label="Reset timer"
        title="Reset"
      >
        <ResetIcon />
        <span className="pomo-label">Reset</span>
      </button>
      <button
        className="pomo-btn pomo-btn-primary glass"
        onClick={onToggle}
        aria-pressed={running}
        aria-label={running ? 'Pause timer' : 'Start timer'}
        title={running ? 'Pause' : 'Start'}
      >
        {running ? <PauseIcon /> : <PlayIcon />}
        <span className="pomo-label">{running ? 'Pause' : 'Start'}</span>
      </button>
      <button
        className="pomo-btn glass"
        onClick={onSkip}
        aria-label="Skip to next phase"
        title="Skip"
      >
        <SkipIcon />
        <span className="pomo-label">Skip</span>
      </button>
    </div>
  )
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="pomo-icon" aria-hidden="true">
      <path
        d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="pomo-icon" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="pomo-icon" aria-hidden="true">
      <rect x="7" y="5" width="3.5" height="14" rx="1.2" fill="currentColor" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1.2" fill="currentColor" />
    </svg>
  )
}

function SkipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="pomo-icon" aria-hidden="true">
      <path d="M6 5.5v13l9-6.5z" fill="currentColor" />
      <rect x="16" y="5" width="2.6" height="14" rx="1.2" fill="currentColor" />
    </svg>
  )
}
