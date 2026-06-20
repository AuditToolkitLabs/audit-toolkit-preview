# AuditToolkit Linux Host Lite — Activation and First Audit

## Purpose

After installing the package, the primary customer workflow is: activate the
product, run an audit, and review the results. This page covers those steps
and the offline alternative for air-gapped environments.

## Prerequisites

- The `audittoolkit-linux-host-lite` package is installed from the DEB or RPM
  release bundle.
- For online activation: outbound HTTPS access to the AuditToolkitLabs
  licensing service is available from the host.
- For offline activation: a signed offline licence file has been obtained from
  AuditToolkitLabs before the host is placed in an air-gapped environment.

## Online Activation

```bash
audittoolkit-linux-host-lite activate --key <YOUR_LICENCE_KEY>
```

Licence state is cached at `~/.audittoolkit/linux-host-lite/licence.json`.
Network access is only required for initial activation and optional renewal.
Subsequent audit runs do not contact the licensing service.

Confirm activation status:

```bash
audittoolkit-linux-host-lite status
```

## Offline Licence Import

For hosts without internet access, import a signed offline licence file
obtained from AuditToolkitLabs:

```bash
audittoolkit-linux-host-lite import-license /path/to/licence.json
```

Offline licence files must not be edited, copied between hosts, or re-signed
locally. See [Licensing Overview](../../../licensing/overview.md) for the full
offline licence policy.

## Running an Audit

```bash
audittoolkit-linux-host-lite run
```

By default, results are written to the configured output path. To specify a
custom path:

```bash
audittoolkit-linux-host-lite run --output-path /path/to/output
```

To run a specific scan profile:

```bash
audittoolkit-linux-host-lite run --profile <profile-name>
```

## Output Files

After a successful run, four files are written to the output path:

| File               | Contents                                                              |
| ------------------ | --------------------------------------------------------------------- |
| `audit-result.json` | Full audit result — findings, scores, coverage, baseline references. |
| `metadata.json`     | Host identity, run timestamp, coverage percent.                      |
| `findings.csv`      | Flat findings export for import or spreadsheet review.               |
| `summary.html`      | Human-readable report — open in any browser.                         |

## Exit Codes

| Code | Meaning                                                      |
| ---- | ------------------------------------------------------------ |
| 0    | Audit completed — all checks passed.                         |
| 3    | Licence error — activate or import a licence before running. |
| 4    | Audit completed — one or more checks produced findings.      |

Exit code 4 is a normal audit outcome when findings exist. It does not indicate
a tool failure. Review the findings and summary report to assess severity and
remediation priority.

## Reviewing Results

Open `summary.html` in a browser for a structured view of category scores,
findings, and the overall Hardening Index.

For programmatic use, parse `audit-result.json`. The `findings` array contains
individual check results including severity, check ID, baseline references, and
status. The `Coverage` object describes how many modules ran and whether any
were missing.

## Validation Checklist

After the first run:

- Confirm four output files exist in the output path.
- Open `summary.html` and verify the host name, run timestamp, and Hardening
  Index are present.
- Confirm the exit code matches the expected outcome.
- If exit code 3: run the activation or import command before retrying.
- Review any findings with severity `High` or `Critical` for priority action.

## Related Guidance

- [Linux Host Lite Overview](00-overview.md)
- [Licensing Overview](../../../licensing/overview.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
