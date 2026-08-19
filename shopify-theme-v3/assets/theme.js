/* ============================================================================
   socal labs — THEME JS  v4
   Motion is opt-out-able: every effect checks prefers-reduced-motion.
   No scroll-linked layout writes anywhere (see design-guidelines §6).
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------- Sticky header */
  var header = document.querySelector('[data-header]');
  if (header) {
    var tick = false;
    var onScroll = function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 10);
        tick = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------- Dropdowns (keyboard-safe) */
  var items = [].slice.call(document.querySelectorAll('[data-nav-item]'));

  function closeAll(except) {
    items.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var t = item.querySelector('[data-nav-trigger]');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  items.forEach(function (item) {
    var trigger = item.querySelector('[data-nav-trigger]');
    if (!trigger) return;
    var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');

    function open(state) {
      item.classList.toggle('is-open', state);
      trigger.setAttribute('aria-expanded', String(state));
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var next = !item.classList.contains('is-open');
      closeAll(item);
      open(next);
    });
    item.addEventListener('mouseenter', function () { if (hoverable.matches) { closeAll(item); open(true); } });
    item.addEventListener('mouseleave', function () { if (hoverable.matches) open(false); });
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) open(false); });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-nav-item]')) closeAll(null);
  });

  /* ------------------------------------------------------- Mobile menu */
  var burger = document.querySelector('[data-mobile-toggle]');
  var mobile = document.querySelector('[data-mobile-menu]');

  function toggleMobile(state) {
    if (!burger || !mobile) return;
    mobile.classList.toggle('is-open', state);
    burger.setAttribute('aria-expanded', String(state));
    burger.setAttribute('aria-label', state ? 'Close menu' : 'Open menu');
    if (state) { var f = mobile.querySelector('a'); if (f) f.focus(); }
    else burger.focus();
  }
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      toggleMobile(!mobile.classList.contains('is-open'));
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('[data-nav-item].is-open');
    if (open) {
      var t = open.querySelector('[data-nav-trigger]');
      open.classList.remove('is-open');
      if (t) { t.setAttribute('aria-expanded', 'false'); t.focus(); }
      return;
    }
    if (mobile && mobile.classList.contains('is-open')) toggleMobile(false);
  });

  /* -------------------------------------------------- Announcement bar */
  var ann = document.querySelector('[data-announcement]');
  if (ann) {
    var KEY = 'socal:ann';
    try { if (sessionStorage.getItem(KEY) === '1') ann.hidden = true; } catch (e) {}
    var x = ann.querySelector('[data-announcement-dismiss]');
    if (x) x.addEventListener('click', function () {
      ann.hidden = true;
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    });
  }

  /* ------------------------------------------------------- Marquee loop
     Duplicate the group once so the -50% translate loops seamlessly. Doing
     it in JS keeps the Liquid readable and the DOM honest if JS is off
     (you just get a static, non-scrolling strip — still legible). */
  document.querySelectorAll('[data-marquee]').forEach(function (m) {
    var group = m.querySelector('.marquee-group');
    if (!group) return;
    var clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    group.parentNode.appendChild(clone);
  });

  /* ---------------------------------------------------- Reveal on scroll */
  var targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reduce || !('IntersectionObserver' in window)) {
    [].forEach.call(targets, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    [].forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------ Process flow
     One class toggle per flow; CSS does the sequencing via transition-delay.
     Under reduced motion the CSS lands everything in its final state, so we
     still add the class — it just doesn't animate. */
  var flows = document.querySelectorAll('[data-flow]');
  if (!('IntersectionObserver' in window)) {
    [].forEach.call(flows, function (f) { f.classList.add('is-flowing'); });
  } else {
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-flowing');
        fio.unobserve(en.target);
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -80px 0px' });
    [].forEach.call(flows, function (f) { fio.observe(f); });
  }

  /* ----------------------------------------------------- Showcase 3D tilt */
  var scene = document.querySelector('[data-tilt-scene]');
  var tiltEl = document.querySelector('[data-tilt]');
  if (scene && tiltEl && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var tRaf = 0;
    scene.addEventListener('pointermove', function (e) {
      cancelAnimationFrame(tRaf);
      tRaf = requestAnimationFrame(function () {
        var r = scene.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        tiltEl.style.transform = 'rotateY(' + (x * 16) + 'deg) rotateX(' + (y * -12) + 'deg)';
      });
    });
    scene.addEventListener('pointerleave', function () {
      cancelAnimationFrame(tRaf);
      tiltEl.style.transform = '';
    });
  }

  /* ------------------------------------------------ Testimonial carousel */
  [].forEach.call(document.querySelectorAll('[data-quote-rail]'), function (wrap) {
    var rail = wrap.querySelector('.quote-rail');
    var prev = wrap.querySelector('.quote-nav .prev');
    var next = wrap.querySelector('.quote-nav .next');
    if (!rail || !prev || !next) return;
    function step() {
      var card = rail.querySelector('.quote, .tile, a');
      return card ? card.getBoundingClientRect().width + 20 : 400;
    }
    function sync() {
      var max = rail.scrollWidth - rail.clientWidth;
      var nav = wrap.querySelector('.quote-nav');
      if (nav) nav.style.display = max < 10 ? 'none' : 'flex';
      prev.disabled = rail.scrollLeft < 10;
      next.disabled = rail.scrollLeft > max - 10;
    }
    window.addEventListener('resize', function () { requestAnimationFrame(sync); });
    prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
    rail.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
    sync();
  });

  /* ------------------------------------------------------- Work: load more */
  [].forEach.call(document.querySelectorAll('[data-load-more]'), function (btn) {
    btn.addEventListener('click', function () {
      var grid = document.querySelector(btn.getAttribute('data-load-more'));
      if (grid) grid.classList.add('is-expanded');
      btn.closest('[data-load-more-wrap]').remove();
    });
  });

  /* -------------------------------------------------- Word cycle (hero) */
  var cycle = document.querySelector('[data-cycle]');
  if (cycle && !reduce) {
    var words = [].slice.call(cycle.querySelectorAll('.cycle-word'));
    if (words.length > 1) {
      var wi = 0;
      setInterval(function () {
        var prev = words[wi];
        wi = (wi + 1) % words.length;
        var next = words[wi];
        prev.classList.remove('is-on'); prev.classList.add('is-off');
        prev.setAttribute('aria-hidden', 'true');
        next.classList.remove('is-off'); next.classList.add('is-on');
        next.setAttribute('aria-hidden', 'false');
        setTimeout(function () { prev.classList.remove('is-off'); }, 560);
      }, wi === words.length - 1 ? 3200 : 2200);
    }
  }

  /* -------------------------------------------- Cursor glow + magnetic CTAs */
  var glow = document.querySelector('[data-hero-glow]');
  var heroEl = glow && glow.closest('.hero');
  if (glow && heroEl && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var gx = 0, gy = 0, pending = false;
    heroEl.addEventListener('pointermove', function (e) {
      var r = heroEl.getBoundingClientRect();
      gx = e.clientX - r.left; gy = e.clientY - r.top;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
        pending = false;
      });
    });
  }
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    [].forEach.call(document.querySelectorAll('[data-magnetic]'), function (el) {
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          var r = el.getBoundingClientRect();
          var dx = (e.clientX - r.left - r.width / 2) * 0.18;
          var dy = (e.clientY - r.top - r.height / 2) * 0.28;
          el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        });
      });
      el.addEventListener('pointerleave', function () {
        cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------- Scroll progress */
  if (!reduce) {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var pTick = false;
    var onProgress = function () {
      if (pTick) return;
      pTick = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
        pTick = false;
      });
    };
    onProgress();
    window.addEventListener('scroll', onProgress, { passive: true });
    window.addEventListener('resize', onProgress);
  }

  /* ------------------------------------------------------ Scroll to top */
  var scrollTopBtn = document.querySelector('[data-scroll-top]');
  if (scrollTopBtn) {
    var topTick = false;
    var showTopAt = 420;

    function syncScrollTop() {
      var show = window.scrollY > showTopAt;
      scrollTopBtn.hidden = !show;
      scrollTopBtn.classList.toggle('is-visible', show);
    }

    function onTopScroll() {
      if (topTick) return;
      topTick = true;
      requestAnimationFrame(function () {
        syncScrollTop();
        topTick = false;
      });
    }

    syncScrollTop();
    window.addEventListener('scroll', onTopScroll, { passive: true });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* --------------------------------------------- Hero line reveal on load */
  var heroReveal = document.querySelector('[data-hero-reveal]');
  if (heroReveal) {
    if (reduce) heroReveal.classList.add('is-in');
    else requestAnimationFrame(function () {
      requestAnimationFrame(function () { heroReveal.classList.add('is-in'); });
    });
  }
})();

/* App Store phone — staged reveal + gentle scroll parallax (v11) */
(function () {
  var secs = [].slice.call(document.querySelectorAll('[data-asp]'));
  if (!secs.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('asp-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.3 });
    secs.forEach(function (s) { io.observe(s); });
  } else {
    secs.forEach(function (s) { s.classList.add('asp-in'); });
  }

  if (reduce) return;
  var devices = [].slice.call(document.querySelectorAll('[data-asp] .asp-device'));
  if (!devices.length) return;
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var vh = window.innerHeight;
      devices.forEach(function (d) {
        var r = d.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) return;
        var mid = r.top + r.height / 2;
        var p = (mid - vh / 2) / (vh / 2);           /* -1 .. 1 through viewport centre */
        d.style.transform = 'translateY(' + (p * 16).toFixed(1) + 'px)';
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
