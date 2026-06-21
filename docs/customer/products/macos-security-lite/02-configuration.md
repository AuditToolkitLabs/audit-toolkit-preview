# AuditToolkit macOS Security Lite — Configuration and Scan Profiles

## Purpose

This page describes the runtime configuration surface for macOS Security Lite:
the command-line options, scan profiles, licence state location, output path,
and the local web report viewer. The tool has no configuration file — behaviour
is controlled entirely by command-line options and the selected scan profile.

## Command-Line Options

| Option              | Default                                                                   | Description                                     |
| ------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- |
| `--output-path PATH` | `~/Library/Application Support/AuditToolkitLabs/AuditToolkitLite/latest`  | Directory where audit output files are written. |
| `--profile PROFILE`  | `default`                                                                 | Scan profile — controls which modules run.      |

Example — run the default profile to a custom path:

```bash
audittoolkit-macos-security-lite run --output-path ~/audit-output --profile default
```

## Scan Profiles

Scan profiles are JSON files that declare which audit modules execute. The
`EnabledModules` list in the profile controls module selection and grouping.

When installed, the default profile ships inside the application bundle at:

```
/Applications/AuditToolkit-macOS-Security-Lite.app/Contents/Resources/runtime/profiles/default.json
```

To run a non-default profile, pass its name (without the `.json` extension) to
`--profile`. Only profiles present in the installed `runtime/profiles/`
directory are valid. Treat the shipped profile set as read-only; do not edit
profiles inside the signed application bundle.

## Licence State

Licence state is cached locally after activation or offline import at:

```
~/.audittoolkit/macos-security-lite/licence.json
```

This file is written once on activation and read on every subsequent run. It is
host-specific and must not be copied between hosts. See
[Licensing Overview](../../../licensing/overview.md) for the full policy.

## Web Report Viewer

macOS Security Lite includes a local web viewer for browser-based report review:

```bash
audittoolkit-macos-security-lite web
```

This starts a server at `http://127.0.0.1:8766` and reads the most recent
`macos-security-report.json` for status, scores, and findings. The server binds
to localhost only and does not expose findings to the network.

## Output Path Behaviour

Each run writes its output files to the `--output-path` directory, overwriting
the previous run's files in that path. To retain history, direct each run to a
timestamped path or archive the output directory after each run.

## Related Guidance

- [macOS Security Lite Overview](00-overview.md)
- [Gatekeeper and First Audit](01-gatekeeper-and-first-audit.md)
- [Output Schema Reference](03-output-schema-reference.md)
- [Licensing Overview](../../../licensing/overview.md)
