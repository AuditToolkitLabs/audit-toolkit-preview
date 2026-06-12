#!/usr/bin/env python3
"""Enforce docs-sync-ledger updates for documentation changes."""

from __future__ import annotations

import argparse
import pathlib
import re
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
LEDGER_PATH = REPO_ROOT / "docs-sync-ledger.md"

WATCHED_PREFIXES = (
    "customer-docs/",
)

WATCHED_FILES = {
    "README.md",
    "docs.html",
    "OFFLINE-DOC-SYNC-RECONCILIATION-MODEL.md",
    "sync-docs-to-website.ps1",
}

REQUIRED_FIELDS = (
    "Date:",
    "Type:",
    "Source:",
    "Files Affected:",
    "Description:",
    "Sync Status:",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Validate that documentation changes are accompanied by "
            "updates to docs-sync-ledger.md and have an audit trace."
        )
    )
    parser.add_argument(
        "--changed-files",
        required=True,
        help=(
            "Path to a newline-delimited file list from "
            "git diff --name-only."
        ),
    )
    return parser.parse_args()


def load_changed_files(path: pathlib.Path) -> list[str]:
    if not path.exists():
        raise FileNotFoundError(f"Changed-files list not found: {path}")

    files: list[str] = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        entry = raw.strip().replace("\\", "/")
        if entry:
            files.append(entry)
    return files


def is_watched(path: str) -> bool:
    if path in WATCHED_FILES:
        return True
    return path.startswith(WATCHED_PREFIXES)


def validate_ledger_structure(text: str) -> list[str]:
    failures: list[str] = []

    for field in REQUIRED_FIELDS:
        if field not in text:
            failures.append(
                f"docs-sync-ledger.md missing required field label '{field}'"
            )

    entries = [chunk.strip() for chunk in text.split("---") if chunk.strip()]
    if not entries:
        failures.append("docs-sync-ledger.md has no entries")
        return failures

    entry_pattern = re.compile(
        r"Date:\s*\d{4}-\d{2}-\d{2}.*?"
        r"Type:\s*(LOCAL_UPDATE|CENTRAL_SYNC|RECONCILIATION).*?"
        r"Source:\s*(local|central).*?"
        r"Files Affected:\s*.*?"
        r"Description:\s*.*?"
        r"Sync Status:\s*(pending|synced|rejected)",
        re.IGNORECASE | re.DOTALL,
    )

    if not any(entry_pattern.search(entry) for entry in entries):
        failures.append(
            "docs-sync-ledger.md does not contain a parseable entry "
            "with all required fields"
        )

    return failures


def main() -> int:
    args = parse_args()

    changed_files = load_changed_files(pathlib.Path(args.changed_files))
    watched_changes = sorted({f for f in changed_files if is_watched(f)})

    if not watched_changes:
        print(
            "No watched documentation changes detected; "
            "ledger check passed."
        )
        return 0

    failures: list[str] = []

    if "docs-sync-ledger.md" not in changed_files:
        failures.append(
            "Documentation-related files changed but "
            "docs-sync-ledger.md was not updated"
        )

    if not LEDGER_PATH.exists():
        failures.append("docs-sync-ledger.md is missing")
    else:
        ledger_text = LEDGER_PATH.read_text(encoding="utf-8")
        failures.extend(validate_ledger_structure(ledger_text))

        for path in watched_changes:
            if path == "docs-sync-ledger.md":
                continue
            if path not in ledger_text:
                failures.append(
                    f"Changed file '{path}' not referenced in "
                    "docs-sync-ledger.md"
                )

    if failures:
        print("Docs sync ledger validation FAILED:", file=sys.stderr)
        for failure in failures:
            print(f"  - {failure}", file=sys.stderr)
        return 1

    print("Docs sync ledger validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
