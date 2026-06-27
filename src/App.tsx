import { useEffect, useState } from 'react'
import { useNow } from './hooks/useNow'
import { useActivities, activeActivityId } from './hooks/useActivities'
import { periodForDate, minutesToLabel } from './utils/time'
import Background from './components/Background'
import Clock from './components/Clock'
import InfoPanel from './components/InfoPanel'
import ActivityPanel from './components/ActivityPanel'
import Modal from './components/Modal'
import './App.css'

/** Where the day-progress ring begins (degrees clockwise from 3 o'clock; -90 = top). */
const PROGRESS_START_ANGLE = -90

const SHOW_PERCENT_KEY = 'clocky.showPercent.v1'

function App() {
  const now = useNow(1000)
  const period = periodForDate(now)
  const nowMinute = now.getHours() * 60 + now.getMinutes()
  const { activities, addActivity, updateActivity, deleteActivity } =
    useActivities()

  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [showPercent, setShowPercent] = useState(
    () => localStorage.getItem(SHOW_PERCENT_KEY) !== 'false',
  )

  useEffect(() => {
    localStorage.setItem(SHOW_PERCENT_KEY, String(showPercent))
  }, [showPercent])

  const activeId = activeActivityId(activities, nowMinute)
  const current = activities.find((a) => a.id === activeId)

  return (
    <>
      <Background />

      <main className="app">
        <section className="hero">
          <Clock
            now={now}
            period={period}
            progressStartAngle={PROGRESS_START_ANGLE}
            showPercent={showPercent}
            onTogglePercent={() => setShowPercent((v) => !v)}
            activities={activities}
            activeId={activeId}
            onActivityClick={() => setScheduleOpen(true)}
          />
          <InfoPanel now={now} period={period} />

          <button
            className="schedule-btn glass"
            onClick={() => setScheduleOpen(true)}
          >
            {current ? (
              <>
                <span
                  className="schedule-btn-dot"
                  style={{ background: current.color }}
                />
                <span className="schedule-btn-now">Now</span>
                <span className="schedule-btn-title">{current.title}</span>
                <span className="schedule-btn-time">
                  {minutesToLabel(current.startMinute)}
                </span>
              </>
            ) : (
              <span className="schedule-btn-title">View schedule</span>
            )}
            <span className="schedule-btn-caret" aria-hidden="true">
              ⌃
            </span>
          </button>
        </section>
      </main>

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        label="Today's schedule"
      >
        <ActivityPanel
          activities={activities}
          nowMinute={nowMinute}
          onAdd={addActivity}
          onUpdate={updateActivity}
          onDelete={deleteActivity}
        />
      </Modal>
    </>
  )
}

export default App
