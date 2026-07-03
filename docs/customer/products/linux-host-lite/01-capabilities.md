# Linux Host Lite — Capabilities

Linux Host Lite audits the security baseline of a single Linux host and reports
the results as structured evidence. This page summarises what the tool can do,
grouped by capability area.

## Host security auditing

- Runs read-only security checks against the local Linux host — the tool never
  changes system state (execution mode is always `audit`).
- Checks are grouped into functional categories such as accounts, firewall, and
  sudo, so results map to recognisable areas of host hardening.
- Each check produces a `PASS`, `FAIL`, or `ERROR` status. An `ERROR` is
  fail-soft: a check that cannot be evaluated is recorded but never aborts the
  scan.

## Scoring and baselines

- Every finding carries a severity rating of `Low`, `Medium`, `High`, or
  `Critical` to help prioritise remediation.
- Runs produce an overall Hardening Index and per-category scores that summarise
  posture at a glance.
- Each check maps to baseline control references, so findings can be traced back
  to the standard they support.

## Evidence-ready output

Every run writes a complete, self-contained set of files to the output path:

- `audit-result.json` — the full, machine-readable audit result: summary,
  findings, coverage, warnings, and baseline references.
- `metadata.json` — host identity and run context (host, timestamp, coverage).
- `findings.csv` — a flat, one-row-per-finding export for spreadsheet or
  dashboard import.
- `summary.html` — a human-readable report with the Hardening Index and
  category scores, viewable in any browser.

Linux Host Lite produces the same audit-result contract as Windows Security Lite
(evidence-bundle parity), with Linux-specific module and baseline content.

## Coverage assurance

- Each result reports the modules a profile declared, the modules that actually
  ran, any missing modules, and a coverage percentage (0–100).
- This lets you confirm a run was complete before treating its findings as
  authoritative.

## Configuration and scan profiles

- Behaviour is controlled entirely by command-line options and the selected scan
  profile — there is no configuration file to maintain.
- Scan profiles are JSON definitions that declare which audit modules run; the
  tool ships with a signed default profile.
- Output is written to a configurable path, so runs can be directed to
  timestamped directories to retain history.

## Licensing and offline operation

- Activate online with a licence key, or import a signed offline licence file
  for air-gapped hosts.
- Licence state is cached locally after activation, so subsequent audit runs
  need no network access.

## Automation and CI/CD gating

- Runs non-interactively with no prompts, suitable for pipelines and scheduled
  jobs.
- Process exit codes drive gating: `0` (all checks passed), `3` (licence error),
  and `4` (audit completed with findings — a normal outcome, not a tool
  failure).
- For finer control, parse `audit-result.json` to apply severity-based gating —
  for example, failing a build only on `High` or `Critical` findings.
- The full output directory can be published as a pipeline artefact so each
  run's evidence is retained for audit.

## Deployment footprint

- Single-host, self-contained tool requiring only Python 3.10 or later and the
  standard library — no pip packages, no run-time internet, no external tooling.
- Ships as DEB (Debian 11+, Ubuntu 20.04+) and RPM (RHEL 8+, Rocky Linux 8+,
  AlmaLinux 8+) packages.

See the [Feature Guide](02-feature-guide.md) for the full output schema
reference.
