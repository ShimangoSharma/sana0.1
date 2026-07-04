# SANA — Symptom Journal

A calm, private symptom journal for patients and their caregivers. Log how you feel in about 30 seconds, see patterns over time, and turn everything into a one-page brief for your doctor's next visit.

Built as an installable **PWA** (React + Vite): works offline, keeps all data on-device (localStorage), no account or backend required.

## Features

- **3-step onboarding** — name, sex & age range, ongoing treatments (with add-your-own)
- **Log entries** — multi-select symptoms (grid + searchable library + custom), severity, "since when" (presets or exact date), real photo attachments, notes
- **Calendar** — month view with per-symptom entry dots; add, view, edit, or delete entries for any day
- **Insights** — entries-over-time chart and per-symptom trends for preset or custom date ranges
- **Visits** — appointments with doctor type-ahead, date + wheel-style time picker, countdowns, reminders
- **Create summary** — auto-generated doctor brief (patient context, top symptoms, "worth asking about") with **PDF download** and **Share**
- **Local notifications** — appointment reminders and a daily check-in nudge (best-effort, on-device)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build        # production build to dist/
npm run preview      # serve the production build locally
```

For sub-path hosting (e.g. GitHub Pages project sites), set `BASE_PATH`:

```bash
BASE_PATH=/SANA/ npm run build
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to **GitHub Pages** automatically. One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

Once live, open the URL on a phone:

- **Android (Chrome):** menu ⋮ → **Add to Home screen** → **Install**
- **iPhone (Safari):** Share → **Add to Home Screen**

It then launches full-screen like a native app and works offline. Each device keeps its own private data.

## Design

Implemented from a Claude Design prototype: teal `#117468` + cream `#f3efe4`, Newsreader (serif display) + Hanken Grotesk (body), rounded cards, pill buttons.
