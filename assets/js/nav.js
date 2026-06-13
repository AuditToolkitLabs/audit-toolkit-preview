/* AuditToolkit Labs — Site Navigation & Interaction */

(function () {
  "use strict";

  var path = window.location.pathname.split("/").pop() || "index.html";

  /* ── Global nav normalization (large menu on every page) ── */
  var NAV_LINKS = [
    { href: "index.html#products", label: "Products" },
    { href: "script-coverage.html", label: "Coverage" },
    { href: "regulated-industries.html", label: "Regulated" },
    { href: "toolkit-overview.html", label: "Overview" },
    { href: "how-it-works.html", label: "How It Works" },
    { href: "use-cases.html", label: "Use Cases" },
    { href: "integrations.html", label: "Integrations" },
    { href: "docs.html", label: "Documentation" },
    { href: "releases.html", label: "Releases" },
    { href: "licensing.html", label: "Licensing" },
    { href: "support.html", label: "Support" }
  ];

  function normalizeNavigation() {
    var brandText = document.querySelector(".nav-brand span:last-child");
    var navLinks = document.querySelector(".nav-links");
    var navCta = document.querySelector(".nav-cta");
    var mobile = document.getElementById("nav-mobile");

    if (brandText) {
      brandText.textContent = "AuditToolkit Labs";
    }

    if (navLinks) {
      navLinks.innerHTML = NAV_LINKS.map(function (item) {
        return '<li><a href="' + item.href + '">' + item.label + "</a></li>";
      }).join("");
    }

    if (navCta) {
      navCta.innerHTML = '<a href="support.html#contact" class="btn btn-primary btn-sm">Contact Us</a>';
    }

    if (mobile) {
      mobile.innerHTML =
        NAV_LINKS.map(function (item) {
          return '<a href="' + item.href + '">' + item.label + "</a>";
        }).join("") + '<a href="support.html#contact" class="nav-mobile-contact">Contact Us</a>';
    }
  }

  function setPageFamily() {
    var body = document.body;
    if (!body) return;

    var familyMap = {
      home: ["index.html"],
      product: ["audit-toolkit.html", "cmdb-tool.html", "cmdb-asset-platform.html", "linux-expansion.html", "secure-exposure-centre.html"],
      pricing: ["price.html", "pricing.html", "licensing.html"],
      docs: ["docs.html", "doc-viewer.html", "doc-tools.html", "brand-assets.html"],
      release: [
        "releases.html",
        "audit-toolkit-releases.html",
        "cmdb-api-releases.html",
        "cmdb-asset-platform-releases.html",
        "linux-security-lite-releases.html",
        "secure-exposure-centre-releases.html"
      ],
      support: ["support.html", "success.html", "cancel.html"],
      operations: [
        "how-it-works.html",
        "use-cases.html",
        "integrations.html",
        "script-coverage.html",
        "regulated-industries.html",
        "remediation.html",
        "toolkit-overview.html"
      ]
    };

    var family = "generic";
    Object.keys(familyMap).some(function (key) {
      if (familyMap[key].indexOf(path) !== -1) {
        family = key;
        return true;
      }
      return false;
    });

    body.classList.add("page-family-" + family);
  }

  setPageFamily();
  normalizeNavigation();

  /* ── Mobile hamburger ─────────────────────────────── */
  var btn = document.getElementById("nav-hamburger");
  var menu = document.getElementById("nav-mobile");

  if (btn && menu) {
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "\u2715" : "\u2630";
    });

    /* Close mobile menu on any nav link click */
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "\u2630";
      });
    });
  }

  /* ── Active link — cross-page ─────────────────────── */
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("#")[0];
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ── Active link — on-page scroll (index only) ────── */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinks.length && typeof IntersectionObserver !== "undefined") {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
            });
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );

    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ── Smooth anchor offset for sticky nav ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ── Stripe checkout hardening ────────────────────── */
  var LIVE_CHECKOUT_HOST = "checkout.audittoolkitlabs.com";
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
    if (url.protocol !== "https:") return false;
    if (url.hostname !== LIVE_CHECKOUT_HOST && url.hostname !== "buy.stripe.com") return false;

    var combined = (url.pathname || "") + (url.search || "") + (url.hash || "");
    if (TEST_HINT_RE.test(combined)) return false;

    return true;
  }

  document.addEventListener(
    "click",
    function (e) {
      var link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;

      var href = link.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return;

      var url = parseUrl(href);
      if (!isStripeRelated(url)) return;

      if (!isAllowedLiveCheckout(url)) {
        e.preventDefault();
        alert("Checkout is temporarily unavailable. Please use the official live checkout on checkout.audittoolkitlabs.com.");
      }
    },
    true
  );
})();
