# Customer Release Changelog

This changelog is customer-facing and summarizes release-impacting
changes for Asset Command Center.

## Version 1.0.3 - 2026-05-15

### Added

- Customer security assurance report for release evidence publication:
  `14-customer-security-assurance-report.md`.
- Release transparency evidence for security scanning interpretation in
  customer-facing documentation.

### Changed

- Planned release documentation version references updated to 1.0.3
  across customer guides and legal metadata.
- Security documentation now explicitly distinguishes release-gating
  scope versus non-gating engineering context.

### Security

- Release-scope static security evidence indicates 0 CodeQL Python
  findings in the gated pass and 0 Bandit findings in standard
  release-gate mode.
- A transparency Bandit run with `--ignore-nosec` is documented for
  disclosure completeness.

## Version 1.0.2 - 2026-05-11

- Baseline standalone customer publication for Asset Command Center
  release materials.
