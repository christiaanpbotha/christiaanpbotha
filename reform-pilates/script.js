(function () {
  // Leaf shadows over the hero: soft fronds, drawn once per resize.
  var c = document.getElementById('leaves');
  if (c) {
    var x = c.getContext('2d');
    var draw = function () {
      var s = 7, rnd = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      var r = window.devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
      c.width = w * r; c.height = h * r; x.setTransform(r, 0, 0, r, 0, 0); x.clearRect(0, 0, w, h);
      x.filter = 'blur(14px)'; x.fillStyle = x.strokeStyle = '#D8C7BF'; x.globalAlpha = .42;
      [[w * .02, -20, .9, 1.1], [w * .98, -30, 2.3, 1.2], [w * .9, h * .55, 2.9, .9], [w * .05, h * .75, .2, .8], [w * .75, -40, 1.7, .7]]
        .forEach(function (f) {
          var bx = f[0], by = f[1], ang = f[2], sc = f[3] * Math.min(1, w / 900 + .35), len = 380 * sc;
          var ex = bx + Math.cos(ang) * len, ey = by + Math.sin(ang) * len;
          x.lineWidth = 3; x.beginPath(); x.moveTo(bx, by);
          x.quadraticCurveTo(bx + Math.cos(ang + .2) * len * .5, by + Math.sin(ang + .2) * len * .5, ex, ey); x.stroke();
          for (var i = 2; i < 14; i++) {
            var t = i / 14, px = bx + (ex - bx) * t, py = by + (ey - by) * t;
            [-1, 1].forEach(function (sd) {
              var a = ang + sd * (.9 + rnd() * .3), L = (70 + rnd() * 40) * sc * (1 - t * .4);
              x.save(); x.translate(px, py); x.rotate(a); x.beginPath();
              x.ellipse(L / 2, 0, L / 2, (5 + rnd() * 6) * sc + 2, rnd() * .15, 0, Math.PI * 2); x.fill(); x.restore();
            });
          }
        });
      x.filter = 'none'; x.globalAlpha = 1;
    };
    draw();
    var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(draw, 120); });
  }

  // Language toggle (EN / AF)
  var btns = document.querySelectorAll('.lang button');
  function setLang(l) {
    document.documentElement.lang = l;
    document.querySelectorAll('[data-en]').forEach(function (el) { el.textContent = el.getAttribute('data-' + l); });
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === l)); });
    try { localStorage.setItem('reform-lang', l); } catch (e) {}
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });
  try { if (localStorage.getItem('reform-lang') === 'af') setLang('af'); } catch (e) {}

  // Nav border on scroll
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('scrolled', scrollY > 8); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
