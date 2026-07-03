# Windows Security Lite — Capabilities

Windows Security Lite performs read-only security baseline auditing of a single
Windows host and turns the results into structured evidence, scores, and
reports. This page summarises what the tool can do.

## Host security auditing

- Runs a set of read-only security checks against the local Windows host —
  configuration is inspected and reported, never modified.
- Groups checks into functional categories (for example, Firewall) so posture
  can be reviewed area by area.
- Maps each check to baseline references and a severity rating, giving each
  finding a clear compliance and priority context.
- Produces a Hardening Index and per-category scores that summarise overall host
  posture at a glance.

## Findings and scoring

- Each check result records its check ID, category, expected versus actual
  value, status (`PASS`, `FAIL`, or `ERROR`), severity (`Low`, `Medium`,
  `High`, or `Critical`), and a weight reflecting its contribution to the
  Hardening Index.
- Failing checks carry remediation guidance and an evidence reference so results
  are actionable and traceable.
- Coverage reporting shows which modules were expected, which executed, and
  which were missing, so a run's completeness can be confirmed before its
  findings are trusted.

## Structured, evidence-ready output

Every run writes four self-contained output files:

- `audit-result.json` — the full machine-readable result, defined by a shipped
  JSON Schema, covering findings, scores, coverage, and baseline references.
- `metadata.json` — host identity, run timestamp, and coverage percent for run
  provenance.
- `findings.csv` — a flat, one-row-per-finding export for dashboard import or
  Excel review.
- `summary.html` — a human-readable report with the Hardening Index and category
  scores, viewable in any browser.

## Flexible execution

- **GUI launcher** — a WinForms wrapper with a single **Run Audit** button, a
  live status indicator, and a direct link to the latest HTML report. It is a
  thin wrapper over the CLI engine, so audit logic runs identically either way.
- **CLI** — the primary interface for activation, running audits, checking
  status, and offline licence import. Supports a custom output path and
  selectable scan profiles.
- **Scan profiles** — JSON profiles declare which audit modules run and how
  results are grouped; the tool ships with a signed default profile.

## Automation and CI/CD gating

- Runs non-interactively through the CLI with no run-time network dependency,
  making it suitable as a pipeline compliance gate on Windows build agents.
- Process exit codes drive gating: `0` (all passed), `1` (execution error), `3`
  (licence error), and `4` (findings present — a normal audit outcome for the
  pipeline to act on by policy).
- Supports severity-based gating by parsing `audit-result.json` to fail only on
  `High` or `Critical` findings.
- Output directories can be published as pipeline artifacts to retain evidence
  for each run.

## Licensing and deployment

- Installs from a Windows MSI on Windows 10 (1903+), Windows 11, and Windows
  Server 2019 or later.
- Activates online with a licence key, or imports a signed offline licence file
  for air-gapped and ephemeral hosts.
- After activation, licence state is cached locally and no network access is
  required for subsequent runs.

## Related pages

- [Overview](00-overview.md)
- [Feature Guide](02-feature-guide.md)
