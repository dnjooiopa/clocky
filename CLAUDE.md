# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (HMR) at http://localhost:5173
- `npm run build` — type-check (`tsc -b`) then production build; run this to verify changes compile
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve the production build

There is no test runner configured in this project.

### Verifying UI changes

The app is purely visual/time-driven, so verify with a headless screenshot rather than tests:

```bash
(npm run dev > /tmp/dev.log 2>&1 &) && sleep 3
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1440,900 \
  --screenshot=/tmp/shot.png --virtual-time-budget=3500 "http://localhost:5173/"
pkill -f vite
```

To screenshot a state behind interaction (e.g. the schedule modal, or the
hidden-percentage variant), temporarily flip the relevant `useState` initial
value in `App.tsx`, screenshot, then revert.

## Architecture

Single-page React 19 + TypeScript + Vite app — a full-screen daily time-awareness
dashboard. No router, no backend; all state lives in the browser and persists to
LocalStorage. The **React Compiler is enabled** (`babel-plugin-react-compiler`
via `vite.config.ts`), so avoid manual `useMemo`/`useCallback` micro-optimizations
unless there's a measured reason.

### Data flow

`App.tsx` is the single composition point and owns all state:
- `useNow(1000)` (`src/hooks/useNow.ts`) ticks a `Date` every second; this is the
  clock heartbeat that re-renders everything time-dependent.
- `useActivities()` (`src/hooks/useActivities.ts`) is the source of truth for
  activities — returns a **time-sorted** list plus add/update/delete, and
  syncs to LocalStorage (`clocky.activities.v1`, seeded with defaults on first
  run). The exported `activeActivityId(sorted, nowMinute)` decides which
  activity is "current": the most recent one started at/before now, wrapping to
  the last activity overnight.
- The show/hide-percentage preference is its own LocalStorage value
  (`clocky.showPercent.v1`) held in `App.tsx`.

Components are presentational and receive `now`/`period`/activities + callbacks
as props; they do not read storage or the clock themselves.

### Time model — read `src/utils/time.ts` first

All time semantics are centralized here. Two distinct angular mappings exist and
must not be confused:

1. **Day-progress ring** (`dayProgress`) is a 0–1 fraction of the **24-hour**
   day. The ring's visual start is `progressStartAngle` on `Clock` (degrees
   clockwise from 3 o'clock; default `-90` = top), set from
   `PROGRESS_START_ANGLE` in `App.tsx`.
2. **Activity markers on the clock** use a **12-hour analog** position:
   `((startMinute / 60) % 12) * 30°` from the top, matching the hour ticks.
   This is intentional and a deliberate product decision — morning/evening times
   (e.g. 06:00 and 18:00) overlap on the same spot. Do not "fix" this to align
   with the progress ring.

`periodForDate` maps the hour to a `Period` (`dawn`/`morning`/`afternoon`/
`evening`/`night`); `night` wraps across midnight. The period currently drives
only text (greeting, label) — the background is a static dark theme and ignores
it.

### Component responsibilities

- `Clock.tsx` — SVG dial: day-progress ring, hour ticks, activity markers, and a
  clickable center button that toggles the percentage. Geometry uses
  `x = 100 + R·sin(θ)`, `y = 100 - R·cos(θ)` with θ=0 at top, clockwise.
- `Background.tsx` — static dark gradient with ambient glows and floating
  particles (deterministic `seeded()` layout so it's stable across renders).
- `ActivityPanel.tsx` + `ActivityForm.tsx` — schedule list and add/edit form;
  rendered inside `Modal.tsx`, not as a standalone panel. `Modal.tsx` is a
  generic overlay (backdrop-click + Escape to close).
- Activity start times are stored as **minutes from midnight** (`startMinute`),
  not strings; convert at the UI edge with `minutesToLabel` / `hhmmToMinutes`.

### Styling

Plain CSS files imported per-component (no CSS framework/modules). Design tokens
and the reusable `.glass` (glassmorphism) utility live in `src/index.css`.
`prefers-reduced-motion` is honored globally there.

### TypeScript constraints

`verbatimModuleSyntax` is on — type-only imports **must** use `import type { … }`
(e.g. `import type { CSSProperties, FormEvent } from 'react'`); the `React.*`
namespace is not available without importing it. `noUnusedLocals`/
`noUnusedParameters` are enforced, so unused props/vars fail the build.
