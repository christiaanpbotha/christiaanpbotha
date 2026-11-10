@AGENTS.md

# LaVee Spa & Beauty — Booking

Public site + online booking for LaVee Spa & Beauty (Shop H, Chameleon Village, Hartbeespoort), with a password-gated staff diary.
Built from the generic booking template (`salomy-aesthetics-booking` / `divine-beauty-booking` / `defzoo-booking`): same code apart from config, services, theme, home page and seed.

## Run
```bash
cp .env.local.example .env.local   # AUTH_PASSWORD (demo + prod: admin) + AUTH_SECRET
npm install
npm run dev    # → http://localhost:3095
npm run seed   # (dev server running) fills the diary with demo bookings
```

## Divergence from the template
- `proxy.ts` gates **only** `/admin` + `/api/admin/*`; everything else is public.
- **Therapist weighting**: `Service.people` (couples specials = 2). `busyOn` looks up each booking's service, `freeSlots(date, minutes, busy, people)` sums people against `CAPACITY` (2). Worth back-porting to the template.
- `priceLabel` shows **"Price on request"** for `price: 0` (only the R899 specials have known prices). `Service.per` = text after price ("for 2").
- **Route group** `app/(app)/` (book, booking, login, admin) gets the centred container; the home page is full-bleed.
- Look: "clean hotel room" — white linen, warm oak, walnut accent, Cormorant Garamond + Jost, 12px radius, CSS wood-floor strip, monogram logo. Theme tokens in `app/globals.css`; chrome + home styles in `app/lavee.css` (home rules scoped under `.home`).
- Group (5+) and mobile spa (6+) are **WhatsApp quote links**, not bookable services.
- Images in `public/images/` are cropped from the owner's WhatsApp posters (screenshots). Swap for originals when possible.

## Config — edit these, not the components
- `lib/config.ts` — BUSINESS, COPY, HOURS (Mon–Sat 09–17, Sun 09–16, from WhatsApp Business), SLOT_MINUTES 30, CAPACITY 2, MIN_NOTICE 2h, EXTRA_FIELDS (add-on, pressure, health notes).
- `lib/services.ts` — CATEGORIES + SERVICES.
- `scripts/seed.mjs` — DEMO bookings.
- Real: name, number/WhatsApp 078 797 2238, email, address, hours, the two R899 specials, treatment list, group/mobile offers. **Placeholders**: single-treatment prices, all durations, CAPACITY, policies.

## DB
libSQL. Local `data/booking.db`; prod Turso `lavee-spa` (group us-east, `libsql://lavee-spa-christiaanpbotha.aws-us-east-1.turso.io`). Same `bookings` schema as the template, refs `LV-XXXXX`.

## Deploy
Vercel project `lavee-spa-booking` (team christiaanpbotha), env: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `AUTH_PASSWORD`, `AUTH_SECRET`.
Currently the code lives in `christiaanpbotha/christiaanpbotha` under `lavee-spa/` (Vercel root directory). Move to its own private repo `lavee-spa-booking` and reconnect the Vercel project when convenient.

## New client site — fast path (what this one took)
1. Copy the newest booking repo (no `.git`, `node_modules`, client photos); rename package + dev port.
2. Edit `lib/config.ts`, `lib/services.ts`, theme tokens in `app/globals.css`, `app/page.tsx`, `app/layout.tsx`, `scripts/seed.mjs`, this file. Don't touch components unless the client needs something new.
3. `npm ci && npm run build`, `npm start`, `npm run seed`, click through `/book` and `/admin`.
4. Turso (connector): `POST /v1/organizations/christiaanpbotha/databases {name, group: "us-east"}`, then `POST …/databases/<name>/auth/tokens?authorization=full-access`.
5. Vercel (MCP): `create_project` (framework nextjs, gitRepository, rootDirectory if needed, env vars), then `create_deployment` with `gitSource` + `target: production`.
6. Check the live URL: home, a booking, `/admin` login.

## Keyboard shortcuts
| Where | Key | Action |
|---|---|---|
| `/book` | `Esc` | Prompt to discard booking |
| `/admin` | `←`/`j` · `→`/`k` | Previous / next day |
| `/admin` | `t` | Today |
| `/admin` | `b` / `w` | Previous / next week |
| `/admin` | `Esc` | Cancel pending delete |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
