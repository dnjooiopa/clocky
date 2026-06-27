import type { Period } from '../types'

export interface PeriodInfo {
  key: Period
  label: string
  /** start hour (inclusive) */
  start: number
  /** end hour (exclusive) */
  end: number
}

/**
 * Period boundaries by hour of day. Night wraps across midnight and is handled
 * specially in periodForHour.
 */
export const PERIODS: PeriodInfo[] = [
  { key: 'dawn', label: 'Dawn', start: 5, end: 7 },
  { key: 'morning', label: 'Morning', start: 7, end: 12 },
  { key: 'afternoon', label: 'Afternoon', start: 12, end: 17 },
  { key: 'evening', label: 'Evening', start: 17, end: 20 },
  { key: 'night', label: 'Night', start: 20, end: 5 },
]

export function periodForDate(date: Date): PeriodInfo {
  const hour = date.getHours() + date.getMinutes() / 60
  for (const p of PERIODS) {
    if (p.key === 'night') continue
    if (hour >= p.start && hour < p.end) return p
  }
  // Night: 20:00–05:00
  return PERIODS[PERIODS.length - 1]
}

export function greetingForDate(date: Date): string {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

/**
 * Progress through the current 12-hour cycle as a fraction 0–1. The ring
 * completes a full round every 12 hours, matching the 12-hour analog face and
 * the activity markers, so it wraps twice per day.
 */
export function dayProgress(date: Date): number {
  const minutes =
    date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
  return (minutes % 720) / 720
}

export function formatTime(date: Date, withSeconds = false): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** "MM:SS" countdown label from a number of seconds. */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** "06:00" style label from minutes-from-midnight. */
export function minutesToLabel(minute: number): string {
  const h = Math.floor(minute / 60)
  const m = minute % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function hhmmToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (h > 23 || m > 59) return null
  return h * 60 + m
}
