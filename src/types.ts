export type Period = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night'

/** Which face the clock is showing. */
export type ClockMode = 'activity' | 'pomodoro'

/** A pomodoro timer is either in a focus session or a break. */
export type PomodoroPhase = 'focus' | 'break'

export interface Activity {
  id: string
  /** Minutes from midnight, 0–1439 */
  startMinute: number
  title: string
  description?: string
  color: string
}
