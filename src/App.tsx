import { useEffect, useState } from 'react'
import { useNow } from './hooks/useNow'
import { useActivities, activeActivityId } from './hooks/useActivities'
import { usePomodoro } from './hooks/usePomodoro'
import { periodForDate, minutesToLabel } from './utils/time'
import type { ClockMode } from './types'
import Background from './components/Background'
import Clock from './components/Clock'
import InfoPanel from './components/InfoPanel'
import ActivityPanel from './components/ActivityPanel'
import PomodoroControls from './components/PomodoroControls'
import Modal from './components/Modal'
import './App.css'

/** Where the day-progress ring begins (degrees clockwise from 3 o'clock; -90 = top). */
const PROGRESS_START_ANGLE = -90

const MODE_KEY = 'clocky.mode.v1'

function App() {
  const now = useNow(1000)
  const period = periodForDate(now)
  const nowMinute = now.getHours() * 60 + now.getMinutes()
  const { activities, addActivity, updateActivity, deleteActivity } =
    useActivities()
  const pomodoro = usePomodoro()

  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [mode, setMode] = useState<ClockMode>(() =>
    localStorage.getItem(MODE_KEY) === 'pomodoro' ? 'pomodoro' : 'activity',
  )

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode)
  }, [mode])

  const activeId = activeActivityId(activities, nowMinute)
  const current = activities.find((a) => a.id === activeId)

  return (
    <>
      <Background mode={mode} />

      <main className="app">
        <section className="hero">
          <Clock
            now={now}
            period={period}
            mode={mode}
            onToggleMode={() =>
              setMode((m) => (m === 'activity' ? 'pomodoro' : 'activity'))
            }
            progressStartAngle={PROGRESS_START_ANGLE}
            activities={activities}
            activeId={activeId}
            onActivityClick={() => setScheduleOpen(true)}
            pomodoro={pomodoro}
          />
          <InfoPanel now={now} />

          {mode === 'activity' ? (
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
          ) : (
            <PomodoroControls
              running={pomodoro.running}
              onToggle={pomodoro.toggle}
              onReset={pomodoro.reset}
              onSkip={pomodoro.skip}
            />
          )}
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
