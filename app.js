/* Allegro — interactions */
(function() {
  var prog = document.getElementById('progress');
  function updateProgress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (prog && h > 0) prog.style.width = ((window.scrollY / h) * 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* count-up */
  var nums = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && nums.length) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        var dur = 1200, start = performance.now();
        function frame(ts) {
          var p = Math.min((ts - start) / dur, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(ease * target);
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach(function(el) { io.observe(el); });
  }

  /* contact form */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(ev) {
      ev.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var type = document.getElementById('type').value;
      var msg = document.getElementById('msg').value.trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !ok || !msg) return;

      var subject = 'New enquiry from ' + name;
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nLooking for: ' + type + '\n\n' + msg;

      window.location.href = 'mailto:AllegroIoT@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      document.getElementById('formOk').classList.add('show');
    });
  }
})();
