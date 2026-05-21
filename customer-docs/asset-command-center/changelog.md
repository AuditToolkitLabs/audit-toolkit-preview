# Customer Release Changelog

This changelog is customer-facing and summarizes release-impacting
changes for Asset Command Centre.

## Version 1.1.0 - 2026-05-21

### Changed

- Planned release documentation baseline updated to 1.1.0 across root,
  legal, operational, and customer-facing security guidance.
- Security assurance and production posture reports aligned to the
  1.1.0 release evidence narrative.

### Security

- Release-gating evidence set remains aligned with zero-finding posture
  expectations for CodeQL, Bandit (standard mode), pip-audit,
  and scoped secret scanning.

## Version 1.0.5 - 2026-05-15

### Added

- Comprehensive functional test coverage validation (246 tests, 100% passing)
  for all cloud credential validation workflows across AWS, Azure, GCP, OCI.
- Enhanced code quality metrics: pylint score 10.00/10 (+1.88 improvement from
  v1.0.4) on cloud validation service modules.
- Shell linting validation: 0 warnings across orchestrator audit framework.
- Docker configuration validation in release-gate evidence.
- Full end-to-end correctness testing of cloud findings generation, export
  service, and commerce addon resolution.

### Fixed

- **Critical**: GCP inventory collection now guards None responses before
  accessing .ok attribute on iam_policy_resp and keys_resp. Fixes 4 GCP
  inventory tests (BigQuery, CloudSQL, GKE, ServiceAccounts).
- **Critical**: AWS and OCI XML response parsing now guards empty resp.text
  before calling DefusedET.fromstring(). Prevents ParseError on empty
  responses from cloud APIs. Fixes 11 AWS/OCI validation tests.
- **Critical**: GCP scope discovery now catches OSError/ConnectionError and
  gracefully falls back to payload-supplied project IDs when CRM API
  connection fails. Fixes 1 scope discovery fallback test.

### Changed

- Documentation baseline updated from 1.0.4 to 1.0.5 across security,
  legal, and customer guidance.
- Security assurance and production posture reports enhanced with functional
  test coverage and code quality metrics.

### Security

- All 246 functional tests passing, validating secure handling of null
  responses and edge cases in cloud credential validation.
- Release-scope static security checks remain passing: CodeQL 0 findings,
  Bandit 0 findings (standard mode), pip-audit 0 vulnerable packages,
  secret scanning 0 secrets detected.
- Enhanced null-safety and exception handling patterns reflected in improved
  code quality score.

## Version 1.0.4 - 2026-05-15

### Changed

- Corrective release publication to align package artifact versioning with the release tag.
- Documentation baseline updated from 1.0.3 to 1.0.4 across security, legal, and customer guidance.

### Security

- Security assurance and production posture reports updated for release version 1.0.4.
- Release workflow guidance clarified to prevent tag/package version mismatch in future releases.

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

- Baseline standalone customer publication for Asset Command Centre
  release materials.
