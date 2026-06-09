/* Allegro Web — interactions v4 (futuristic) */
(function () {

  /* ---- scroll progress bar ---- */
  var pbar = document.getElementById('progress-bar');
  function updateProgress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (pbar && h > 0) pbar.style.width = ((window.scrollY / h) * 100) + '%';
  }

  /* ---- nav shadow on scroll ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 12);
    updateProgress();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- cursor glow ---- */
  var cg = document.getElementById('cursor-glow');
  if (cg) {
    window.addEventListener('mousemove', function (e) {
      cg.style.left = e.clientX + 'px';
      cg.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  /* ---- count-up animation ---- */
  function countUp(el) {
    var target  = parseInt(el.getAttribute('data-count'), 10);
    var suffix  = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    var dur = 1400, start = performance.now();
    function frame(ts) {
      var p = Math.min((ts - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) { requestAnimationFrame(frame); }
      else { el.textContent = target + suffix; el.classList.add('count-flash'); }
    }
    requestAnimationFrame(frame);
  }
  var countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && countEls.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.8 });
    countEls.forEach(function (el) { cio.observe(el); });
  }

  /* ---- scroll reveals ---- */
  var reveals = document.querySelectorAll('.reveal');
  function revealAll() { reveals.forEach(function (el) { el.classList.add('in'); }); }

  /* hero reveals immediately */
  document.querySelectorAll('.hero .reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i * 80) + 'ms';
    el.classList.add('in');
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var siblings = Array.from(e.target.parentNode.querySelectorAll(':scope > .reveal'));
        var idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = Math.max(0, idx) * 75 + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    setTimeout(revealAll, 1800); /* safety net */
  } else {
    revealAll();
  }

  /* contact form — mailto */
  var form = document.getElementById('contactForm');
  var ok   = document.getElementById('formOk');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name  = document.getElementById('f-name').value.trim();
      var email = document.getElementById('f-email').value.trim();
      var type  = document.getElementById('f-type').value;
      var msg   = document.getElementById('f-msg').value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      /* inline validation */
      [['f-name', !!name], ['f-email', emailOk], ['f-msg', !!msg]].forEach(function (p) {
        document.getElementById(p[0]).style.borderColor = p[1] ? '' : 'var(--coral)';
      });
      if (!name || !emailOk || !msg) return;

      var subject = 'New enquiry from ' + name + ' — Allegro Web';
      var body =
        'Name: '         + name  + '\n' +
        'Email: '        + email + '\n' +
        'Looking for: '  + type  + '\n\n' +
        msg + '\n';

      window.location.href =
        'mailto:ElestroWEB@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body='    + encodeURIComponent(body);

      ok.classList.add('show');
    });

    ['f-name', 'f-email', 'f-msg'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { el.style.borderColor = ''; });
    });
  }

})();
