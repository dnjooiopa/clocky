import { useEffect, useState } from 'react'
import type { PomodoroPhase } from '../types'

export const FOCUS_SECONDS = 25 * 60
export const BREAK_SECONDS = 5 * 60

/** How long a given phase lasts, in seconds. */
export function phaseDuration(phase: PomodoroPhase): number {
  return phase === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS
}

export interface PomodoroState {
  phase: PomodoroPhase
  running: boolean
  /** Seconds left in the current phase. */
  remaining: number
  /** Total seconds in the current phase (for the progress ring). */
  total: number
  /** Completed focus sessions so far. */
  focusCount: number
  /** Start / pause the countdown. */
  toggle: () => void
  /** Stop and refill the current phase. */
  reset: () => void
  /** Jump to the next phase (focus ⇄ break), paused. */
  skip: () => void
}

/**
 * A classic 25/5 pomodoro timer. The countdown keeps running independently of
 * which clock face is shown, and auto-advances focus → break → focus.
 *
 * Time is tracked against an absolute `deadline` so it stays accurate even if
 * the interval drifts or the tab is throttled; the visible `remaining` is
 * derived from it each tick.
 */
export function usePomodoro(): PomodoroState {
  const [phase, setPhase] = useState<PomodoroPhase>('focus')
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(FOCUS_SECONDS)
  const [focusCount, setFocusCount] = useState(0)
  /** Epoch ms when the current phase ends; only meaningful while running. */
  const [deadline, setDeadline] = useState<number | null>(null)

  useEffect(() => {
    if (!running || deadline == null) return
    const tick = () => {
      const left = Math.ceil((deadline - Date.now()) / 1000)
      if (left > 0) {
        setRemaining(left)
        return
      }
      // Phase complete → auto-advance to the next phase and keep running.
      const next: PomodoroPhase = phase === 'focus' ? 'break' : 'focus'
      if (phase === 'focus') setFocusCount((c) => c + 1)
      const dur = phaseDuration(next)
      setPhase(next)
      setRemaining(dur)
      setDeadline(Date.now() + dur * 1000)
    }
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [running, deadline, phase])

  return {
    phase,
    running,
    remaining,
    total: phaseDuration(phase),
    focusCount,
    toggle: () => {
      if (running) {
        setRunning(false)
        setDeadline(null)
      } else {
        setDeadline(Date.now() + remaining * 1000)
        setRunning(true)
      }
    },
    reset: () => {
      setRunning(false)
      setDeadline(null)
      setRemaining(phaseDuration(phase))
    },
    skip: () => {
      setRunning(false)
      setDeadline(null)
      const next: PomodoroPhase = phase === 'focus' ? 'break' : 'focus'
      setPhase(next)
      setRemaining(phaseDuration(next))
    },
  }
}
