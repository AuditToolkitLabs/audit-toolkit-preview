/*!
 * releases.js — shared renderer for the per-product release pages.
 *
 * Replaces the inline script that was duplicated across all 11 *-releases.html
 * pages. The visible change is that release assets are no longer one flat
 * "Downloads (N)" table: they are grouped into the product / documentation /
 * evidence / integrity sections promised by how-we-certify.html step 8
 * ("You get the binary — and its proof").
 *
 * Usage (after nav.js and marked.min.js):
 *   <script src="assets/js/releases.js?v=..."></script>
 *   <script>AuditToolkitReleases.init({ dataUrl: "releases/data/<slug>.json" });</script>
 *
 * Depends on: marked (for release-note markdown). Degrades to plain text if absent.
 */
(function (global) {
  "use strict";

  // ── Asset classification ────────────────────────────────────────────────
  // Mirrors _asset_kind() in ci/sync-releases.py. The pipeline writes a "kind"
  // field per asset, but older releases/data/*.json predate it, so we classify
  // client-side whenever it is missing. Keep the two implementations in step.
  var PRODUCT_SUFFIXES = [
    ".msi", ".exe", ".deb", ".rpm", ".pkg", ".dmg", ".appimage",
    ".whl", ".zip", ".tar.gz", ".tgz", ".tar.xz", ".tar.bz2"
  ];
  var INTEGRITY_SUFFIXES = [
    ".asc", ".sig", ".sig.gz", ".sha256", ".sha512",
    ".pem", ".cer", ".cert", ".crt"
  ];
  var INTEGRITY_NAMES = ["keys", "sha256sums", "sha512sums", "checksums"];
  var EVIDENCE_MARKERS = [
    "sbom", ".cdx.json", ".spdx.json", "sarif", "vulnerability",
    "evidence-manifest", "release-evidence", "unit-test-results", "coverage",
    "release-decision", "static-analysis", "validation-report",
    "verification", "build-report"
  ];

  function endsWithAny(s, list) {
    for (var i = 0; i < list.length; i++) {
      if (s.length >= list[i].length && s.indexOf(list[i], s.length - list[i].length) !== -1) {
        return true;
      }
    }
    return false;
  }

  function containsAny(s, list) {
    for (var i = 0; i < list.length; i++) { if (s.indexOf(list[i]) !== -1) return true; }
    return false;
  }

  function assetKind(name) {
    var n = String(name || "").toLowerCase();
    // Integrity first: a ".deb.asc" is a signature, not a package.
    if (endsWithAny(n, INTEGRITY_SUFFIXES)) return "integrity";
    if (INTEGRITY_NAMES.indexOf(n) !== -1) return "integrity";
    if (containsAny(n, ["sha256sums", "sha512sums", "checksums"])) return "integrity";
    // Docs bundles before product suffixes — a docs pack is also a .tar.gz.
    // "release-notes" is matched before the evidence markers so it cannot be
    // confused with "release-evidence"; both start "release-".
    if (n.indexOf("customer-docs") !== -1 || n.indexOf("-docs-") !== -1 ||
        n.indexOf("docs-") === 0) return "docs";
    if (n.indexOf("release-notes") !== -1 || n.indexOf("changelog") !== -1) return "docs";
    if (containsAny(n, EVIDENCE_MARKERS)) return "evidence";
    if (endsWithAny(n, PRODUCT_SUFFIXES)) return "product";
    return "other";
  }

  // Section order and wording. Labels track how-we-certify.html — change both
  // together or the page will promise something the release does not show.
  var SECTIONS = [
    {
      kind: "product",
      title: "Product downloads",
      blurb: "The installable release artifacts."
    },
    {
      kind: "docs",
      title: "Documentation",
      blurb: "Release notes and customer documentation for this release."
    },
    {
      kind: "evidence",
      title: "Release evidence",
      blurb: "The signed Release Evidence Pack — SBOM, scans, tests and gate decision. " +
             "See <a href=\"how-we-certify.html\">how we certify releases</a>."
    },
    {
      kind: "integrity",
      title: "Integrity &amp; signatures",
      blurb: "Checksums and detached GPG signatures for verifying every file above."
    },
    {
      kind: "other",
      title: "Additional files",
      blurb: ""
    }
  ];

  // ── Small helpers ───────────────────────────────────────────────────────
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function fmtSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    var u = ["B", "KB", "MB", "GB"], i = 0, n = bytes;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (i === 0 ? n : n.toFixed(1)) + " " + u[i];
  }

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function renderMarkdown(md) {
    if (global.marked && typeof global.marked.parse === "function") {
      return global.marked.parse(md);
    }
    var p = el("p");
    p.textContent = md;
    return p.outerHTML;
  }

  // ── Asset grouping ──────────────────────────────────────────────────────
  // Detached signatures are folded onto the row of the file they sign, rather
  // than occupying a row of their own — on a typical release they are half the
  // assets and carry no standalone meaning. An .asc whose subject is not in the
  // same release still gets its own row under Integrity, so nothing is hidden.
  function groupAssets(assets) {
    var byName = {}, i;
    for (i = 0; i < assets.length; i++) byName[assets[i].name] = assets[i];

    var sigFor = {};   // subject name -> signature asset
    var folded = {};   // signature name -> true (suppressed as its own row)
    for (i = 0; i < assets.length; i++) {
      var nm = assets[i].name;
      if (nm.length > 4 && nm.slice(-4).toLowerCase() === ".asc") {
        var subject = nm.slice(0, -4);
        if (byName[subject]) { sigFor[subject] = assets[i]; folded[nm] = true; }
      }
    }

    var buckets = {};
    for (i = 0; i < SECTIONS.length; i++) buckets[SECTIONS[i].kind] = [];
    for (i = 0; i < assets.length; i++) {
      var a = assets[i];
      if (folded[a.name]) continue;
      var kind = a.kind || assetKind(a.name);
      if (!buckets[kind]) kind = "other";
      buckets[kind].push({ asset: a, sig: sigFor[a.name] || null });
    }
    return buckets;
  }

  function renderAssetRow(entry) {
    var a = entry.asset;
    var tr = document.createElement("tr");

    var nameTd = el("td", "rel-asset-name");
    nameTd.textContent = a.name;
    if (entry.sig) {
      var sigWrap = el("span", "rel-asset-sig");
      if (entry.sig.download_url) {
        var sigLink = el("a");
        sigLink.href = entry.sig.download_url;
        sigLink.textContent = "signature";
        sigLink.setAttribute("rel", "noopener");
        sigLink.title = entry.sig.name;
        sigWrap.appendChild(sigLink);
      } else {
        sigWrap.textContent = "signature";
        sigWrap.title = entry.sig.name;
      }
      nameTd.appendChild(sigWrap);
    }

    var sizeTd = el("td", "rel-asset-size");
    sizeTd.textContent = fmtSize(a.size);

    var dlTd = el("td", "rel-asset-dl");
    if (a.download_url) {
      var link = el("a", "btn btn-secondary btn-sm");
      link.href = a.download_url;
      link.textContent = "Download";
      link.setAttribute("rel", "noopener");
      dlTd.appendChild(link);
    } else {
      dlTd.appendChild(el("span", "muted", "—"));
    }

    tr.appendChild(nameTd);
    tr.appendChild(sizeTd);
    tr.appendChild(dlTd);
    return tr;
  }

  function renderSection(section, entries) {
    var wrap = el("div", "rel-asset-group");
    wrap.appendChild(el("h4", null, section.title + " (" + entries.length + ")"));
    if (section.blurb) wrap.appendChild(el("p", "rel-asset-blurb", section.blurb));
    var table = el("table", "rel-asset-table");
    var tbody = document.createElement("tbody");
    for (var i = 0; i < entries.length; i++) tbody.appendChild(renderAssetRow(entries[i]));
    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function renderAssets(assets) {
    var buckets = groupAssets(assets);
    var wrap = el("div", "rel-assets");
    var renderedAny = false;

    for (var i = 0; i < SECTIONS.length; i++) {
      var section = SECTIONS[i];
      var entries = buckets[section.kind];
      if (!entries.length) continue;
      wrap.appendChild(renderSection(section, entries));
      renderedAny = true;
    }

    // State this plainly rather than letting an evidence-only release look like
    // a full one. It is the honest reading of a release that has been cut but
    // whose installable artifacts have not been attached.
    if (!buckets.product.length && renderedAny) {
      wrap.insertBefore(
        el("p", "rel-asset-note",
           "No installable artifacts are attached to this release. " +
           "The files below are release evidence and verification material."),
        wrap.firstChild
      );
    }
    return wrap;
  }

  // ── Release + page rendering ────────────────────────────────────────────
  function renderRelease(r) {
    var card = el("div", "rel-card");
    var header = el("div", "rel-card-header");
    header.appendChild(el("span", "rel-tag", r.tag));
    if (r.name && r.name !== r.tag) header.appendChild(el("span", "rel-name", r.name));
    if (r.prerelease) header.appendChild(el("span", "badge rel-prerelease", "Pre-release"));
    var meta = "Released " + fmtDate(r.published_at);
    if (r.author) meta += " · " + r.author;
    header.appendChild(el("span", "rel-meta", meta));
    card.appendChild(header);

    if (r.body_md) card.appendChild(el("div", "rel-body", renderMarkdown(r.body_md)));
    if (r.assets && r.assets.length) card.appendChild(renderAssets(r.assets));
    return card;
  }

  function init(opts) {
    opts = opts || {};
    var dataUrl = opts.dataUrl;
    var listEl = document.getElementById(opts.listId || "rel-list");
    var badgesEl = document.getElementById(opts.badgesId || "rel-hero-badges");
    if (!dataUrl || !listEl) return;

    fetch(dataUrl, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        var releases = data.releases || [];
        if (badgesEl) {
          if (data.latest) {
            badgesEl.appendChild(el("span", "badge badge-green", "Latest: " + data.latest));
          }
          badgesEl.appendChild(el("span", "badge badge-muted", releases.length + " releases"));
          if (data.generated_at) {
            badgesEl.appendChild(el("span", "badge badge-muted", "Synced " + fmtDate(data.generated_at)));
          }
        }
        listEl.innerHTML = "";
        if (!releases.length) {
          listEl.appendChild(el("p", "rel-status", "No releases published yet."));
          return;
        }
        for (var i = 0; i < releases.length; i++) {
          listEl.appendChild(renderRelease(releases[i]));
        }
      })
      .catch(function (err) {
        listEl.innerHTML =
          '<p class="rel-status rel-error">Could not load release data (' + err.message + ").</p>";
      });
  }

  global.AuditToolkitReleases = {
    init: init,
    assetKind: assetKind,
    groupAssets: groupAssets,
    SECTIONS: SECTIONS
  };
}(window));
