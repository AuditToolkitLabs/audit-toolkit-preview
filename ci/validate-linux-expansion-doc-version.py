#!/usr/bin/env python3
"""Validate linux-audit-expansion customer-doc version references for self-consistency."""

from __future__ import annotations

import argparse
import pathlib
import re
import sys


REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
DOCS_DIR = REPO_ROOT / "customer-docs" / "linux-audit-expansion"
VERSION_RE = r"\d+\.\d+\.\d+"

# Patterns that must reference the expected version wherever they appear.
VERSION_PATTERNS = [
    re.compile(rf"\| Release \| v(?P<version>{VERSION_RE}) \|"),
    re.compile(
        rf"https://github\.com/AuditToolkitLabs/"
        rf"AuditToolkit-Linux-Security-Lite/releases/download/"
        rf"v(?P<version>{VERSION_RE})"
    ),
    re.compile(rf"AuditToolkit Linux Security Lite v(?P<version>{VERSION_RE})"),
    re.compile(rf"Linux Security Lite version (?P<version>{VERSION_RE})"),
    re.compile(rf'tool_version:\s+"(?P<version>{VERSION_RE})"'),
    re.compile(
        rf"audit-toolkit-lite(?:-v|_|-)(?P<version>{VERSION_RE})(?:-1)?"
    ),
    re.compile(rf"`v(?P<version>{VERSION_RE})`\s+as the current"),
    re.compile(rf"v(?P<version>{VERSION_RE})\s+—\s+published"),
]

# Required snippets that must be present (keyed by file path relative to DOCS_DIR).
REQUIRED_SNIPPETS: dict[str, list[str]] = {
    "README.md": [
        "AuditToolkit Linux Security Lite v{version}",
        "v{version} — published",
    ],
    "index.md": [
        "| Release | v{version} |",
        "Linux Security Lite version {version}.",
    ],
    "01-purpose-and-audience.md": [
        "| Release | v{version} |",
    ],
    "02-service-overview.md": [
        "| Release | v{version} |",
    ],
    "18-installation-guide.md": [
        "releases/download/v{version}/audit-toolkit-lite-{version}.tar.gz",
        "AuditToolkit Linux Security Lite v{version}",
    ],
    "15-quick-start-siem-integration.md": [
        'tool_version: "{version}"',
    ],
    "23-licensing-and-legal.md": [
        "| Release | v{version} |",
    ],
}

# Reference file used to auto-detect the expected version (if --version not given).
REFERENCE_FILE = DOCS_DIR / "01-purpose-and-audience.md"
REFERENCE_PATTERN = re.compile(rf"\| Release \| v(?P<version>{VERSION_RE}) \|")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Validate linux-audit-expansion customer-doc version references. "
            "Expected version is auto-detected from 01-purpose-and-audience.md "
            "unless --version is supplied."
        ),
    )
    parser.add_argument(
        "--version",
        help="Expected toolkit version (e.g. 1.1.2). Auto-detected if omitted.",
    )
    return parser.parse_args()


def detect_version_from_reference() -> str:
    text = REFERENCE_FILE.read_text(encoding="utf-8")
    match = REFERENCE_PATTERN.search(text)
    if not match:
        raise ValueError(
            f"Could not detect version from {REFERENCE_FILE.relative_to(REPO_ROOT)}. "
            "No '| Release | vX.Y.Z |' row found."
        )
    return match.group("version")


def load_expected_version(explicit: str | None) -> str:
    if explicit:
        version = explicit.strip()
    else:
        version = detect_version_from_reference()

    if not re.fullmatch(VERSION_RE, version):
        raise ValueError(f"Invalid version string '{version}'.")

    return version


def collect_markdown_files() -> list[pathlib.Path]:
    return sorted(DOCS_DIR.rglob("*.md"))


def line_number_for_offset(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def validate_version_patterns(
    files: list[pathlib.Path], expected_version: str
) -> list[str]:
    failures: list[str] = []

    for file_path in files:
        text = file_path.read_text(encoding="utf-8")

        for pattern in VERSION_PATTERNS:
            for match in pattern.finditer(text):
                found_version = match.group("version")
                if found_version == expected_version:
                    continue

                rel_path = file_path.relative_to(REPO_ROOT).as_posix()
                line_no = line_number_for_offset(text, match.start())
                excerpt = match.group(0).strip()
                failures.append(
                    f"{rel_path}:{line_no}: found '{excerpt}' "
                    f"but expected version {expected_version}"
                )

    return failures


def validate_required_snippets(expected_version: str) -> list[str]:
    failures: list[str] = []

    for relative_path, snippets in REQUIRED_SNIPPETS.items():
        file_path = DOCS_DIR / relative_path
        if not file_path.exists():
            failures.append(
                f"customer-docs/linux-audit-expansion/{relative_path}: "
                "file not found (required for snippet check)"
            )
            continue

        text = file_path.read_text(encoding="utf-8")
        for snippet in snippets:
            rendered = snippet.format(version=expected_version)
            if rendered not in text:
                failures.append(
                    f"{file_path.relative_to(REPO_ROOT).as_posix()}: "
                    f"missing required release snippet '{rendered}'"
                )

    return failures


def main() -> int:
    args = parse_args()

    try:
        expected_version = load_expected_version(args.version)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    files = collect_markdown_files()
    failures: list[str] = []
    failures.extend(validate_version_patterns(files, expected_version))
    failures.extend(validate_required_snippets(expected_version))

    if failures:
        print(
            f"Linux-expansion doc version validation FAILED for {expected_version}:",
            file=sys.stderr,
        )
        for failure in failures:
            print(f"  - {failure}", file=sys.stderr)
        return 1

    print(
        f"Linux-expansion doc version validation passed for {expected_version}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
