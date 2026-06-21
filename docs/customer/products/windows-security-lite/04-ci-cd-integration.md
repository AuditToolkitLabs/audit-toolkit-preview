# AuditToolkit Windows Security Lite — CI/CD Gate Integration

## Purpose

This page describes how to run Windows Security Lite non-interactively inside a
CI/CD pipeline or scheduled job and how to gate a build or deployment on the
audit outcome. The tool runs entirely on the local host with no run-time network
dependency, which makes it suitable for use as a pipeline compliance gate on
Windows build agents.

## Non-Interactive Execution

Run the audit through the CLI (not the GUI) to a known output path and let the
process exit code drive the gate:

```powershell
audittoolkit-windows-security-lite run -OutputPath "$env:BUILD_ARTIFACTSTAGINGDIRECTORY\audit-output" -Profile default
```

No interactive prompts are issued. The licence must already be activated (or an
offline licence imported) on the agent before this step — see below.

## Gating on Exit Code

| Code | Pipeline interpretation                                              |
| ---- | ------------------------------------------------------------------- |
| 0    | Pass — all checks passed; allow the build to continue.              |
| 1    | Fail the job — execution error; investigate the agent or runtime.   |
| 3    | Fail the job — licence not activated on the agent.                  |
| 4    | Findings present — decide policy (see "Severity-Based Gating").     |

Because exit code 4 is a normal audit outcome (findings exist, tool ran fine),
the pipeline must decide explicitly whether the presence of findings should fail
the build.

## Severity-Based Gating

To fail only on high-impact findings, parse `audit-result.json` and inspect the
`Findings` array for `Status` of `FAIL` at or above a chosen `Severity`:

```powershell
audittoolkit-windows-security-lite run -OutputPath .\audit-output
$result = Get-Content .\audit-output\audit-result.json -Raw | ConvertFrom-Json
$blocking = @($result.Findings | Where-Object { $_.Status -eq 'FAIL' -and $_.Severity -in 'High','Critical' })
if ($blocking.Count -gt 0) {
    Write-Error "Gate failed: $($blocking.Count) High/Critical findings"
    exit 1
}
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

Build agents must be licensed before the audit step. For ephemeral agents,
import a signed offline licence at the start of the job:

```powershell
audittoolkit-windows-security-lite import-license $env:AUDITTOOLKIT_LICENCE_FILE
```

Store the offline licence file as a protected pipeline secret. Do not edit,
re-sign, or share it between unrelated hosts. See
[Licensing Overview](../../../licensing/overview.md) for the offline licence
policy.

## Related Guidance

- [Windows Security Lite Overview](00-overview.md)
- [Configuration and Scan Profiles](02-configuration.md)
- [Output Schema Reference](03-output-schema-reference.md)
- [Licensing Overview](../../../licensing/overview.md)
