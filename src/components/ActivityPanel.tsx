import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Activity } from '../types'
import { minutesToLabel } from '../utils/time'
import { activeActivityId } from '../hooks/useActivities'
import ActivityForm from './ActivityForm'
import './ActivityPanel.css'

interface Props {
  activities: Activity[]
  nowMinute: number
  onAdd: (data: Omit<Activity, 'id'>) => void
  onUpdate: (id: string, data: Omit<Activity, 'id'>) => void
  onDelete: (id: string) => void
}

export default function ActivityPanel({
  activities,
  nowMinute,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [mode, setMode] = useState<'list' | 'add' | { editId: string }>('list')
  const activeId = activeActivityId(activities, nowMinute)

  const editing =
    typeof mode === 'object'
      ? activities.find((a) => a.id === mode.editId)
      : undefined

  function close() {
    setMode('list')
  }

  return (
    <div className="activity-panel">
      <header className="panel-header">
        <h2>Today&rsquo;s Schedule</h2>
        {mode === 'list' && (
          <button
            className="add-btn"
            onClick={() => setMode('add')}
            aria-label="Add activity"
          >
            + Add
          </button>
        )}
      </header>

      {mode === 'add' && (
        <ActivityForm
          onSubmit={(data) => {
            onAdd(data)
            close()
          }}
          onCancel={close}
        />
      )}

      {editing && (
        <ActivityForm
          initial={editing}
          onSubmit={(data) => {
            onUpdate(editing.id, data)
            close()
          }}
          onCancel={close}
        />
      )}

      {mode === 'list' && (
        <ul className="activity-list">
          {activities.length === 0 && (
            <li className="empty">No activities yet. Add your first one!</li>
          )}
          {activities.map((a) => {
            const active = a.id === activeId
            return (
              <li
                key={a.id}
                className={`activity-item${active ? ' active' : ''}`}
                style={{ '--tag': a.color } as CSSProperties}
              >
                <span className="activity-time">
                  {minutesToLabel(a.startMinute)}
                </span>
                <span className="activity-dot" />
                <div className="activity-body">
                  <span className="activity-title">{a.title}</span>
                  {a.description && (
                    <span className="activity-desc">{a.description}</span>
                  )}
                </div>
                {active && <span className="now-badge">Now</span>}
                <div className="activity-actions">
                  <button
                    aria-label={`Edit ${a.title}`}
                    onClick={() => setMode({ editId: a.id })}
                  >
                    ✎
                  </button>
                  <button
                    aria-label={`Delete ${a.title}`}
                    onClick={() => onDelete(a.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
