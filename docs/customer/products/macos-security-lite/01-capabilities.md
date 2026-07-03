# macOS Security Lite — Capabilities

macOS Security Lite is a read-only security auditor for a single macOS host. It
runs a set of local checks, scores the results, and produces evidence you can
feed into governance, compliance, and operational review. Everything runs
locally on standard-library Python 3.10+ — no pip packages, no external tooling,
and no network access at run time.

## Security posture auditing

- Read-only security checks run against the local macOS system — the tool never
  changes host state.
- Checks are implemented as individual modules under `runtime/modules/`.
- The active scan profile (`runtime/profiles/default.json`) controls which
  modules run and how their results are grouped.
- Fail-soft evaluation: a check that cannot be evaluated is reported with status
  `ERROR` and never aborts the scan.

## Scoring and findings

- Each run produces a set of structured findings, an overall score set, and a
  **Hardening Index**.
- Every finding carries a stable `CheckId`, a `Category`, a human-readable
  `Title`, a `Status` (`PASS`, `FAIL`, or `ERROR`), and a `Severity` (`Low`,
  `Medium`, `High`, or `Critical`).
- A host profile captures system identity and context for the run, so results
  are traceable to a specific machine and time.

## Reporting and output

- **JSON result** — `macos-security-report.json` contains the full audit result:
  findings, scores, host profile, and Hardening Index. Suitable for dashboards,
  ticketing systems, and compliance workflows.
- **HTML report** — `summary.html` is a human-readable report with the Hardening
  Index and category scores, viewable in any browser.
- **Local web viewer** — `audittoolkit-macos-security-lite web` serves the most
  recent report at `http://127.0.0.1:8766`. It binds to localhost only and does
  not expose findings to the network.

## Configuration surface

- No configuration file — behaviour is controlled entirely by command-line
  options and the selected scan profile.
- `--output-path` sets the directory for output files (defaults to
  `~/Library/Application Support/AuditToolkitLabs/AuditToolkitLite/latest`).
- `--profile` selects a scan profile by name from the installed
  `runtime/profiles/` set. Treat shipped profiles as read-only.
- Each run overwrites the previous run's files in the same output path; direct
  runs to timestamped paths to retain history.

## Deployment and lifecycle

- Installs on macOS 10.15 (Catalina) or later via **DMG** (drag-to-Applications)
  or **PKG** (administrator or scripted deployment).
- The PKG installs the app to `/Applications` and adds a CLI wrapper at
  `/usr/local/bin/audittoolkit-macos-security-lite`.
- Upgrades preserve configuration and cached licence state.

## Licensing and activation

- Built-in activation with an online licence key, or offline import of a signed
  licence file for air-gapped hosts.
- Licence state is cached locally at
  `~/.audittoolkit/macos-security-lite/licence.json`; only initial activation
  needs network access.
- Licence files are host-specific and must not be copied between hosts or
  re-signed locally.

## Run outcomes (exit codes)

| Code | Meaning                                                       |
| ---- | ------------------------------------------------------------ |
| 0    | Audit completed — all checks passed.                         |
| 3    | Licence error — activate or import a licence before running. |
| 4    | Audit completed — one or more checks produced findings.      |

Exit code 4 is a normal outcome when findings exist; review the report to assess
severity and remediation priority.

## Related pages

- Overview
- Feature Guide — Gatekeeper approval and first audit
