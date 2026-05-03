# 14. Quick Start — CI/CD Compliance Gate

| Field | Value |
| --- | --- |
| Time to complete | 20–30 minutes |
| Prerequisites | Toolkit installed; Python 3.8+; CI pipeline with shell step access |

---

## Objective

Block pipeline progression when the host's security posture or report quality
does not meet defined thresholds. Common uses:

- Block deployment to staging/production if a target host has `[FAIL]` findings.
- Gate infrastructure-as-code pipelines on host compliance score.
- Generate compliance evidence artefacts as pipeline build outputs.

## Step 1 — Run the audit in the pipeline

Add a shell step that runs the audit and writes the report to a known path:

```bash
sudo audit-toolkit --auto --json /tmp/audit-report.json
```

If running in a CI environment where root is not available, use the privilege
model appropriate to your runner and accept that coverage may be reduced.

## Step 2 — Validate the report schema

Fail the pipeline immediately if the report is malformed:

```bash
python3 /opt/audit-toolkit/ci/validate-report-schema.py /tmp/audit-report.json
```

A non-zero exit code means the report failed validation; the pipeline should
not proceed.

## Step 3 — Evaluate posture thresholds

Use the following Python evaluation script, adjusting thresholds to your policy:

```python
#!/usr/bin/env python3
# CI compliance gate -- fail pipeline if posture thresholds are not met.
import json
import sys

COVERAGE_THRESHOLD = 80   # minimum coverage_score
CONFIDENCE_THRESHOLD = 60  # minimum confidence_score
MAX_FAIL_COUNT = 0         # maximum allowed [FAIL] findings (0 = zero tolerance)

with open("/tmp/audit-report.json") as f:
    report = json.load(f)

completeness = report.get("completeness", {})
hardening = report.get("hardening", {}) or {}
updates = report.get("updates", {}) or {}

failures = []

coverage = float(completeness.get("coverage_score", 0))
if coverage < COVERAGE_THRESHOLD:
    failures.append(f"Coverage score {coverage:.1f} below threshold {COVERAGE_THRESHOLD}")

confidence = float(completeness.get("confidence_score", 0))
if confidence < CONFIDENCE_THRESHOLD:
    failures.append(f"Confidence score {confidence:.1f} below threshold {CONFIDENCE_THRESHOLD}")

fail_count = int(hardening.get("fail", 0))
if fail_count > MAX_FAIL_COUNT:
    failures.append(f"Hardening FAIL count {fail_count} exceeds threshold {MAX_FAIL_COUNT}")

if failures:
    print("COMPLIANCE GATE FAILED:")
    for msg in failures:
        print(f"  - {msg}")
    sys.exit(1)

print(f"Compliance gate passed — coverage={coverage:.1f}, confidence={confidence:.1f}, fail={fail_count}")
sys.exit(0)
```

Save as `ci/compliance-gate.py` and run:

```bash
python3 ci/compliance-gate.py
```

## Step 4 — Preserve the report as a build artefact

Most CI platforms support storing build artefacts. Preserve the report for
audit trail and evidence purposes:

```yaml
# GitHub Actions example
- name: Upload audit report
  uses: actions/upload-artifact@v4
  with:
    name: audit-report-${{ github.run_id }}
    path: /tmp/audit-report.json
    retention-days: 90
```

## Complete GitHub Actions example

```yaml
name: Security Compliance Gate

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install AuditToolkit
        run: sudo dpkg -i dist/audit-toolkit-lite_1.1.0_all.deb

      - name: Run security audit
        run: sudo audit-toolkit --auto --json /tmp/audit-report.json

      - name: Validate report schema
        run: python3 /opt/audit-toolkit/ci/validate-report-schema.py /tmp/audit-report.json

      - name: Run compliance gate
        run: python3 ci/compliance-gate.py

      - name: Upload audit artefact
        uses: actions/upload-artifact@v4
        with:
          name: audit-report-${{ github.run_id }}
          path: /tmp/audit-report.json
          retention-days: 90
```

## Threshold guidance

| Environment | Recommended coverage threshold | FAIL tolerance |
| --- | --- | --- |
| Development / feature branch | 60 | ≤ 5 |
| Staging / integration | 80 | ≤ 2 |
| Production pre-deployment | 90 | 0 |

Use stricter thresholds for production; this ensures the compliance gate
provides meaningful assurance rather than only catching gross failures.
