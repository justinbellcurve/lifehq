# LifeHQ: project guide for Claude Code

@AGENTS.md

## What this is
LifeHQ is Justin's personal home base: a widget-based dashboard he leaves open all day on his Mac
(installed from Chrome as its own window) and checks on his phone. Built gradually, one module at a time.
Planning, roadmap and decisions happen in his LifeHQ chat in the Claude app; this repo is where they get built.

## Stack (decided Nov 2026)
- Next.js 16 (App Router, `cacheComponents` on) + React 19 + TypeScript, Tailwind CSS 4
- Installable PWA: `src/app/manifest.ts`, icons in `public/`
- Next: Supabase (sign-in for Justin only, Postgres, realtime sync), deploy on Vercel
- Later: scheduled server jobs + web push for notifications; Expo/React Native only if widgets
  or Live Activities become worth it. Keep logic out of UI components so that port stays easy.
- Machine: Intel Mac, Node via the official installer (no Homebrew). IDE: IntelliJ IDEA.

## How the code is organized
- `src/widgets/` holds one client component per module. `registry.ts` is the home screen: order, width
  (`full | wide | half | third` on a 12-column grid) and `onPhone` (shown in the one-column phone view).
- Adding a module = new component in `src/widgets/` + one entry in `registry.ts`. Nothing else.
- `src/components/Dashboard.tsx` renders the desktop "wall" grid and phone "glance" layout.
- `src/lib/store.ts`: `useStored(key)` is the only way widgets persist data. It uses localStorage today;
  the Supabase migration replaces its internals and widgets should not need to change.
- `src/lib/useNow.ts`: the clock. Never call `new Date()`/`Date.now()` during render or in server
  components (Cache Components fails the prerender); use `useNow()` or call it inside event handlers/effects.
- `src/config.ts`: non-private settings only (name, home city coordinates).
- Theme: colour tokens in `src/app/globals.css` (`bg surface sunk ink muted line accent sun good warn`),
  with light and dark palettes. Reuse `.card .label .field .btn .btn-primary .btn-ghost`.

## Rules
- The repo is PUBLIC (recruiters may read it). Never commit secrets or personal data:
  - keys go in `.env.local` (gitignored); the Supabase anon key is fine client-side, the service role key never is
  - check-ins, trips, weigh-ins, schedules etc. live in storage/Supabase, never hardcoded or seeded in code
- Before finishing a change, run `npm run lint` and `npx tsc --noEmit`, and check it in `npm run dev`.
- Small, focused commits with clear messages. Ask before pushing.
- Justin titles himself "engineer". He knows React/Next.js well (led a full site migration); skip basics.
- He often dictates, so expect transcription typos in requests; ask when something is unclear.

## Roadmap
1. [x] Widget shell, check-in, trip countdown, live weather (Open-Meteo, no key)
2. [ ] Supabase: sign-in, tables for check-ins / weigh-ins / trips, swap `store.ts` to Supabase with realtime
3. [ ] Deploy to Vercel; install on phone
4. [ ] Sports calendar: Maple Leafs, Raptors, Blue Jays, Bills, Tiger-Cats (find data sources; NHL/MLB have
       public schedule data, others likely need a third-party API)
5. [ ] Push notifications (game starts, check-in reminder, trip/flight reminders)
6. [ ] Later: daily news, subscriptions tracker, calendar, music, trip photo gallery, realtor.ca listings
Known platform limits: no unified iMessage feed on iPhone; Spotify web playback needs Premium;
no official YouTube Music playback API.
