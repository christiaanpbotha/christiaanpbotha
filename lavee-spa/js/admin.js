/* LaVee Spa & Beauty — staff dashboard. */
(function () {
  'use strict';
  const L = window.Lavee;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const SESSION = 'lavee.staff';

  /* ---------- Auth ---------- */
  const isAuthed = () => { try { return sessionStorage.getItem(SESSION) === '1'; } catch (e) { return window.__laveeAuthed === true; } };
  function setAuthed(v) {
    try { v ? sessionStorage.setItem(SESSION, '1') : sessionStorage.removeItem(SESSION); } catch (e) { window.__laveeAuthed = v; }
  }
  function showApp() { $('#login').hidden = true; $('#app').hidden = false; init(); }
  function showLogin() { $('#app').hidden = true; $('#login').hidden = false; $('#pw').value = ''; $('#pw').focus(); }

  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if ($('#pw').value === L.STAFF_PASSWORD) { setAuthed(true); $('#loginErr').textContent = ''; showApp(); }
    else { $('#loginErr').textContent = 'Incorrect password.'; $('#pw').select(); }
  });
  $('#logout').addEventListener('click', () => { setAuthed(false); showLogin(); });

  /* ---------- Utils ---------- */
  const todayISO = () => L.toISO(new Date());
  const addDays = (iso, n) => { const d = L.fromISO(iso); d.setDate(d.getDate() + n); return L.toISO(d); };
  const sortKey = (b) => b.date + ' ' + b.time;
  const badge = (s) => `<span class="badge b-${s}">${s.replace('-', ' ')}</span>`;
  const firstName = (n) => (n || '').split(' ')[0];
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2400); }
  function intlPhone(p) { let d = (p || '').replace(/\D/g, ''); if (d.startsWith('0')) d = '27' + d.slice(1); return d; }
  function clientWa(b, kind) {
    const when = `${L.prettyDate(b.date)} at ${b.time}`;
    const txt = kind === 'confirm'
      ? `Hi ${firstName(b.name)}, this is LaVee Spa & Beauty. Your booking for ${b.serviceName} on ${when} is confirmed (ref ${b.ref}). We look forward to pampering you! Shop H, Chameleon Village, Hartbeespoort.`
      : `Hi ${firstName(b.name)}, this is LaVee Spa & Beauty regarding your booking ${b.ref} (${b.serviceName}, ${when}).`;
    return `https://wa.me/${intlPhone(b.phone)}?text=${encodeURIComponent(txt)}`;
  }

  let day = todayISO();
  let tab = 'schedule';
  let inited = false;

  function init() {
    if (!inited) { bindOnce(); inited = true; }
    refresh();
  }
  function refresh() { renderStats(); renderTab(); }

  /* ---------- Stats ---------- */
  function renderStats() {
    const all = L.getBookings();
    const t = todayISO(), wk = addDays(t, 7), month = t.slice(0, 7);
    const active = all.filter((b) => b.status !== 'cancelled' && b.status !== 'no-show');
    const todayN = active.filter((b) => b.date === t).length;
    const pending = all.filter((b) => b.status === 'pending' && b.date >= t).length;
    const week = active.filter((b) => b.date >= t && b.date < wk).length;
    const rev = active.filter((b) => b.date.startsWith(month) && b.price != null && b.price !== '').reduce((s, b) => s + Number(b.price), 0);
    $('#stats').innerHTML = `
      <div class="stat"><span>Today</span><b>${todayN}</b></div>
      <div class="stat ${pending ? 'attn' : ''}"><span>Awaiting confirmation</span><b>${pending}</b></div>
      <div class="stat"><span>Next 7 days</span><b>${week}</b></div>
      <div class="stat"><span>Booked value · ${L.MONTHS[new Date().getMonth()]}</span><b>${L.money(rev).replace('Price on enquiry', 'R0')}</b></div>`;
  }

  /* ---------- Tabs ---------- */
  function renderTab() {
    $$('.a-tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab));
    $$('.tab').forEach((p) => (p.hidden = p.dataset.panel !== tab));
    ({ schedule: renderSchedule, bookings: renderBookings, services: renderServices, settings: renderSettings })[tab]();
  }

  /* ---------- Schedule ---------- */
  function apptActions(b) {
    const a = [];
    if (b.status === 'pending') a.push(`<button class="icon-btn ok" data-act="confirm" data-id="${b.id}">✓ Confirm</button>`);
    if (b.status === 'confirmed') a.push(`<button class="icon-btn ok" data-act="complete" data-id="${b.id}">Done</button>`);
    a.push(`<a class="icon-btn wa" href="${clientWa(b, b.status === 'pending' ? 'confirm' : 'msg')}" target="_blank" rel="noopener" title="WhatsApp client">WhatsApp</a>`);
    a.push(`<button class="icon-btn" data-act="edit" data-id="${b.id}">Edit</button>`);
    if (b.status !== 'cancelled') a.push(`<button class="icon-btn bad" data-act="cancel" data-id="${b.id}">Cancel</button>`);
    return a.join('');
  }

  function renderSchedule() {
    $('#dayPick').value = day;
    $('#dayTitle').textContent = (day === todayISO() ? 'Today · ' : '') + L.prettyDate(day);
    const hrs = L.hoursFor(day);
    const list = L.getBookings().filter((b) => b.date === day).sort((a, b) => a.time.localeCompare(b.time));
    const blocks = L.getBlocks().filter((b) => b.date === day);
    const active = list.filter((b) => b.status !== 'cancelled' && b.status !== 'no-show');
    $('#daySub').textContent = (hrs ? `Open ${hrs.open} – ${hrs.close}` : 'Closed') + ` · ${active.length} booking${active.length === 1 ? '' : 's'}` +
      (active.length ? ` · ${active.reduce((s, b) => s + Number(b.guests || 1), 0)} guests` : '');

    let html = blocks.map((k) => `<div class="block-row"><span><b>Blocked</b> ${k.start ? `${k.start} – ${k.end}` : 'all day'}${k.reason ? ' · ' + L.esc(k.reason) : ''}</span>
      <button class="icon-btn" data-act="unblock" data-id="${k.id}">Remove</button></div>`).join('');
    html += list.map((b) => {
      const end = L.fromMin(L.toMin(b.time) + Number(b.duration));
      return `<div class="appt s-${b.status}">
        <div class="t">${b.time}<small>to ${end}</small></div>
        <div class="who">
          <b>${L.esc(b.name)}</b> ${badge(b.status)}
          <div>${L.esc(b.serviceName)} · ${b.guests} guest${b.guests == 1 ? '' : 's'} · ${L.money(b.price)} · <a href="tel:${L.esc(b.phone)}">${L.esc(b.phone)}</a></div>
          ${b.location ? `<div>📍 ${L.esc(b.location)}</div>` : ''}
          ${b.notes ? `<div class="note">“${L.esc(b.notes)}”</div>` : ''}
          <div style="font-size:.75rem">${b.ref} · ${b.source === 'staff' ? 'added by staff' : 'online'}</div>
        </div>
        <div class="acts">${apptActions(b)}</div>
      </div>`;
    }).join('');
    $('#dayList').innerHTML = html || `<div class="empty">No bookings for this day${hrs ? '' : ' (spa closed)'}.</div>`;
  }

  /* ---------- All bookings ---------- */
  function filteredBookings() {
    const q = $('#q').value.trim().toLowerCase();
    const st = $('#fStatus').value;
    const when = $('#fWhen').value;
    const t = todayISO();
    let list = L.getBookings().filter((b) =>
      (!st || b.status === st) &&
      (when === 'all' || (when === 'upcoming' ? b.date >= t : b.date < t)) &&
      (!q || [b.name, b.phone, b.email, b.ref, b.serviceName, b.notes].join(' ').toLowerCase().includes(q)));
    list.sort((a, b) => (when === 'past' ? sortKey(b).localeCompare(sortKey(a)) : sortKey(a).localeCompare(sortKey(b))));
    return list;
  }
  function renderBookings() {
    const list = filteredBookings();
    $('#bookingTable').innerHTML = `<thead><tr><th>Date</th><th>Time</th><th>Client</th><th>Treatment</th><th>Guests</th><th>Price</th><th>Status</th><th></th></tr></thead><tbody>` +
      (list.length ? list.map((b) => `<tr>
        <td style="white-space:nowrap">${L.prettyDate(b.date).replace(/ \d{4}$/, '')}</td>
        <td>${b.time}</td>
        <td><b style="font-weight:500">${L.esc(b.name)}</b><br><small style="color:var(--muted)">${L.esc(b.phone)} · ${b.ref}</small></td>
        <td>${L.esc(b.serviceName)}</td>
        <td>${b.guests}</td>
        <td style="white-space:nowrap">${b.price == null || b.price === '' ? '—' : L.money(b.price)}</td>
        <td>${badge(b.status)}</td>
        <td style="white-space:nowrap"><button class="icon-btn" data-act="goto" data-date="${b.date}">View day</button> <button class="icon-btn" data-act="edit" data-id="${b.id}">Edit</button> <button class="icon-btn bad" data-act="delete" data-id="${b.id}" aria-label="Delete booking">✕</button></td>
      </tr>`).join('') : '<tr class="empty-row"><td colspan="8">No bookings match.</td></tr>') + '</tbody>';
  }
  function exportCsv() {
    const cols = ['ref', 'date', 'time', 'duration', 'serviceName', 'guests', 'price', 'status', 'name', 'phone', 'email', 'location', 'notes', 'source', 'createdAt'];
    const rows = [cols.join(',')].concat(filteredBookings().map((b) => cols.map((c) => `"${String(b[c] == null ? '' : b[c]).replace(/"/g, '""')}"`).join(',')));
    download(`lavee-bookings-${todayISO()}.csv`, rows.join('\n'), 'text/csv');
  }
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- Services ---------- */
  function renderServices() {
    const svcs = L.getServices();
    $('#svcTable').innerHTML = `<thead><tr><th>Show on site</th><th>Treatment</th><th>Category</th><th>Minutes</th><th>Price (R)</th></tr></thead><tbody>` +
      svcs.map((s) => `<tr data-id="${s.id}">
        <td><input type="checkbox" data-k="active" ${s.active !== false ? 'checked' : ''} aria-label="Show ${L.esc(s.name)} on site"></td>
        <td><input data-k="name" value="${L.esc(s.name)}" aria-label="Name"></td>
        <td style="color:var(--muted)">${L.esc(s.cat)}${s.fixedGuests ? ' · for 2' : ''}</td>
        <td><input class="num" type="number" min="15" step="5" data-k="duration" value="${s.duration}" aria-label="Duration"></td>
        <td><input class="num" type="number" min="0" step="1" data-k="price" value="${s.price == null ? '' : s.price}" placeholder="Enquire" aria-label="Price"></td>
      </tr>`).join('') + '</tbody>';
  }
  function saveServicesFromTable() {
    const svcs = L.getServices();
    $$('#svcTable tbody tr').forEach((tr) => {
      const s = svcs.find((x) => x.id === tr.dataset.id); if (!s) return;
      s.active = tr.querySelector('[data-k=active]').checked;
      s.name = tr.querySelector('[data-k=name]').value.trim() || s.name;
      s.duration = Math.max(15, Number(tr.querySelector('[data-k=duration]').value) || s.duration);
      const p = tr.querySelector('[data-k=price]').value;
      s.price = p === '' ? null : Math.max(0, Number(p));
    });
    L.saveServices(svcs);
    toast('Treatments saved');
  }

  /* ---------- Settings ---------- */
  function renderSettings() {
    const hours = L.getHours();
    $('#hoursEdit').innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const h = hours[d];
      return `<div class="hours-row" data-d="${d}" style="margin-bottom:.4rem">
        <span>${L.DAYS[d]}</span>
        <input type="time" data-k="open" value="${h ? h.open : '09:00'}" ${h ? '' : 'disabled'} aria-label="${L.DAYS[d]} opens">
        <input type="time" data-k="close" value="${h ? h.close : '17:00'}" ${h ? '' : 'disabled'} aria-label="${L.DAYS[d]} closes">
        <label><input type="checkbox" data-k="closed" ${h ? '' : 'checked'}> Closed</label>
      </div>`;
    }).join('');
    const st = L.getSettings();
    $('#sRooms').value = st.rooms; $('#sLead').value = st.leadMinutes; $('#sAhead').value = st.daysAhead; $('#sStep').value = String(st.slotStep);
    renderBlockList();
  }
  function renderBlockList() {
    const t = todayISO();
    const blocks = L.getBlocks().filter((b) => b.date >= t).sort((a, b) => a.date.localeCompare(b.date));
    $('#blockList').innerHTML = (blocks.length ? blocks.map((k) => `<div class="block-item"><span>${L.prettyDate(k.date)} · ${k.start ? k.start + '–' + k.end : 'all day'}${k.reason ? ' · ' + L.esc(k.reason) : ''}</span>
      <button class="icon-btn" data-act="unblock" data-id="${k.id}">Remove</button></div>`).join('') : '<p class="hint">No upcoming blocked times.</p>') +
      '<button class="btn btn-sm btn-ghost" data-act="newblock" style="justify-self:start">+ Block time</button>';
  }

  /* ---------- Booking dialog ---------- */
  const dlg = $('#bookingDlg'), form = $('#bForm');
  let editingId = null;
  function fillServiceSelect(sel) {
    $('#bSvc').innerHTML = L.getServices().map((s) => `<option value="${s.id}" ${s.id === sel ? 'selected' : ''}>${L.esc(s.name)} (${s.duration} min)</option>`).join('');
  }
  function fillTimes(keep) {
    const sid = $('#bSvc').value, date = $('#bDate').value;
    const svc = L.getServices().find((s) => s.id === sid);
    $('#bLocWrap').hidden = !(svc && svc.offsite);
    let times;
    if ($('#bOverride').checked || !date) {
      times = [];
      const h = (date && L.hoursFor(date)) || { open: '08:00', close: '19:00' };
      for (let t = L.toMin(h.open) - 60; t <= L.toMin(h.close); t += 15) if (t >= 0) times.push(L.fromMin(t));
    } else {
      // staff can book inside the online notice window
      times = L.availableSlots(date, sid, editingId, { staff: true });
    }
    if (keep && !times.includes(keep)) times.unshift(keep);
    $('#bTime').innerHTML = times.length ? times.map((t) => `<option ${t === keep ? 'selected' : ''}>${t}</option>`).join('') : '<option value="">No free times</option>';
  }
  function openBooking(b, preset) {
    editingId = b ? b.id : null;
    form.reset();
    $('#bErr').textContent = '';
    $('#bTitle').textContent = b ? `Edit booking ${b.ref}` : 'New booking';
    fillServiceSelect(b ? b.serviceId : (preset && preset.serviceId) || L.getServices()[0].id);
    $('#bDate').value = b ? b.date : day;
    if (b) {
      ['name', 'phone', 'email', 'guests', 'location', 'notes', 'status'].forEach((k) => { if (form.elements[k]) form.elements[k].value = b[k] == null ? '' : b[k]; });
      form.elements.price.value = b.price == null ? '' : b.price;
    } else {
      form.elements.status.value = 'confirmed';
      const svc = L.getServices().find((s) => s.id === $('#bSvc').value);
      form.elements.price.value = svc && svc.price != null ? svc.price : '';
      form.elements.guests.value = svc && svc.guests ? svc.guests : 1;
    }
    fillTimes(b ? b.time : null);
    dlg.showModal();
  }
  $('#bSvc').addEventListener('change', () => {
    const svc = L.getServices().find((s) => s.id === $('#bSvc').value);
    if (!editingId && svc) { form.elements.price.value = svc.price != null ? svc.price : ''; form.elements.guests.value = svc.guests || 1; }
    fillTimes($('#bTime').value);
  });
  $('#bDate').addEventListener('change', () => fillTimes());
  $('#bOverride').addEventListener('change', () => fillTimes($('#bTime').value));
  form.addEventListener('submit', (e) => {
    if (e.submitter && e.submitter.value === 'cancel') return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    if (!d.time) return ($('#bErr').textContent = 'Choose a time.');
    if (!d.name.trim() || !d.phone.trim()) return ($('#bErr').textContent = 'Client name and mobile are required.');
    const svc = L.getServices().find((s) => s.id === d.serviceId);
    const rec = {
      serviceId: d.serviceId, serviceName: svc.name, duration: svc.duration, date: d.date, time: d.time,
      name: d.name.trim(), phone: d.phone.trim(), email: d.email.trim(), guests: Number(d.guests) || 1,
      location: svc.offsite ? d.location.trim() : '', notes: d.notes.trim(), status: d.status,
      price: d.price === '' ? null : Number(d.price),
    };
    if (editingId) {
      const old = L.getBookings().find((b) => b.id === editingId);
      if (old && old.serviceId === rec.serviceId) rec.duration = old.duration;
      L.updateBooking(editingId, rec); toast('Booking updated');
    } else { L.addBooking(Object.assign(rec, { source: 'staff' })); toast('Booking added'); }
    dlg.close();
    day = rec.date; if (tab !== 'bookings') tab = 'schedule';
    refresh();
  });

  /* ---------- Block dialog ---------- */
  const blkDlg = $('#blockDlg'), blkForm = $('#blkForm');
  function syncBlockFields() { const all = blkForm.elements.allDay.checked; blkForm.elements.start.disabled = all; blkForm.elements.end.disabled = all; }
  blkForm.elements.allDay.addEventListener('change', syncBlockFields);
  function openBlock() { blkForm.reset(); blkForm.elements.date.value = day; $('#blkErr').textContent = ''; syncBlockFields(); blkDlg.showModal(); }
  blkForm.addEventListener('submit', (e) => {
    if (e.submitter && e.submitter.value === 'cancel') return;
    e.preventDefault();
    const f = blkForm.elements;
    const all = f.allDay.checked;
    if (!f.date.value) return ($('#blkErr').textContent = 'Choose a date.');
    if (!all && L.toMin(f.end.value) <= L.toMin(f.start.value)) return ($('#blkErr').textContent = '“To” must be after “From”.');
    const blocks = L.getBlocks();
    blocks.push({ id: L.uid(), date: f.date.value, start: all ? null : f.start.value, end: all ? null : f.end.value, reason: f.reason.value.trim() });
    L.saveBlocks(blocks);
    blkDlg.close(); toast('Time blocked'); refresh();
  });

  /* ---------- Sample data ---------- */
  function addDemo() {
    const names = [['Thandi Mokoena', '082 555 0141'], ['Annelie van Wyk', '083 555 0172'], ['Lerato Dlamini', '071 555 0190'], ['Megan Botha', '072 555 0123'], ['Sipho Nkosi', '076 555 0168'], ['Carla Steyn', '084 555 0110']];
    const svcs = L.getServices().filter((s) => !s.offsite && !s.exclusive);
    const statuses = ['confirmed', 'pending', 'confirmed', 'pending', 'confirmed'];
    let n = 0;
    for (let i = 0; i < 6; i++) {
      const date = addDays(todayISO(), i);
      if (!L.hoursFor(date)) continue;
      const times = ['09:30', '11:00', '13:00', '14:30'].slice(0, 2 + (i % 3));
      times.forEach((t, j) => {
        const s = svcs[(i + j) % svcs.length]; const [nm, ph] = names[(i * 2 + j) % names.length];
        L.addBooking({ serviceId: s.id, date, time: t, guests: s.guests || 1, name: nm, phone: ph, email: '', notes: j === 1 ? 'Add hot stones please' : '', status: statuses[(i + j) % statuses.length], source: j % 2 ? 'staff' : 'online' });
        n++;
      });
    }
    toast(`${n} sample bookings added`); refresh();
  }

  /* ---------- Events ---------- */
  function bindOnce() {
    $('.a-tabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-tab]'); if (b) { tab = b.dataset.tab; renderTab(); } });
    $('#prevDay').addEventListener('click', () => { day = addDays(day, -1); renderSchedule(); });
    $('#nextDay').addEventListener('click', () => { day = addDays(day, 1); renderSchedule(); });
    $('#todayBtn').addEventListener('click', () => { day = todayISO(); renderSchedule(); });
    $('#dayPick').addEventListener('change', (e) => { if (e.target.value) { day = e.target.value; renderSchedule(); } });
    $('#blockBtn').addEventListener('click', openBlock);
    $('#newBooking').addEventListener('click', () => openBooking(null));
    ['#q', '#fStatus', '#fWhen'].forEach((s) => $(s).addEventListener('input', renderBookings));
    $('#csv').addEventListener('click', exportCsv);
    $('#svcSave').addEventListener('click', () => { saveServicesFromTable(); renderServices(); });
    $('#svcReset').addEventListener('click', () => {
      if (!confirm('Reset all treatments and prices to the defaults?')) return;
      L.saveServices(L.DEFAULT_SERVICES); renderServices(); toast('Treatments reset');
    });
    $('#hoursSave').addEventListener('click', () => {
      const h = {};
      $$('#hoursEdit .hours-row').forEach((r) => {
        const closed = r.querySelector('[data-k=closed]').checked;
        const o = r.querySelector('[data-k=open]').value, c = r.querySelector('[data-k=close]').value;
        h[r.dataset.d] = closed || !o || !c || L.toMin(c) <= L.toMin(o) ? null : { open: o, close: c };
      });
      L.saveHours(h); renderSettings(); toast('Opening hours saved');
    });
    $('#hoursEdit').addEventListener('change', (e) => {
      if (e.target.dataset.k !== 'closed') return;
      e.target.closest('.hours-row').querySelectorAll('input[type=time]').forEach((i) => (i.disabled = e.target.checked));
    });
    $('#rulesSave').addEventListener('click', () => {
      L.saveSettings({ rooms: Math.max(1, Number($('#sRooms').value) || 1), leadMinutes: Math.max(0, Number($('#sLead').value) || 0),
        daysAhead: Math.min(120, Math.max(1, Number($('#sAhead').value) || 30)), slotStep: Number($('#sStep').value) || 30 });
      toast('Booking rules saved');
    });
    $('#exportJson').addEventListener('click', () => download(`lavee-backup-${todayISO()}.json`, JSON.stringify({
      bookings: L.getBookings(), blocks: L.getBlocks(), services: L.getServices(), hours: L.getHours(), settings: L.getSettings(),
    }, null, 2), 'application/json'));
    $('#importJson').addEventListener('change', async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!Array.isArray(data.bookings)) throw new Error('bad file');
        if (!confirm(`Restore ${data.bookings.length} bookings from this backup? This replaces current data.`)) return;
        L.saveBookings(data.bookings); if (data.blocks) L.saveBlocks(data.blocks); if (data.services) L.saveServices(data.services);
        if (data.hours) L.saveHours(data.hours); if (data.settings) L.saveSettings(data.settings);
        toast('Backup restored'); refresh();
      } catch (err) { alert('That file is not a valid LaVee backup.'); }
      e.target.value = '';
    });
    $('#demo').addEventListener('click', addDemo);
    $('#wipe').addEventListener('click', () => {
      if (!confirm('Delete ALL bookings? This cannot be undone. Consider downloading a backup first.')) return;
      L.saveBookings([]); toast('All bookings deleted'); refresh();
    });

    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-act]'); if (!el) return;
      const id = el.dataset.id, act = el.dataset.act;
      const b = id && L.getBookings().find((x) => x.id === id);
      if (act === 'confirm') { L.updateBooking(id, { status: 'confirmed' }); toast('Confirmed. Send the client a WhatsApp.'); refresh(); }
      else if (act === 'complete') { L.updateBooking(id, { status: 'completed' }); toast('Marked as completed'); refresh(); }
      else if (act === 'cancel') { if (confirm(`Cancel ${b.name}'s booking?`)) { L.updateBooking(id, { status: 'cancelled' }); toast('Booking cancelled'); refresh(); } }
      else if (act === 'delete') { if (confirm(`Permanently delete booking ${b.ref}?`)) { L.deleteBooking(id); toast('Booking deleted'); refresh(); } }
      else if (act === 'edit') openBooking(b);
      else if (act === 'goto') { day = el.dataset.date; tab = 'schedule'; renderTab(); }
      else if (act === 'unblock') { L.saveBlocks(L.getBlocks().filter((k) => k.id !== id)); toast('Block removed'); refresh(); }
      else if (act === 'newblock') openBlock();
    });

    // keep in sync if a booking is made in another tab
    window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith('lavee.')) refresh(); });
  }

  isAuthed() ? showApp() : showLogin();
})();
