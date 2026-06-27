import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Activity } from '../types'

const STORAGE_KEY = 'clocky.activities.v1'

const DEFAULT_ACTIVITIES: Activity[] = [
  { id: 'a1', startMinute: 6 * 60, title: 'Wake up', color: '#f59e0b' },
  { id: 'a2', startMinute: 8 * 60, title: 'Work', color: '#3b82f6' },
  { id: 'a3', startMinute: 12 * 60, title: 'Lunch', color: '#10b981' },
  { id: 'a4', startMinute: 18 * 60, title: 'Exercise', color: '#ef4444' },
  { id: 'a5', startMinute: 22 * 60, title: 'Sleep', color: '#8b5cf6' },
]

function load(): Activity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_ACTIVITIES
    const parsed = JSON.parse(raw) as Activity[]
    if (!Array.isArray(parsed)) return DEFAULT_ACTIVITIES
    return parsed
  } catch {
    return DEFAULT_ACTIVITIES
  }
}

function newId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  )
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [activities])

  const sorted = useMemo(
    () => [...activities].sort((a, b) => a.startMinute - b.startMinute),
    [activities],
  )

  const addActivity = useCallback((data: Omit<Activity, 'id'>) => {
    setActivities((prev) => [...prev, { ...data, id: newId() }])
  }, [])

  const updateActivity = useCallback((id: string, data: Omit<Activity, 'id'>) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...data, id } : a)),
    )
  }, [])

  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return { activities: sorted, addActivity, updateActivity, deleteActivity }
}

/**
 * The active activity is the most recent one whose start time is at or before
 * `nowMinute`. If the current time is before the first activity, the schedule
 * wraps so the last activity of the day is active.
 */
export function activeActivityId(
  sorted: Activity[],
  nowMinute: number,
): string | null {
  if (sorted.length === 0) return null
  let active: Activity | null = null
  for (const a of sorted) {
    if (a.startMinute <= nowMinute) active = a
    else break
  }
  // Before the first activity → wrap to the last one (overnight activity).
  return (active ?? sorted[sorted.length - 1]).id
}
