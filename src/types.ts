export type Period = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night'

export interface Activity {
  id: string
  /** Minutes from midnight, 0–1439 */
  startMinute: number
  title: string
  description?: string
  color: string
}
