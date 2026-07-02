#!/usr/bin/env python3
"""Mirror Gitea releases to the website, using GitHub Releases as the public hub.

Runs on the machine that can reach the private Gitea server (loopback at
http://localhost:3000). Two jobs:

1. METADATA SYNC (default): read release attributes via the Gitea API and write
   sanitized, source-free JSON into ``releases/data/`` for the data-driven
   ``*-releases.html`` pages. A release's assets only receive a public
   ``download_url`` once that release exists on the GitHub hub, so links are
   never broken.

2. GITHUB PUBLISH (``--publish-github``): download a release's binaries from
   Gitea and (re)publish them to the PUBLIC GitHub Releases hub
   (``AuditToolkitLabs/releases``) under a per-product namespaced tag
   ``<slug>-<tag>`` (e.g. ``storage-intelligence-platform-v1.0.17``). This is
   where customers download. The Gitea (loopback) URLs never reach the site.

Usage (on the Gitea host):

    export GITEA_TOKEN=<read-only Gitea token>     # scope: read:repository
    # gh CLI must be authenticated with 'repo' scope for --publish-github

    python ci/sync-releases.py --product storage-intelligence-platform --tag v1.0.17 --publish-github
    python ci/sync-releases.py                       # metadata-only refresh (all products)
    python ci/sync-releases.py --check               # CI guard: fail if data is stale

Then commit releases/data/ and push — GitHub Pages serves it.
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCES_FILE = REPO_ROOT / "releases" / "releases-sources.json"
DATA_DIR = REPO_ROOT / "releases" / "data"


def _utcnow_iso() -> str:
    return _dt.datetime.now(_dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _gh_tag(slug: str, tag: str) -> str:
    """Namespaced GitHub tag so products don't collide in one hub repo."""
    return f"{slug}-{tag}"


# ── Gitea API ──────────────────────────────────────────────────────────────
def _gitea_token() -> str:
    token = os.environ.get("GITEA_TOKEN", "").strip()
    if not token:
        raise SystemExit("GITEA_TOKEN is not set. Export a read-only Gitea token first.")
    return token


def _api_get(url: str, token: str) -> object:
    req = urllib.request.Request(url, headers={
        "Authorization": f"token {token}",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")[:300]
        raise SystemExit(f"Gitea API {exc.code} for {url}\n  {body}")
    except urllib.error.URLError as exc:
        raise SystemExit(
            f"Could not reach Gitea at {url}: {exc}\n"
            "  This script must run on the host that can reach the Gitea server."
        )


def _fetch_raw_releases(cfg: dict, product: dict, token: str) -> list:
    base = cfg["gitea_base_url"].rstrip("/")
    url = f"{base}/api/v1/repos/{cfg['org']}/{product['repo']}/releases?limit=50"
    raw = _api_get(url, token)
    if not isinstance(raw, list):
        raise SystemExit(f"Unexpected API response for {product['repo']}")
    rels = [r for r in raw if not r.get("draft")]
    # Per-product opt-in: surface only stable (GA) releases on the site, e.g. a
    # product whose only history is one GA plus an internal RC. Gitea keeps the
    # full set; the RC just never mirrors, publishes, or shows — and the nightly
    # auto-publish won't re-add it.
    if product.get("exclude_prereleases"):
        rels = [r for r in rels if not r.get("prerelease")]
    return rels


def _download(url: str, token: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"Authorization": f"token {token}"})
    with urllib.request.urlopen(req, timeout=300) as resp, open(dest, "wb") as fh:
        shutil.copyfileobj(resp, fh, length=1024 * 256)


# ── GitHub hub (gh CLI) ────────────────────────────────────────────────────
def _gh(args: list, **kw) -> subprocess.CompletedProcess:
    return subprocess.run(["gh", *args], text=True, capture_output=True, **kw)


def _gh_existing_tags(repo: str) -> set:
    res = _gh(["release", "list", "-R", repo, "--limit", "200",
               "--json", "tagName", "-q", ".[].tagName"])
    if res.returncode != 0:
        # gh missing / unauthenticated: links simply won't populate.
        return set()
    return {ln.strip() for ln in res.stdout.splitlines() if ln.strip()}


def _gh_release_exists(gh_tag: str, repo: str, attempts: int = 3) -> bool:
    """True if the release exists on the hub, False if it definitively does not.

    Distinguishes a genuine 404 ('release not found') from a transient failure
    (network blip / timeout / 5xx / rate limit). On a transient failure we retry
    with backoff, and if it persists we raise rather than guess. Guessing
    'absent' would trigger a needless re-download and — worse — abort the whole
    run when the follow-up ``gh release create`` hits the same blip, skipping
    every product after it.
    """
    last_stderr = ""
    for attempt in range(attempts):
        res = _gh(["release", "view", gh_tag, "-R", repo])
        if res.returncode == 0:
            return True
        last_stderr = (res.stderr or "").strip()
        if "release not found" in last_stderr.lower():
            return False  # definitive 404 — safe to (re)create
        if attempt < attempts - 1:
            time.sleep(2 * (attempt + 1))  # 2s, 4s backoff for transient errors
    raise SystemExit(
        f"Could not determine hub state for {gh_tag} after {attempts} tries "
        f"(transient GitHub error, not a 404):\n  {last_stderr}\n"
        "  Re-run once GitHub API connectivity is stable; published tags are skipped."
    )


def _keep_gh_tags(product, releases_raw, keep: int) -> set:
    """gh tags for the newest `keep` releases (the retention window)."""
    ordered = sorted(
        releases_raw,
        key=lambda r: r.get("published_at") or r.get("created_at") or "",
        reverse=True,
    )
    return {_gh_tag(product["slug"], r.get("tag_name", "")) for r in ordered[:keep]}


def prune_github(cfg, product, releases_raw, keep: int) -> list:
    """Delete GitHub releases for this product outside the newest-`keep` window."""
    repo = cfg["github_repo"]
    prefix = f"{product['slug']}-"
    keep_set = _keep_gh_tags(product, releases_raw, keep)
    existing = {t for t in _gh_existing_tags(repo) if t.startswith(prefix)}
    stale = sorted(existing - keep_set)
    for gh_tag in stale:
        res = _gh(["release", "delete", gh_tag, "-R", repo, "--yes", "--cleanup-tag"])
        if res.returncode == 0:
            print(f"  · pruned old release {gh_tag} (retention: keep {keep})")
        else:
            print(f"  · WARN could not prune {gh_tag}: {res.stderr.strip()}")
    return stale


def publish_to_github(cfg, product, releases_raw, token, tags_to_publish, force=False) -> set:
    repo = cfg["github_repo"]
    slug = product["slug"]
    published = set()
    want = set(tags_to_publish)
    newest_tag = max(
        releases_raw,
        key=lambda x: x.get("published_at") or x.get("created_at") or "",
        default={},
    ).get("tag_name") if releases_raw else None
    for r in releases_raw:
        tag = r.get("tag_name", "")
        if tag not in want:
            continue
        gh_tag = _gh_tag(slug, tag)
        exists = _gh_release_exists(gh_tag, repo)
        if exists and not force:
            # Idempotent: a published tag is immutable, so scheduled re-runs
            # skip the (expensive) re-download/upload.
            print(f"  · {gh_tag}: already on hub, skipping")
            published.add(gh_tag)
            continue
        assets = r.get("assets") or []
        if not assets:
            print(f"  · {gh_tag}: no assets, skipping")
            continue

        tmp = Path(tempfile.mkdtemp(prefix="rel-"))
        try:
            print(f"  · {gh_tag}: downloading {len(assets)} asset(s) from Gitea…")
            files = []
            for a in assets:
                dest = tmp / a["name"]
                _download(a["browser_download_url"], token, dest)
                files.append(str(dest))

            if not exists:
                notes = tmp / "_notes.md"
                notes.write_text(r.get("body") or "", "utf-8")
                create = ["release", "create", gh_tag, "-R", repo,
                          "--title", f"{product['name']} {tag}",
                          "--notes-file", str(notes)]
                if r.get("prerelease"):
                    create.append("--prerelease")
                create.append("--latest" if tag == newest_tag else "--latest=false")
                res = _gh(create)
                if res.returncode != 0:
                    raise SystemExit(f"gh release create failed for {gh_tag}:\n{res.stderr}")
                print(f"  · {gh_tag}: created GitHub release")

            res = _gh(["release", "upload", gh_tag, *files, "-R", repo, "--clobber"])
            if res.returncode != 0:
                raise SystemExit(f"gh release upload failed for {gh_tag}:\n{res.stderr}")
            print(f"  · {gh_tag}: uploaded {len(files)} asset(s) to {repo}")
            published.add(gh_tag)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
    return published


# ── Sanitize + write ───────────────────────────────────────────────────────
def _sanitize(cfg, product, releases_raw, gh_tags: set) -> dict:
    slug = product["slug"]
    hub = cfg.get("release_hub", "github")
    # Derive the asset base from the repo so it can't drift. GitHub asset URLs
    # are github.com/<owner>/<repo>/releases/download/<tag>/<file>; here <repo>
    # is literally "releases", hence the doubled path segment.
    gh_base = (cfg.get("github_download_base")
               or f"https://github.com/{cfg['github_repo']}/releases/download").rstrip("/")

    out_releases = []
    for r in releases_raw:
        tag = r.get("tag_name", "")
        gh_tag = _gh_tag(slug, tag)
        mirrored = hub == "github" and gh_tag in gh_tags
        assets = []
        for a in (r.get("assets") or []):
            name = a.get("name", "")
            download_url = f"{gh_base}/{gh_tag}/{name}" if mirrored else ""
            assets.append({
                "name": name,
                "size": a.get("size", 0),
                "download_count": a.get("download_count", 0),
                "download_url": download_url,
            })
        author = r.get("author") or {}
        out_releases.append({
            "tag": tag,
            "name": r.get("name") or tag,
            "prerelease": bool(r.get("prerelease")),
            "mirrored": mirrored,
            "published_at": r.get("published_at") or r.get("created_at") or "",
            "author": author.get("login", ""),
            "body_md": r.get("body") or "",
            "assets": assets,
        })
    out_releases.sort(key=lambda x: x["published_at"], reverse=True)
    return {
        "product": product["name"],
        "slug": slug,
        "repo": f"{cfg['org']}/{product['repo']}",
        "hub": f"github:{cfg['github_repo']}" if hub == "github" else hub,
        "generated_at": _utcnow_iso(),
        "latest": out_releases[0]["tag"] if out_releases else None,
        "releases": out_releases,
    }


def _strip_ts(text: str) -> str:
    return "\n".join(ln for ln in text.splitlines() if '"generated_at"' not in ln)


def main() -> int:
    ap = argparse.ArgumentParser(description="Mirror Gitea releases; GitHub Releases as the hub.")
    ap.add_argument("--product", help="Only this slug.")
    ap.add_argument("--tag", help="With --publish-github, only this Gitea tag (e.g. v1.0.17).")
    ap.add_argument("--publish-github", action="store_true",
                    help="Download assets from Gitea and publish them to the GitHub hub.")
    ap.add_argument("--keep", type=int, default=None,
                    help="Retention: keep only the newest N releases on the GitHub "
                         "hub; older ones are pruned. Defaults to keep_releases in "
                         "the source map.")
    ap.add_argument("--force", action="store_true",
                    help="Re-upload assets even if the GitHub release already exists.")
    ap.add_argument("--check", action="store_true",
                    help="Do not write; exit non-zero if metadata JSON would change.")
    args = ap.parse_args()

    token = _gitea_token()
    cfg = json.loads(SOURCES_FILE.read_text("utf-8"))
    products = cfg["products"]
    if args.product:
        products = [p for p in products if p["slug"] == args.product]
        if not products:
            raise SystemExit(f"No product '{args.product}' in {SOURCES_FILE.name}")

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    index, changed = [], []

    for product in products:
        # Model-B products are served from the releases-repo downloads portal, not
        # mirrored via Gitea metadata. Emit a static hub entry and skip the Gitea fetch
        # (so the hub still lists them and a full sync never drops the card).
        if product.get("external"):
            n = int(product.get("versions", 1))
            index.append({
                "slug": product["slug"], "product": product["name"],
                "latest": product.get("latest", ""), "count": n,
                "mirrored": n, "data": "", "page": product.get("page", ""),
                "blurb": product.get("blurb", ""),
            })
            print(f"  {product['slug']}: external (downloads portal), latest {product.get('latest', '')}")
            continue
        raw = _fetch_raw_releases(cfg, product, token)

        keep = args.keep if args.keep is not None else int(cfg.get("keep_releases", 2))
        if args.publish_github and not args.check:
            if args.tag:
                tags_to_publish = [args.tag]
            else:
                ordered = sorted(
                    raw,
                    key=lambda x: x.get("published_at") or x.get("created_at") or "",
                    reverse=True,
                )
                tags_to_publish = [r.get("tag_name", "") for r in ordered[:keep]]
            print(f"Publishing {product['slug']} to {cfg['github_repo']}…")
            publish_to_github(cfg, product, raw, token, tags_to_publish, force=args.force)
            prune_github(cfg, product, raw, keep)

        gh_tags = _gh_existing_tags(cfg["github_repo"]) if cfg.get("release_hub") == "github" else set()
        data = _sanitize(cfg, product, raw, gh_tags)

        out = DATA_DIR / f"{product['slug']}.json"
        new_text = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
        old_text = out.read_text("utf-8") if out.exists() else ""
        if _strip_ts(old_text) != _strip_ts(new_text):
            changed.append(product["slug"])
            if not args.check:
                out.write_text(new_text, "utf-8")

        mirrored_n = sum(1 for r in data["releases"] if r["mirrored"])
        index.append({
            "slug": product["slug"], "product": product["name"],
            "latest": data["latest"], "count": len(data["releases"]),
            "mirrored": mirrored_n, "data": f"releases/data/{product['slug']}.json",
            "page": product.get("page", ""),
            "blurb": product.get("blurb", ""),
        })
        print(f"  {product['slug']}: {len(data['releases'])} release(s), "
              f"{mirrored_n} mirrored to GitHub, latest {data['latest']}")

    if not args.product and not args.check:
        (DATA_DIR / "index.json").write_text(
            json.dumps({"generated_at": _utcnow_iso(), "products": index},
                       indent=2, ensure_ascii=False) + "\n", "utf-8")

    if args.check and changed:
        print(f"STALE: re-run sync-releases.py — would change: {', '.join(changed)}")
        return 1
    print("Up to date." if args.check else "Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
