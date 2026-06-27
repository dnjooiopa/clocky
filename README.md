# Clocky · Daily Rhythm

A minimal, full-screen daily schedule and time-awareness dashboard inspired by a
clock and nature. Built with **React 19**, **TypeScript**, and **Vite**, with a
glassmorphism UI and animated natural backgrounds that change with the time of
day.

## Features

- **Large analog clock** at the center with hour markers, animated hands, and a
  day-progress ring (0–100%).
- **Period awareness** — Dawn, Morning, Afternoon, Evening, and Night, each with
  its own animated scene (sunrise mountains, green forest, bright sky, sunset,
  starry night).
- **Daily info** — current time, date, time of day, and a contextual greeting.
- **Activities** — add, edit, delete, and color-tag activities with optional
  descriptions. The current activity highlights automatically, and everything is
  saved to **LocalStorage**.
- **Animated background effects** — drifting clouds, falling leaves, floating
  particles, and twinkling stars, with smooth cross-fades between periods.
- **Glassmorphism panels** — frosted glass, soft shadows, blur, and subtle
  borders.
- **Responsive** — works full-screen on desktop and stacks for mobile. Respects
  `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Project structure

```
src/
  components/   Background, Clock, InfoPanel, ActivityPanel, ActivityForm (+ CSS)
  hooks/        useNow (ticking clock), useActivities (LocalStorage CRUD)
  utils/        time helpers (periods, greeting, day progress, formatting)
  types.ts      shared types (Activity, Period)
  App.tsx       layout composition
```

Activity schedule logic: each activity defines a start time; the activity whose
start time is the most recent (at or before "now") is considered active, wrapping
overnight to the last activity of the day.
