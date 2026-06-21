# AuditToolkit Linux Host Lite — CI/CD Gate Integration

## Purpose

This page describes how to run Linux Host Lite non-interactively inside a CI/CD
pipeline or scheduled job and how to gate a build or deployment on the audit
outcome. The tool is self-contained (Python standard library only, no network
at run time), which makes it suitable for use as a pipeline compliance gate.

## Non-Interactive Execution

Run the audit to a known output path and let the process exit code drive the
gate:

```bash
audittoolkit-linux-host-lite run --output-path "$CI_PROJECT_DIR/audit-output" --profile default
```

No interactive prompts are issued. The licence must already be activated (or an
offline licence imported) on the runner before this step — see below.

## Gating on Exit Code

| Code | Pipeline interpretation                                              |
| ---- | ------------------------------------------------------------------- |
| 0    | Pass — all checks passed; allow the build to continue.              |
| 3    | Fail the job — licence not activated on the runner.                 |
| 4    | Findings present — decide policy (see "Severity-Based Gating").     |

Because exit code 4 is a normal audit outcome (findings exist, tool ran fine),
a pipeline must decide explicitly whether the presence of findings should fail
the build. A simple "fail on any finding" gate treats both 0 and any non-zero
as the decision point; a severity-based gate inspects `audit-result.json`.

## Severity-Based Gating

To fail only on high-impact findings, parse `audit-result.json` and inspect the
`Findings` array for `Status` of `FAIL` at or above a chosen `Severity`:

```bash
audittoolkit-linux-host-lite run --output-path ./audit-output || true
python3 - <<'PY'
import json, sys
r = json.load(open("audit-output/audit-result.json"))
blocking = [f for f in r["Findings"]
            if f.get("Status") == "FAIL" and f.get("Severity") in ("High", "Critical")]
if blocking:
    print(f"Gate failed: {len(blocking)} High/Critical findings")
    sys.exit(1)
PY
```

## Collecting Evidence Artifacts

Publish the full output directory as a pipeline artifact so each run's evidence
is retained for audit:

| Artifact            | Use                                                       |
| ------------------- | --------------------------------------------------------- |
| `audit-result.json` | Machine-readable evidence and severity gating.            |
| `metadata.json`     | Run provenance — host, timestamp, coverage.               |
| `findings.csv`      | Import into dashboards or compliance trackers.            |
| `summary.html`      | Human-readable report attached to the build record.       |

## Licensing in CI

CI runners must be licensed before the audit step. For ephemeral runners,
import a signed offline licence at the start of the job:

```bash
audittoolkit-linux-host-lite import-license "$AUDITTOOLKIT_LICENCE_FILE"
```

Store the offline licence file as a protected CI secret. Do not edit, re-sign,
or share it between unrelated hosts. See
[Licensing Overview](../../../licensing/overview.md) for the offline licence
policy.

## Related Guidance

- [Linux Host Lite Overview](00-overview.md)
- [Configuration and Scan Profiles](02-configuration.md)
- [Output Schema Reference](03-output-schema-reference.md)
- [Licensing Overview](../../../licensing/overview.md)
