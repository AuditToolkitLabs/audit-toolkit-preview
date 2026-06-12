#!/usr/bin/env python3
"""Smoke test remote doc availability for canary remote-only mode."""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
CONFIG_PATH = REPO_ROOT / "docs-source-config.json"
VIEWER_PATH = REPO_ROOT / "doc-viewer.html"

DOC_INDEX_FILES = [
    REPO_ROOT / "audit-toolkit-documentation.html",
    REPO_ROOT / "cmdb-api-documentation.html",
    REPO_ROOT / "cmdb-asset-platform-documentation.html",
    REPO_ROOT / "linux-security-lite-documentation.html",
    REPO_ROOT / "secure-exposure-centre-documentation.html",
]

SRC_PATTERN = re.compile(r"doc-viewer\.html\?src=([^\"'&]+)", re.IGNORECASE)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Verify remote markdown can be resolved for docs links while "
            "local customer-docs availability is not assumed."
        )
    )
    parser.add_argument(
        "--sample-size",
        type=int,
        default=25,
        help="Maximum number of documentation links to test.",
    )
    parser.add_argument(
        "--timeout-seconds",
        type=int,
        default=20,
        help="HTTP timeout per request.",
    )
    return parser.parse_args()


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError(f"Missing config file: {CONFIG_PATH}")
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def collect_doc_sources() -> list[str]:
    sources: list[str] = []
    seen: set[str] = set()

    for html_path in DOC_INDEX_FILES:
        if not html_path.exists():
            continue
        text = html_path.read_text(encoding="utf-8")
        for match in SRC_PATTERN.finditer(text):
            value = urllib.parse.unquote(match.group(1)).strip()
            if value and value not in seen:
                seen.add(value)
                sources.append(value)

    return sources


def check_url(url: str, timeout_seconds: int) -> tuple[bool, str]:
    request = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(
            request,
            timeout=timeout_seconds,
        ) as response:
            status = getattr(response, "status", 200)
            if status != 200:
                return False, f"HTTP {status}"
            return True, "ok"
    except urllib.error.HTTPError as exc:
        return False, f"HTTP {exc.code}"
    except urllib.error.URLError as exc:
        return False, f"URL error: {exc.reason}"


def main() -> int:
    args = parse_args()

    config = load_config()
    remote_base = str(config.get("remoteMirrorBaseUrl", "")).rstrip("/")
    canary_enabled = bool(config.get("enableCanaryRemoteOnly", False))

    failures: list[str] = []

    if not remote_base:
        failures.append("docs-source-config.json missing remoteMirrorBaseUrl")

    if not canary_enabled:
        failures.append(
            "docs-source-config.json has enableCanaryRemoteOnly=false "
            "(expected true for canary workflow)"
        )

    viewer_text = VIEWER_PATH.read_text(encoding="utf-8")
    if "enableCanaryRemoteOnly" not in viewer_text:
        failures.append("doc-viewer.html missing canary toggle logic")

    sources = collect_doc_sources()
    if not sources:
        failures.append("No documentation sources found in index pages")

    if failures:
        print("Remote canary pre-check FAILED:", file=sys.stderr)
        for item in failures:
            print(f"  - {item}", file=sys.stderr)
        return 1

    tested = 0
    for src in sources[: max(1, args.sample_size)]:
        url = f"{remote_base}/{src.lstrip('/')}"
        ok, message = check_url(url, args.timeout_seconds)
        tested += 1
        if not ok:
            print(f"FAIL {src} -> {message}", file=sys.stderr)
            return 1

    print(f"Remote canary smoke passed. Tested {tested} documentation links.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
