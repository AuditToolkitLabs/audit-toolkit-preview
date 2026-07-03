# Linux Host Lite — Feature Guide: Output Schema Reference

## Purpose

This page documents the structure of the files produced by each audit run so
that customers can consume results in dashboards, ticketing systems, and
compliance workflows. Linux Host Lite produces the same audit-result contract
as Windows Security Lite (evidence-bundle parity), with Linux-specific module
and baseline content.

## Output Files

Each run writes four files to the configured output path:

| File                | Contents                                                             |
| ------------------- | -------------------------------------------------------------------- |
| `audit-result.json` | Full audit result — findings, scores, coverage, baseline references. |
| `metadata.json`     | Host identity and run context.                                       |
| `findings.csv`      | Flat findings export for spreadsheet or dashboard import.            |
| `summary.html`      | Human-readable report with Hardening Index and category scores.      |

## `audit-result.json` Top-Level Fields

| Field                | Type    | Description                                                  |
| -------------------- | ------- | ------------------------------------------------------------ |
| `SchemaVersion`      | string  | Version of the result contract.                              |
| `ToolName`           | string  | Product name.                                                |
| `ToolVersion`        | string  | Product version that produced the result.                    |
| `RunId`              | string  | Unique identifier (UUID) for the run.                        |
| `RunTimestampUtc`    | string  | Run start time in UTC (ISO 8601).                            |
| `Host`               | string  | Host name the audit ran against.                             |
| `Profile`            | string  | Scan profile used.                                           |
| `ExecutionMode`      | string  | Always `audit` (read-only).                                  |
| `Summary`            | object  | Aggregate counts and scores, including the Hardening Index.  |
| `Findings`           | array   | Individual check results (see below).                        |
| `Coverage`           | object  | Module coverage (see below).                                 |
| `Warnings`           | array   | Non-fatal warnings raised during the run.                    |
| `BaselineReferences` | array   | Baseline sources and versions the checks map to.             |
| `ExitCode`           | integer | Process exit code for the run.                               |

## Finding Object Fields

Each entry in the `Findings` array describes one check result:

| Field                 | Description                                              |
| --------------------- | ------------------------------------------------------- |
| `CheckId`             | Stable identifier for the check (e.g. `USR-001`).       |
| `Category`            | Functional grouping (e.g. accounts, firewall, sudo).    |
| `Title`               | Human-readable description of the check.                |
| `Status`              | `PASS`, `FAIL`, or `ERROR`.                             |
| `Severity`            | `Low`, `Medium`, `High`, or `Critical`.                |
| `Expected` / `Actual` | The required value and the observed value.              |
| `BaselineReferences`  | Baseline control identifier the check maps to.          |

A `Status` of `ERROR` indicates the check could not be evaluated (fail-soft);
it never aborts the scan.

## `Coverage` Object

| Field             | Description                                       |
| ----------------- | ------------------------------------------------- |
| `ExpectedModules` | Modules the profile declared.                     |
| `ExecutedModules` | Modules that actually ran.                        |
| `MissingModules`  | Declared modules that did not run.                |
| `CoveragePercent` | Percentage of expected modules executed (0–100).  |

Compare `ExpectedModules` against `MissingModules` to confirm a run was
complete before treating its findings as authoritative.

## `findings.csv`

A flat, one-row-per-finding export of the `Findings` array for spreadsheet or
dashboard import. Column headers correspond to the finding fields above.

## Exit Codes

| Code | Meaning                                                      |
| ---- | ------------------------------------------------------------ |
| 0    | Audit completed — all checks passed.                         |
| 3    | Licence error — activate or import a licence before running. |
| 4    | Audit completed — one or more checks produced findings.      |

Exit code 4 is a normal audit outcome when findings exist; it does not indicate
a tool failure.

## Related Guidance

- [Linux Host Lite Overview](00-overview.md)
- [Capabilities](01-capabilities.md)
