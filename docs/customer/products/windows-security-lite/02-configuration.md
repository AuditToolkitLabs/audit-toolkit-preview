# AuditToolkit Windows Security Lite — Configuration and Scan Profiles

## Purpose

This page describes the runtime configuration surface for Windows Security Lite:
the command-line options, scan profiles, licence state location, and output
path. The tool has no configuration file — behaviour is controlled entirely by
command-line options and the selected scan profile. The GUI launcher runs the
default profile through the same engine.

## Command-Line Options

| Option            | Default                                                        | Description                                     |
| ----------------- | ------------------------------------------------------------- | ----------------------------------------------- |
| `-OutputPath PATH` | `%LOCALAPPDATA%\AuditToolkitLabs\AuditToolkitLite\latest`     | Directory where audit output files are written. |
| `-Profile PROFILE` | `default`                                                     | Scan profile — controls which modules run.      |

Example — run the default profile to a custom path:

```powershell
audittoolkit-windows-security-lite run -OutputPath C:\Audit\Output -Profile default
```

## Scan Profiles

Scan profiles are JSON files that declare which audit modules execute. The
`EnabledModules` list in the profile controls module selection and grouping.

When installed from the MSI, the default profile ships at:

```
C:\Program Files\AuditToolkitLabs\AuditToolkitLite\src\profiles\default.json
```

To run a non-default profile, pass its name (without the `.json` extension) to
`-Profile`. Only profiles present in the installed `profiles\` directory are
valid. Treat the shipped, signed profile set as read-only; do not edit installed
profiles in place.

## Licence State

Licence state is cached locally after activation or offline import at:

```
%LOCALAPPDATA%\AuditToolkitLabs\AuditToolkitLite\licence.json
```

This file is written once on activation and read on every subsequent run. It is
host-specific and must not be copied between hosts. See
[Licensing Overview](../../../licensing/overview.md) for the full policy.

## Output Path Behaviour

Each run writes a complete, self-contained set of output files to the
`-OutputPath` directory, overwriting the previous run's files in that path. When
installed via MSI, the default path is
`%LOCALAPPDATA%\AuditToolkitLabs\AuditToolkitLite\latest`. To retain history,
direct each run to a timestamped path or archive the output directory after each
run.

## Related Guidance

- [Windows Security Lite Overview](00-overview.md)
- [Installation and First Audit](01-installation-and-first-audit.md)
- [Output Schema Reference](03-output-schema-reference.md)
- [CI/CD Gate Integration](04-ci-cd-integration.md)
- [Licensing Overview](../../../licensing/overview.md)
