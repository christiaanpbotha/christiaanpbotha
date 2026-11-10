/* LaVee Spa & Beauty — public site behaviour + booking flow. */
(function () {
  'use strict';
  const L = window.Lavee;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Nav ---------- */
  const toggle = $('.nav-toggle'), links = $('#navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', (e) => { if (e.target.closest('a')) { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } });
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Hours / open status ---------- */
  function renderHours() {
    const hours = L.getHours();
    const now = new Date();
    const order = [1, 2, 3, 4, 5, 6, 0];
    $('#hoursTable').innerHTML = order.map((d) => {
      const h = hours[d];
      return `<tr class="${d === now.getDay() ? 'today' : ''}"><td>${L.DAYS[d]}</td><td>${h ? `${h.open} – ${h.close}` : 'Closed'}</td></tr>`;
    }).join('');

    const today = hours[now.getDay()];
    const mins = now.getHours() * 60 + now.getMinutes();
    const dot = $('#openDot'), status = $('#openStatus');
    if (today && mins >= L.toMin(today.open) && mins < L.toMin(today.close)) {
      status.textContent = `Open now · until ${today.close}`;
    } else {
      dot.classList.add('closed');
      // find next opening
      for (let i = 0; i < 8; i++) {
        const d = (now.getDay() + i) % 7, h = hours[d];
        if (!h) continue;
        if (i === 0 && mins >= L.toMin(h.open)) continue;
        status.textContent = `Closed · opens ${i === 0 ? 'today' : i === 1 ? 'tomorrow' : L.DAYS[d]} at ${h.open}`;
        break;
      }
    }
  }
  renderHours();

  /* ---------- Treatment menu ---------- */
  const services = L.getServices().filter((s) => s.active !== false);
  const cats = ['All', ...new Set(services.map((s) => s.cat))];
  let activeCat = 'All';
  function renderMenu() {
    $('#menuTabs').innerHTML = cats.map((c) => `<button type="button" aria-pressed="${c === activeCat}" data-cat="${L.esc(c)}">${L.esc(c)}</button>`).join('');
    $('#treatmentGrid').innerHTML = services.filter((s) => activeCat === 'All' || s.cat === activeCat).map((s) => `
      <article class="treat">
        <div class="ph"><img src="${L.esc(s.img)}" alt="" loading="lazy"></div>
        <div class="meta">${L.esc(s.cat)} · ${s.offsite ? 'at your venue' : s.duration + ' min'}</div>
        <h3>${L.esc(s.name)}</h3>
        <p>${L.esc(s.blurb)}</p>
        <div class="foot">
          <span class="cost ${s.price == null ? 'enq' : ''}">${L.money(s.price)}${s.fixedGuests && s.price != null ? ' <small style="font-size:.8rem;color:var(--muted)">for 2</small>' : ''}</span>
          <a href="#book" class="btn btn-sm btn-ghost" data-book="${s.id}">Book</a>
        </div>
      </article>`).join('');
  }
  $('#menuTabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cat]');
    if (b) { activeCat = b.dataset.cat; renderMenu(); }
  });
  renderMenu();

  /* ---------- Booking flow ---------- */
  const state = { step: 1, serviceId: null, date: null, time: null };
  const panel = $('#panel');
  const svc = () => L.getServices().find((s) => s.id === state.serviceId);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-book]');
    if (!a) return;
    state.serviceId = a.dataset.book;
    state.time = null;
    go(2);
  });

  function go(step) { state.step = step; render(); }

  function renderSteps() {
    $$('#steps li').forEach((li) => {
      const n = Number(li.dataset.step);
      li.classList.toggle('on', n === state.step);
      li.classList.toggle('done', n < state.step || state.step === 4);
    });
    const s = svc();
    const rows = [];
    if (s) rows.push(['Treatment', `${L.esc(s.name)}<br><small>${s.offsite ? 'At your venue' : s.duration + ' min'} · ${L.money(s.price)}</small>`]);
    if (state.date) rows.push(['Date', L.prettyDate(state.date)]);
    if (state.time) rows.push(['Time', state.time]);
    $('#summary').innerHTML = rows.length
      ? rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')
      : '<dd style="color:var(--muted)">Pick a treatment to begin.</dd>';
  }

  function render() {
    renderSteps();
    if (state.step === 1) return renderServicePick();
    if (state.step === 2) return renderDateTime();
    if (state.step === 3) return renderDetails();
  }

  function renderServicePick() {
    const all = L.getServices().filter((s) => s.active !== false);
    let html = '<h3>Choose your treatment</h3><div class="svc-pick">';
    [...new Set(all.map((s) => s.cat))].forEach((c) => {
      html += `<div class="svc-group-label">${L.esc(c)}</div>`;
      all.filter((s) => s.cat === c).forEach((s) => {
        html += `<button type="button" class="svc-opt" data-id="${s.id}" aria-pressed="${s.id === state.serviceId}">
          <b>${L.esc(s.name)}</b><small>${s.offsite ? 'At your venue' : s.duration + ' min'} · ${L.money(s.price)}</small></button>`;
      });
    });
    html += '</div><div class="panel-actions"><span></span><button class="btn" id="next1" ' + (state.serviceId ? '' : 'disabled') + '>Continue</button></div>';
    panel.innerHTML = html;
    panel.querySelector('.svc-pick').addEventListener('click', (e) => {
      const b = e.target.closest('.svc-opt'); if (!b) return;
      state.serviceId = b.dataset.id; state.time = null; go(2);
    });
    $('#next1').addEventListener('click', () => go(2));
  }

  function renderDateTime() {
    const s = svc();
    if (!s) return go(1);
    const st = L.getSettings();
    const days = [];
    const base = new Date(); base.setHours(0, 0, 0, 0);
    for (let i = 0; i < st.daysAhead; i++) { const d = new Date(base); d.setDate(base.getDate() + i); days.push(L.toISO(d)); }
    const firstOpen = days.find((d) => L.availableSlots(d, s.id).length);
    if (!state.date || !days.includes(state.date)) state.date = firstOpen || days[0];

    const dateBtns = days.map((iso) => {
      const d = L.fromISO(iso);
      const none = !L.availableSlots(iso, s.id).length;
      return `<button type="button" class="date-opt" data-date="${iso}" aria-pressed="${iso === state.date}" ${none ? 'disabled' : ''} aria-label="${L.prettyDate(iso)}${none ? ', fully booked' : ''}">
        <div class="dw">${L.DAYS[d.getDay()].slice(0, 3)}</div><div class="dn">${d.getDate()}</div><div class="dm">${L.MONTHS[d.getMonth()]}</div></button>`;
    }).join('');

    const slots = L.availableSlots(state.date, s.id);
    if (state.time && !slots.includes(state.time)) state.time = null;
    const slotHtml = slots.length
      ? `<div class="slots">${slots.map((t) => `<button type="button" class="slot" data-time="${t}" aria-pressed="${t === state.time}">${t}</button>`).join('')}</div>`
      : `<div class="empty">No times left on this day. Please choose another date, or <a href="${L.waLink('Hi LaVee, do you have any availability for ' + s.name + ' on ' + L.prettyDate(state.date) + '?')}" target="_blank" rel="noopener">ask us on WhatsApp</a>.</div>`;

    panel.innerHTML = `
      <h3>Pick a date &amp; time</h3>
      <div class="dates" id="dates">${dateBtns}</div>
      <p style="font-size:.9rem;color:var(--muted);margin-bottom:.8rem">${L.prettyDate(state.date)}${s.offsite ? ' · arrival time at your venue' : ''}</p>
      ${slotHtml}
      <div class="panel-actions"><button class="btn btn-ghost" id="back2">Back</button><button class="btn" id="next2" ${state.time ? '' : 'disabled'}>Continue</button></div>`;

    const sel = panel.querySelector('.date-opt[aria-pressed="true"]');
    if (sel) sel.scrollIntoView({ block: 'nearest', inline: 'center' });
    $('#dates').addEventListener('click', (e) => {
      const b = e.target.closest('.date-opt'); if (!b || b.disabled) return;
      state.date = b.dataset.date; state.time = null; render();
    });
    const sl = panel.querySelector('.slots');
    if (sl) sl.addEventListener('click', (e) => {
      const b = e.target.closest('.slot'); if (!b) return;
      state.time = b.dataset.time; go(3);
    });
    $('#back2').addEventListener('click', () => go(1));
    $('#next2').addEventListener('click', () => go(3));
  }

  function renderDetails() {
    const s = svc();
    if (!s || !state.date || !state.time) return go(2);
    const minG = s.minGuests || 1;
    const guestField = s.fixedGuests
      ? `<label class="f">Guests<input value="2 people (couples package)" disabled></label>`
      : `<label class="f">Number of people<input type="number" name="guests" min="${minG}" max="30" value="${s.guests || 1}" required></label>`;
    panel.innerHTML = `
      <h3>Your details</h3>
      <form id="detailsForm" class="form-grid" novalidate>
        <label class="f">Full name<input name="name" autocomplete="name" required></label>
        <label class="f">Mobile / WhatsApp<input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. 082 123 4567" required></label>
        <label class="f">Email (optional)<input name="email" type="email" autocomplete="email"></label>
        ${guestField}
        ${s.offsite ? '<label class="f full">Venue address<input name="location" autocomplete="street-address" required placeholder="Where should we set up?"></label>' : ''}
        <label class="f full">Notes, add-ons or special requests<textarea name="notes" placeholder="e.g. add hot stones, pressure preference, injuries, occasion…"></textarea></label>
        <div class="full err" id="formErr" role="alert"></div>
      </form>
      <div class="panel-actions"><button class="btn btn-ghost" id="back3">Back</button><button class="btn" id="confirm">Request booking</button></div>`;
    $('#back3').addEventListener('click', () => go(2));
    $('#confirm').addEventListener('click', submit);
    $('#detailsForm').addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  }

  function submit() {
    const s = svc();
    const f = $('#detailsForm');
    const data = Object.fromEntries(new FormData(f).entries());
    const err = $('#formErr');
    const phoneDigits = (data.phone || '').replace(/\D/g, '');
    if (!data.name || data.name.trim().length < 2) return (err.textContent = 'Please enter your name.');
    if (phoneDigits.length < 9) return (err.textContent = 'Please enter a valid mobile number so we can confirm.');
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) return (err.textContent = 'That email address doesn\'t look right.');
    const guests = s.fixedGuests ? 2 : Number(data.guests || 1);
    if (s.minGuests && guests < s.minGuests) return (err.textContent = `This booking is for groups of ${s.minGuests} or more.`);
    if (s.offsite && !(data.location || '').trim()) return (err.textContent = 'Please tell us where to set up.');
    // Re-check the slot is still free
    if (!L.availableSlots(state.date, s.id).includes(state.time)) {
      err.textContent = 'Sorry, that time was just taken. Please pick another.';
      setTimeout(() => go(2), 1200);
      return;
    }
    const b = L.addBooking({
      serviceId: s.id, date: state.date, time: state.time, guests,
      name: data.name.trim(), phone: data.phone.trim(), email: (data.email || '').trim(),
      location: (data.location || '').trim(), notes: (data.notes || '').trim(),
    });
    showSuccess(b);
  }

  function showSuccess(b) {
    state.step = 4; renderSteps();
    const msg = `Hi LaVee! I've just requested a booking on your website.\n\nRef: ${b.ref}\nTreatment: ${b.serviceName}\nDate: ${L.prettyDate(b.date)} at ${b.time}\nGuests: ${b.guests}\nName: ${b.name}\nPhone: ${b.phone}${b.location ? '\nVenue: ' + b.location : ''}${b.notes ? '\nNotes: ' + b.notes : ''}`;
    panel.innerHTML = `
      <div class="success">
        <div class="seal">✓</div>
        <h3>Thank you, ${L.esc(b.name.split(' ')[0])}!</h3>
        <p>Your booking request has been received.</p>
        <div class="ref">${b.ref}</div>
        <p style="color:var(--muted);margin-top:.6rem">${L.esc(b.serviceName)} · ${L.prettyDate(b.date)} at ${b.time}</p>
        <p style="max-width:46ch;margin:1rem auto 0">Tap below to send your booking to us on WhatsApp. We'll confirm as soon as possible.</p>
        <div class="actions">
          <a class="btn btn-wa" href="${L.waLink(msg)}" target="_blank" rel="noopener"><svg width="18" height="18"><use href="#i-wa"/></svg> Send on WhatsApp</a>
          <button class="btn btn-ghost" id="again">Make another booking</button>
        </div>
      </div>`;
    $('#again').addEventListener('click', () => { Object.assign(state, { serviceId: null, date: null, time: null }); go(1); });
  }

  render();

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    $$('.reveal').forEach((el) => io.observe(el));
  } else { $$('.reveal').forEach((el) => el.classList.add('in')); }
})();
