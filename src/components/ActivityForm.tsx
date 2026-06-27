import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Activity } from '../types'
import { hhmmToMinutes, minutesToLabel } from '../utils/time'
import './ActivityForm.css'

interface Props {
  initial?: Activity
  onSubmit: (data: Omit<Activity, 'id'>) => void
  onCancel: () => void
}

const SWATCHES = [
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#84cc16',
]

export default function ActivityForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [time, setTime] = useState(
    minutesToLabel(initial?.startMinute ?? 8 * 60),
  )
  const [description, setDescription] = useState(initial?.description ?? '')
  const [color, setColor] = useState(initial?.color ?? SWATCHES[0])
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Please enter a title.')
      return
    }
    const startMinute = hhmmToMinutes(time)
    if (startMinute === null) {
      setError('Please enter a valid time (HH:MM).')
      return
    }
    onSubmit({
      title: trimmed,
      startMinute,
      description: description.trim() || undefined,
      color,
    })
  }

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-field time-field">
          <span>Time</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
        <label className="form-field title-field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            placeholder="e.g. Morning run"
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            autoFocus
          />
        </label>
      </div>

      <label className="form-field">
        <span>Description (optional)</span>
        <textarea
          value={description}
          placeholder="Add a note…"
          rows={2}
          maxLength={200}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="form-field">
        <span>Color tag</span>
        <div className="swatches">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              className={`swatch${c === color ? ' selected' : ''}`}
              style={{ background: c }}
              aria-label={`Select color ${c}`}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn primary">
          {initial ? 'Save' : 'Add'}
        </button>
      </div>
    </form>
  )
}
