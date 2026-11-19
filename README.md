# LifeHQ

A personal home base for daily life: a widget-based dashboard for check-ins, fitness, travel planning, sports schedules, weather and more. Built to stay open on desktop and live on your phone.

> Early proof of concept, built gradually.

## Stack

- **Next.js 16 + React 19**, installable as a PWA (phone home screen and its own desktop window)
- **Tailwind CSS 4**
- **Supabase** for sign-in, data and realtime sync (next step; data is saved in the browser for now)
- Scheduled server jobs + web push for notifications (planned)

## How it's organized

```
src/
  widgets/            one component per module
    registry.ts       the home screen: which widgets, in what order, how wide
  components/
    Dashboard.tsx     desktop "wall" grid and phone "glance" layout
  lib/
    store.ts          storage behind every widget (localStorage now, Supabase next)
    useNow.ts         the clock, kept out of server prerendering
  config.ts           non-private settings (name, home city)
```

Adding a module = a new component in `src/widgets/` plus one line in `registry.ts`.
Private data (check-ins, trips, weigh-ins) is never committed; it lives in storage.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. In Chrome, use **Install LifeHQ** (address bar or the ⋮ menu) to open it in its own window.

## Roadmap

- [x] Widget shell, check-in, trip countdown, live weather
- [ ] Supabase sign-in and sync
- [ ] Deploy (Vercel) and install on phone
- [ ] Sports calendar: Leafs, Raptors, Blue Jays, Bills, Tiger-Cats
- [ ] Push notifications
- [ ] Daily news, subscriptions, calendar, music
