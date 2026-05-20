# Security and Quality Assurance Report

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Assessment date | 2026-05-18 |
| Product | Switch Exposure Center |
| Repository baseline | main |
| Report objective | Increase customer confidence in application usability, security, and operational reliability |

---

## Executive summary

This report provides a customer-facing quality and security assurance summary
for Switch Exposure Center based on current repository evidence, automated test
runs, and static security analysis outputs.

Current assurance position:

- Full automated regression suite passed: **205 / 205** tests.
- Current GitHub code scanning posture: **0 open alerts**.
- Existing Bandit static analysis report: **0 findings**.
- Recent medium-severity exception-exposure findings were remediated and
  re-verified by CodeQL.

---

## Evidence baseline

| Evidence source | Baseline |
| --- | --- |
| Full test suite command | `python -W error::ResourceWarning -m unittest discover tests` |
| Full test suite result | 205 tests passed in 98.855s |
| GitHub code scanning (open) | 0 alerts |
| GitHub code scanning (fixed) | 27 alerts |
| Bandit report file | `bandit-report.json` |
| Bandit report timestamp | 2026-05-12T16:43:33Z |
| Bandit totals | 0 high, 0 medium, 0 low findings |
| Bandit scanned lines | 8,805 LOC |

---

## Security assurance report

### 1. Static and semantic analysis posture

- CodeQL scan workflow is enabled on push and pull request to main.
- Current open code scanning alerts: **0**.
- Recent medium findings (exception information exposure) were resolved and
  verified as fixed:
  - Alert #53: fixed
  - Alert #54: fixed
  - Alert #55: fixed
- Bandit report records no active findings in the scanned codebase snapshot.

### 2. Security control implementation highlights

- Authentication and role-based controls are implemented for admin and
  operational paths.
- Licensing and entitlement gates enforce feature access control.
- Sensitive fields are masked and handled as write-only where applicable.
- Security guidance and disclosure policy are documented in:
  - `SECURITY.md`
  - `docs/SECURITY-SCORECARD.md`
  - `docs/customer-docs/switch-exposure-center/09-security.md`
  - `docs/customer-docs/switch-exposure-center/21-security-faq.md`

### 3. Recently completed hardening actions

- Sanitized Keygen and LDAP connectivity error responses to prevent accidental
  exception detail exposure in API responses.
- Added and executed targeted regression tests to ensure stack-trace and raw
  exception text are not returned to external callers.

---

## Quality assurance report

### 1. Full regression result

- Command executed:

```text
python -W error::ResourceWarning -m unittest discover tests
```

- Result:

```text
Ran 205 tests in 98.855s
OK
```

### 2. Test undertaking log (recent)

| Test activity | Command | Result |
| --- | --- | --- |
| Licensing service and API regression | `python -W error::ResourceWarning -m unittest tests.test_licensing_service tests.test_licensing_api` | 9 passed |
| LDAP error-sanitization regression | `python -W error::ResourceWarning -m unittest tests.test_ldap_auth_service` | 3 passed |
| Full platform regression | `python -W error::ResourceWarning -m unittest discover tests` | 205 passed |

### 3. Test coverage by quality domain

The current test suite includes coverage across the following customer-relevant
domains:

- API behavior and contracts
  - `test_advisories_api.py`
  - `test_jobs_api.py`
  - `test_connector_settings_api.py`
  - `test_execution_safety_api.py`
  - `test_job_schedules_api.py`
  - `test_runtime_health_api.py`
- Security and identity
  - `test_oidc_auth.py`
  - `test_session_hardening_api.py`
  - `test_licensing_api.py`
  - `test_licensing_service.py`
  - `test_licensing_feature_gates.py`
  - `test_ldap_auth_service.py`
- Usability and operator experience
  - `test_console_pages.py`
  - `test_support.py`
- Device and connector reliability
  - `test_arista_connector.py`
  - `test_aruba_connector.py`
  - `test_brocade_connector.py`
  - `test_cisco_connector.py`
  - `test_cisco_mds_connector.py`
  - `test_dell_connector.py`
  - `test_juniper_connector.py`
- Advisory and exposure workflows
  - `test_advisory_automation_api.py`
  - `test_advisory_source_settings_api.py`
  - `test_pentest_api.py`
  - `test_san_device_detail_api.py`
- Operations, recovery, and deployment quality
  - `test_backup_restore_plan.py`
  - `test_postgresql_profile.py`
  - `test_schema_migrations.py`
  - `test_systemd_deployment.py`
  - `test_packaging_security_headers.py`
  - `test_release_integrity.py`
  - `test_work_queue_service.py`
  - `test_device_actions_service.py`

---

## Usability assurance statement

Customer usability confidence is supported through:

- Console behavior tests for key user-facing pages.
- Dedicated quick-start guides and operational runbooks in the customer docs
  package.
- Stable API-oriented workflows documented and validated through automated API
  tests.
- Installation, maintenance, and support guides that reduce operational
  friction for customer teams.

Customer-facing references:

- `docs/customer-docs/switch-exposure-center/05-user-guide.md`
- `docs/customer-docs/switch-exposure-center/13-integration-quick-starts.md`
- `docs/customer-docs/switch-exposure-center/17-installation-guide.md`
- `docs/customer-docs/switch-exposure-center/18-maintenance-and-patching-runbook.md`
- `docs/customer-docs/switch-exposure-center/19-support-engagement-guide.md`

---

## Residual risk and transparency

No software system is risk-free. The current release posture is high-confidence,
with transparent residual-risk handling based on:

- Continuous static and semantic analysis.
- Regular full regression execution before release decisions.
- Documented vulnerability reporting process and remediation targets.
- Ongoing operational hardening and release gate governance.

---

## Customer confidence conclusion

Based on the present evidence set, Switch Exposure Center demonstrates a
strong and verifiable security and quality posture suitable for customer
evaluation and production planning on the documented deployment baseline.

This report should be shared together with the security policy, OWASP
scorecard, deployment guide, and support runbooks as part of customer
due-diligence and onboarding.
