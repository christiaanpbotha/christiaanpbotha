/* LaVee Spa & Beauty — shared data + booking logic.
 *
 * Everything the public site and the staff dashboard share lives here:
 * business details, the treatment menu, opening hours, and the booking store.
 *
 * Storage: this build keeps bookings in the browser's localStorage so the site
 * works as plain static files. That means bookings are only visible on the
 * device they were made on. To go live, replace the functions in the
 * `Store` section with calls to a real backend (all reads/writes go through
 * load()/save(), so that is the only place to change).
 */
(function (global) {
  'use strict';

  const BUSINESS = {
    name: 'LaVee Spa & Beauty',
    tagline: 'Experience your peace and tranquility',
    phoneDisplay: '078 797 2238',
    whatsapp: '27787972238',
    email: 'laveespa6@gmail.com',
    website: 'https://lavee.co.za',
    address: ['Shop H, Chameleon Village', 'R501 Rustenburg Road', 'Hartbeespoort'],
    mapsQuery: 'Chameleon Village, R501 Rustenburg Road, Hartbeespoort',
  };

  // Staff dashboard password. NOTE: client-side only — see README.
  const STAFF_PASSWORD = 'admin';

  // 0 = Sunday … 6 = Saturday. null = closed.
  const DEFAULT_HOURS = {
    0: { open: '09:00', close: '16:00' },
    1: { open: '09:00', close: '17:00' },
    2: { open: '09:00', close: '17:00' },
    3: { open: '09:00', close: '17:00' },
    4: { open: '09:00', close: '17:00' },
    5: { open: '09:00', close: '17:00' },
    6: { open: '09:00', close: '17:00' },
  };

  // price: number in Rand, or null for "price on enquiry".
  // Durations and null prices are placeholders — staff can edit them in the dashboard.
  const DEFAULT_SERVICES = [
    { id: 'pre-festive', cat: 'Specials', name: 'Pre-Festive Season Vibe', duration: 60, price: 899, guests: 2, fixedGuests: true,
      img: 'images/svc-hotstones.jpg', blurb: '50-minute full-body massage plus 10 minutes of your choice: head massage, foot massage or hot stones. Priced for two.' },
    { id: 'spring-affairs', cat: 'Specials', name: 'Spring Affairs for 2', duration: 60, price: 899, guests: 2, fixedGuests: true,
      img: 'images/svc-head.jpg', blurb: '50-minute full-body massage, 10-minute head massage and a welcome drink. Priced for two.' },
    { id: 'full-body', cat: 'Massage', name: 'Full Body Massage', duration: 60, price: null,
      img: 'images/svc-scrub.jpg', blurb: 'A slow, soothing full-body massage to release tension from head to toe.' },
    { id: 'hot-stones', cat: 'Massage', name: 'Hot Stone Massage', duration: 60, price: null,
      img: 'images/svc-hotstones.jpg', blurb: 'Warm basalt stones melt deep into tired muscles.' },
    { id: 'head', cat: 'Massage', name: 'Head Massage', duration: 30, price: null,
      img: 'images/svc-head.jpg', blurb: 'Gentle scalp, neck and temple work that quiets a busy mind.' },
    { id: 'foot', cat: 'Massage', name: 'Foot Massage', duration: 30, price: null,
      img: 'images/svc-foot.jpg', blurb: 'Reflexology-inspired relief for feet that carry you all day.' },
    { id: 'scrub', cat: 'Body & Face', name: 'Body Scrub', duration: 45, price: null,
      img: 'images/svc-scrub.jpg', blurb: 'Exfoliate and polish for soft, glowing skin.' },
    { id: 'facial', cat: 'Body & Face', name: 'Facial', duration: 60, price: null,
      img: 'images/svc-facial.jpg', blurb: 'Cleanse, nourish and refresh with a calming facial.' },
    { id: 'group', cat: 'Groups', name: 'Group Pamper (5+ people)', duration: 120, price: null, guests: 5, minGuests: 5, exclusive: true,
      img: 'images/svc-group.jpg', blurb: 'Discounted massages for families, sisterhoods, birthdays, baby & bridal showers, team building and social clubs.' },
    { id: 'mobile', cat: 'Groups', name: 'Mobile Spa (6+ people)', duration: 180, price: null, guests: 6, minGuests: 6, offsite: true,
      img: 'images/mobile-spa-group.jpg', blurb: 'Any spa package of your choice, brought to your venue around Hartbeespoort.' },
  ];

  const DEFAULT_SETTINGS = { rooms: 2, slotStep: 30, leadMinutes: 60, daysAhead: 30 };

  /* ---------------- Store ---------------- */
  const KEY = 'lavee.v1.';
  function load(name, fallback) {
    try {
      const raw = localStorage.getItem(KEY + name);
      return raw ? JSON.parse(raw) : structuredCloneSafe(fallback);
    } catch (e) { return structuredCloneSafe(fallback); }
  }
  function save(name, value) {
    try { localStorage.setItem(KEY + name, JSON.stringify(value)); return true; }
    catch (e) { console.warn('Could not save', name, e); return false; }
  }
  function structuredCloneSafe(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }

  const getServices = () => load('services', DEFAULT_SERVICES);
  const saveServices = (s) => save('services', s);
  const getHours = () => load('hours', DEFAULT_HOURS);
  const saveHours = (h) => save('hours', h);
  const getSettings = () => Object.assign({}, DEFAULT_SETTINGS, load('settings', {}));
  const saveSettings = (s) => save('settings', s);
  const getBookings = () => load('bookings', []);
  const saveBookings = (b) => save('bookings', b);
  const getBlocks = () => load('blocks', []);
  const saveBlocks = (b) => save('blocks', b);

  /* ---------------- Helpers ---------------- */
  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const fromMin = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const money = (p) => (p == null || p === '' ? 'Price on enquiry' : 'R' + Number(p).toLocaleString('en-ZA', { minimumFractionDigits: 0 }));
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const prettyDate = (iso) => { const d = fromISO(iso); return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const makeRef = () => 'LV-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function hoursFor(iso) {
    return getHours()[fromISO(iso).getDay()] || null;
  }

  const ACTIVE = (b) => b.status !== 'cancelled' && b.status !== 'no-show';
  const overlaps = (aS, aE, bS, bE) => aS < bE && bS < aE;

  /** Available start times for a service on a date.
   *  ignoreId: skip one booking (when editing it). opts.staff: ignore the minimum-notice rule. */
  function availableSlots(iso, serviceId, ignoreId, opts) {
    const svc = getServices().find((s) => s.id === serviceId);
    const hrs = hoursFor(iso);
    if (!svc || !hrs) return [];
    const st = getSettings();
    const open = toMin(hrs.open), close = toMin(hrs.close);
    const dur = Number(svc.duration) || 60;
    const now = new Date();
    const isToday = iso === toISO(now);
    const earliest = isToday && !(opts && opts.staff) ? now.getHours() * 60 + now.getMinutes() + st.leadMinutes : -1;

    const dayBookings = getBookings().filter((b) => b.date === iso && ACTIVE(b) && b.id !== ignoreId);
    const dayBlocks = getBlocks().filter((b) => b.date === iso);
    const services = getServices();
    const svcOf = (b) => services.find((s) => s.id === b.serviceId) || {};

    // Mobile spa is off-site: capped to one per day, does not use rooms.
    if (svc.offsite) {
      if (dayBlocks.some((b) => !b.start)) return [];
      if (dayBookings.some((b) => svcOf(b).offsite)) return [];
    }

    const out = [];
    for (let t = open; t + Math.min(dur, svc.offsite ? 60 : dur) <= close; t += st.slotStep) {
      if (t < earliest) continue;
      const end = t + dur;
      if (!svc.offsite && end > close) continue;
      const blocked = dayBlocks.some((b) => !b.start || overlaps(t, end, toMin(b.start), toMin(b.end)));
      if (blocked) continue;
      if (!svc.offsite) {
        const clash = dayBookings.filter((b) => !svcOf(b).offsite && overlaps(t, end, toMin(b.time), toMin(b.time) + Number(b.duration)));
        if (svc.exclusive && clash.length) continue;
        if (clash.some((b) => svcOf(b).exclusive)) continue;
        if (clash.length >= st.rooms) continue;
      }
      out.push(fromMin(t));
    }
    return out;
  }

  function addBooking(data) {
    const svc = getServices().find((s) => s.id === data.serviceId);
    const booking = Object.assign({
      id: uid(), ref: makeRef(), status: 'pending', source: 'online', createdAt: new Date().toISOString(),
    }, data, {
      serviceName: svc ? svc.name : data.serviceName,
      duration: data.duration || (svc ? svc.duration : 60),
      price: data.price !== undefined ? data.price : (svc ? svc.price : null),
    });
    const all = getBookings();
    all.push(booking);
    saveBookings(all);
    return booking;
  }

  function updateBooking(id, patch) {
    const all = getBookings();
    const i = all.findIndex((b) => b.id === id);
    if (i < 0) return null;
    all[i] = Object.assign({}, all[i], patch, { updatedAt: new Date().toISOString() });
    saveBookings(all);
    return all[i];
  }

  function deleteBooking(id) { saveBookings(getBookings().filter((b) => b.id !== id)); }

  function waLink(text) { return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`; }

  global.Lavee = {
    BUSINESS, STAFF_PASSWORD, DEFAULT_SERVICES, DEFAULT_HOURS, DAYS, MONTHS,
    getServices, saveServices, getHours, saveHours, getSettings, saveSettings,
    getBookings, saveBookings, getBlocks, saveBlocks,
    addBooking, updateBooking, deleteBooking, availableSlots, hoursFor,
    toISO, fromISO, toMin, fromMin, money, prettyDate, uid, esc, waLink, pad,
  };
})(window);
