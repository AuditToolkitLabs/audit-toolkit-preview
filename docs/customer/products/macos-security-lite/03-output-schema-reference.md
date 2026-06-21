# AuditToolkit macOS Security Lite — Output Schema Reference

## Purpose

This page documents the structure of the files produced by each audit run so
that customers can consume results in dashboards, ticketing systems, and
compliance workflows. macOS Security Lite writes a single JSON result document
and an HTML report, and serves the same result through the local web viewer.

## Output Files

Each run writes the following files to the configured output path:

| File                         | Contents                                                              |
| ---------------------------- | --------------------------------------------------------------------- |
| `macos-security-report.json` | Full audit result — findings, scores, host profile, hardening index. |
| `summary.html`               | Human-readable report with Hardening Index and category scores.      |

The default output path is
`~/Library/Application Support/AuditToolkitLabs/AuditToolkitLite/latest`.

## `macos-security-report.json` Structure

The report is a single JSON object containing run context, a host profile, the
overall scores, and the array of individual check results.

| Field             | Type   | Description                                                       |
| ----------------- | ------ | ---------------------------------------------------------------- |
| `ToolName`        | string | Product name.                                                    |
| `Host`            | object | Host profile — system identity and context for the run.         |
| `Scores`          | object | Overall scores, including the Hardening Index.                   |
| `Findings`        | array  | Individual check results (see below).                            |
| `ExitCode`        | integer| Process exit code for the run.                                   |

Exact field names are defined by the shipped result document; treat
`Findings`, `Scores.HardeningIndex`, and the host profile as the stable,
consumable elements.

## Finding Object Fields

Each entry in the `Findings` array describes one check result:

| Field      | Description                                                  |
| ---------- | ----------------------------------------------------------- |
| `CheckId`  | Stable identifier for the check.                            |
| `Category` | Functional grouping for the check.                          |
| `Title`    | Human-readable description of the check.                    |
| `Status`   | `PASS`, `FAIL`, or `ERROR`.                                 |
| `Severity` | `Low`, `Medium`, `High`, or `Critical`.                   |

A `Status` of `ERROR` indicates the check could not be evaluated (fail-soft);
it never aborts the scan.

## Reviewing Results

Open `summary.html` in any browser, or start the local web viewer
(`audittoolkit-macos-security-lite web`) at `http://127.0.0.1:8766` to review
status, scores, and findings interactively. For programmatic use, parse
`macos-security-report.json`.

## Exit Codes

| Code | Meaning                                                       |
| ---- | ------------------------------------------------------------- |
| 0    | Audit completed — all checks passed.                          |
| 3    | Licence error — activate or import a licence before running.  |
| 4    | Audit completed — one or more checks produced findings.       |

Exit code 4 is a normal audit outcome when findings exist; it does not indicate
a tool failure.

## Related Guidance

- [macOS Security Lite Overview](00-overview.md)
- [Configuration and Scan Profiles](02-configuration.md)
- [Gatekeeper and First Audit](01-gatekeeper-and-first-audit.md)
