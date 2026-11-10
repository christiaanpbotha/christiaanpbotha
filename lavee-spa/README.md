# LaVee Spa & Beauty: website

A static website for LaVee Spa & Beauty (Chameleon Village, Hartbeespoort), with online booking and a staff dashboard.

- `index.html`: public site (treatments, specials, groups & mobile spa, gift vouchers, booking, hours, map)
- `admin.html`: staff dashboard (password: **admin**)
- `js/store.js`: business details, treatment menu, opening hours, booking and availability logic
- `images/`: the owner's posters and photos

## Booking system
Clients pick a treatment, a date and an open time slot, then enter their details. Availability follows the opening hours,
the number of treatment rooms, existing bookings and blocked times. When a client finishes booking, they get a reference
number and a one-tap button that sends the booking to the spa on WhatsApp.

Staff dashboard: day schedule, confirm/complete/cancel bookings, WhatsApp the client, add/edit bookings, block time off,
edit prices/durations/visibility, edit opening hours and booking rules, CSV export, JSON backup/restore.

## Before going live: important
This version saves bookings in the browser's **localStorage**, so it runs as plain static files with no server.
That means bookings made on a customer's phone are **not** visible on the spa's computer. The WhatsApp hand-off
still gets every booking to the spa, but for a shared booking list, connect a backend (e.g. Supabase, Firebase, Turso).
Every read and write goes through `load()`/`save()` in `js/store.js`, so that is the only place to change.

The staff password is checked in the browser. That's fine for a demo, but it is **not** real security. Move the login to the
backend at the same time.

Prices marked "Price on enquiry" and the treatment durations are placeholders. Staff can set them under
*Treatments & prices* in the dashboard, or change the defaults in `js/store.js`.

## Run locally
    cd lavee-spa && python3 -m http.server 8000   # then open http://localhost:8000
