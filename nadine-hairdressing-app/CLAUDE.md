@AGENTS.md

# Nadine Hairdressing — Booking

Public site + online booking for Nadine Hairdressing (hair, nails and beauty, Brackenhurst, Alberton), with a password-gated staff diary.
Built from `clients/divine-beauty/booking` (generic booking template): same code apart from config, services, theme, home page, mobile bar, bridal form and seed.

## Run
```bash
cp .env.local.example .env.local   # AUTH_PASSWORD (local demo: nadine) + AUTH_SECRET
npm install
npm run dev    # → http://localhost:3110
npm run seed   # (dev server running) fills the diary with demo bookings
```
`npm start` runs with `NODE_ENV=production`, so the admin cookie is `Secure` and a plain-http browser won't keep it — use `npm run dev` to test `/admin` locally.

## Divergence from the template
- **Route group** `app/(app)/` (book, booking, login, admin) gets the centred container; the home page is full-bleed.
- **No keyboard shortcuts on public pages**: the template's Esc-discard handler/dialog was removed from `BookingForm.tsx`. `/admin` keeps its shortcuts (staff workflow).
- `priceLabel`: `price: 0` → "Price on request" (from LaVee) for consultation-only services.
- Look: white sign + blush/rose-gold/champagne (from her sign and salon interior), Great Vibes (name only) + Cormorant Garamond + Jost, `--th-radius` 14px, pill buttons. Tokens in `app/globals.css` (`--th-rose`, `--th-blush` added).
- Home: arched hero photo + round wash-basin inset, services menu, **bridal enquiry** (`components/BridalEnquiry.tsx`, composes a WhatsApp message — no backend), gallery, salon + policies, visit. `components/MobileBar.tsx` = floating Call/WhatsApp/Book pill on phones, shown only after the hero buttons scroll out of view.
- Photos in `public/images/` are crops of her Google photos (screenshots, 2–7 years old, ≤720px) — never show them larger than native size. **Swap for originals/new photos.**

## Config — edit these, not the components
- `lib/config.ts` — BUSINESS (incl. landline, Facebook), COPY, HOURS (Tue–Fri 08–17, Sat 08–16 — from her sign), SLOT_MINUTES, CAPACITY, MIN_NOTICE (12h), EXTRA_FIELDS (new/returning client, hair length).
- `lib/services.ts` — CATEGORIES + SERVICES (from her Google Business list). Bridal is NOT a bookable service (enquiry form instead).
- `scripts/seed.mjs` — DEMO bookings.
- Real: name, both phone numbers, address, hours, Instagram/Facebook, service list. **Placeholders (TODO(client))**: ALL prices and durations, CAPACITY (2 = two basins + nails; solo or team unknown), notice period, email.

## DB
libSQL, local `data/booking.db`. Service name/price snapshotted onto the booking.

**bookings**: id, ref (`NH-XXXXX`), date, time, minutes, serviceId, serviceName, price, priceFrom, discounted, name, phone, email, notes, extra (JSON of EXTRA_FIELDS answers), status (pending/confirmed/completed/cancelled/no-show), createdAt, updatedAt

## Routes
- `/` — hero, services, bridal, gallery, salon, visit
- `/book` — service → day/time → details; sticky price bar · `/booking/[ref]` — confirmation
- `/admin` — day diary, week strip, pending queue, status actions, WhatsApp confirm
- `GET /api/slots?date&service` · `POST /api/bookings` · `PATCH|DELETE /api/admin/bookings/[id]`

## Availability
`lib/slots.ts`: real hours, 2 clients at once (TBC), 12h notice, 15-min grid, 60-day window. A booking blocks its duration; server re-checks on submit (409).

## Deploy
Vercel project `nadine-hairdressing` (currently still git-linked to the old static site on `christiaanpbotha/christiaanpbotha`, branch `ccr-610b4140-6jho3n`, root dir `nadine-hairdressing` — to be re-pointed). Target: GitHub `christiaanpbotha/nadine-hairdressing` (private, user creates it), push to `main` deploys, Turso DB `nadine`.
Prod env: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `AUTH_PASSWORD`, `AUTH_SECRET`. Set Vercel deployment protection to `prod_deployment_urls_and_all_previews` so the production domain is public.

## Keyboard shortcuts (staff diary only)
| Where | Key | Action |
|---|---|---|
| `/admin` | `←`/`j` · `→`/`k` | Previous / next day |
| `/admin` | `t` | Today |
| `/admin` | `b` / `w` | Previous / next week |
| `/admin` | `Esc` | Cancel pending delete |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
