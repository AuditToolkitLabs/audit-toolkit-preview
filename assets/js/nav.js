/* AuditToolkit Labs — Site Navigation & Interaction */

(function () {
  'use strict';

  /* ── Mobile hamburger ─────────────────────────────── */
  var btn  = document.getElementById('nav-hamburger');
  var menu = document.getElementById('nav-mobile');

  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? '\u2715' : '\u2630';
    });

    /* Close mobile menu on any nav link click */
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = '\u2630';
      });
    });
  }

  /* ── Active link — cross-page ─────────────────────── */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0];
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Active link — on-page scroll (index only) ────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinks.length && typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ── Smooth anchor offset for sticky nav ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id  = a.getAttribute('href').slice(1);
      var el  = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Stripe checkout hardening ────────────────────── */
  var LIVE_CHECKOUT_HOST = 'checkout.audittoolkitlabs.com';
  var TEST_HINT_RE = /(mode=test|livemode=false|pk_test|sk_test|test[_-]?mode|test_clock)/i;

  function parseUrl(href) {
    try {
      return new URL(href, window.location.href);
    } catch (_err) {
      return null;
    }
  }

  function isStripeRelated(url) {
    if (!url) return false;
    if (url.hostname === LIVE_CHECKOUT_HOST) return true;
    return /(^|\.)stripe\.com$/i.test(url.hostname);
  }

  function isAllowedLiveCheckout(url) {
    if (!url) return false;
    if (url.protocol !== 'https:') return false;
    if (url.hostname !== LIVE_CHECKOUT_HOST) return false;

    var combined = (url.pathname || '') + (url.search || '') + (url.hash || '');
    if (TEST_HINT_RE.test(combined)) return false;

    return true;
  }

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!link) return;

    var href = link.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return;

    var url = parseUrl(href);
    if (!isStripeRelated(url)) return;

    if (!isAllowedLiveCheckout(url)) {
      e.preventDefault();
      alert('Checkout is temporarily unavailable. Please use the official live checkout on checkout.audittoolkitlabs.com.');
    }
  }, true);

}());
