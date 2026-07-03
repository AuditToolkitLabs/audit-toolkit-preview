# Windows Security Lite — Feature Guide (Output Schema Reference)

## Purpose

This page documents the structure of the files produced by each audit run so
that customers can consume results in dashboards, ticketing systems, and
compliance workflows. The `audit-result.json` contract is defined by a shipped
JSON Schema (`audit-result.schema.json`) and is the parity reference for the
other Lite products.

## Output Files

Each run writes four files to the configured output path:

| File                | Contents                                                            |
| ------------------- | ------------------------------------------------------------------- |
| `audit-result.json` | Full scan result — findings, scores, coverage, baseline references. |
| `metadata.json`     | Host identity and run context.                                      |
| `findings.csv`      | Flat findings export for dashboard import or Excel review.          |
| `summary.html`      | Human-readable report with Hardening Index and category scores.     |

## `audit-result.json` Top-Level Fields

The following fields are required by the result schema:

| Field                | Type    | Description                                            |
| -------------------- | ------- | ----------------------------------------------------- |
| `SchemaVersion`      | string  | Version of the result contract.                       |
| `ToolName`           | string  | Product name.                                         |
| `ToolVersion`        | string  | Product version that produced the result.             |
| `RunId`              | string  | Unique run identifier (UUID).                         |
| `RunTimestampUtc`    | string  | Run start time in UTC (ISO 8601 date-time).           |
| `Host`               | string  | Host name the scan ran against.                       |
| `Profile`            | string  | Scan profile used.                                    |
| `ExecutionMode`      | string  | Always `audit` (read-only).                           |
| `Summary`            | object  | Aggregate counts and scores.                          |
| `Findings`           | array   | Individual check results — at least one (see below).  |
| `Coverage`           | object  | Module coverage (see below).                          |
| `Warnings`           | array   | Non-fatal warnings raised during the run.             |
| `BaselineReferences` | array   | Baseline source(s) and version(s) the checks map to.  |
| `ExitCode`           | integer | Process exit code for the run.                        |

Builds also include scoring fields such as `Scores.HardeningIndex` and a
`CategoryScores` array used to render the HTML report.

## Finding Object Fields

Each entry in the `Findings` array describes one check result:

| Field                 | Description                                              |
| --------------------- | ------------------------------------------------------- |
| `CheckId`             | Stable identifier for the check (e.g. `FW-DOMAIN-001`). |
| `Category`            | Functional grouping (e.g. `Firewall`).                  |
| `Title`               | Human-readable description of the check.                |
| `Status`              | `PASS`, `FAIL`, or `ERROR`.                             |
| `Severity`            | `Low`, `Medium`, `High`, or `Critical`.                 |
| `Weight`              | Relative contribution of the check to the Hardening Index. |
| `Expected` / `Actual` | The required value and the observed value.              |
| `EvidenceRef`         | Pointer to the underlying evidence for the result.      |
| `RemediationGuidance` | Suggested remediation for a failing check.              |
| `BaselineReferences`  | Baseline control identifier the check maps to.          |

## `Coverage` Object

| Field             | Description                                       |
| ----------------- | ------------------------------------------------- |
| `ExpectedModules` | Modules the profile declared.                     |
| `ExecutedModules` | Modules that actually ran.                        |
| `MissingModules`  | Declared modules that did not run.                |
| `WarningCount`    | Number of warnings raised.                        |
| `CoveragePercent` | Percentage of expected modules executed (0–100).  |

Confirm `MissingModules` is empty before treating a run's findings as complete.

## `findings.csv`

A flat, one-row-per-finding export of the `Findings` array for dashboard import
or Excel review. Column headers correspond to the finding fields above.

## Exit Codes

| Code | Meaning                                                      |
| ---- | ------------------------------------------------------------ |
| 0    | Scan completed — all checks passed.                          |
| 1    | Execution error — review PowerShell output for detail.       |
| 3    | Licence error — activate or import a licence before running. |
| 4    | Scan completed — one or more checks produced findings.       |

Exit code 4 is a normal audit outcome when findings exist; it does not indicate
a tool failure. Exit code 1 indicates the run itself failed and should be
investigated.

## Related pages

- [Overview](00-overview.md)
- [Capabilities](01-capabilities.md)
