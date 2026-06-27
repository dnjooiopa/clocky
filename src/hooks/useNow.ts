import { useEffect, useState } from 'react'

/**
 * Returns a Date that updates on the given interval (ms). Defaults to once per
 * second so the analog second hand moves smoothly.
 */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
