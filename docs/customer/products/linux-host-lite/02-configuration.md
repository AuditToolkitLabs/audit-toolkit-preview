# AuditToolkit Linux Host Lite — Configuration and Scan Profiles

## Purpose

This page describes the runtime configuration surface for Linux Host Lite: the
command-line options, scan profiles, licence state location, and output path.
The tool has no configuration file — behaviour is controlled entirely by
command-line options and the selected scan profile.

## Command-Line Options

| Option              | Default        | Description                                          |
| ------------------- | -------------- | ---------------------------------------------------- |
| `--output-path PATH` | `dist/latest`  | Directory where audit output files are written.      |
| `--profile PROFILE`  | `default`      | Scan profile — controls which modules run.           |

Example — run the default profile to a custom path:

```bash
audittoolkit-linux-host-lite run --output-path /var/log/audittoolkit --profile default
```

## Scan Profiles

Scan profiles are JSON files that declare which audit modules execute. The
`EnabledModules` list in the profile controls module selection and grouping.

When installed from a package, the default profile ships at:

```
/opt/audittoolkit/linux-host-lite/src/profiles/default.json
```

To run a non-default profile, pass its name (without the `.json` extension) to
`--profile`. Only profiles present in the installed `profiles/` directory are
valid. Customers should not edit signed installed profiles in place; treat the
shipped profile set as read-only.

## Licence State

Licence state is cached locally after activation or offline import at:

```
~/.audittoolkit/linux-host-lite/licence.json
```

This file is written once on activation and read on every subsequent run. It is
host-specific and must not be copied between hosts. See
[Licensing Overview](../../../licensing/overview.md) for the full policy.

## Output Path Behaviour

Each run writes a complete, self-contained set of output files to the
`--output-path` directory, overwriting the previous run's files in that path.
To retain history, direct each run to a timestamped path or archive the output
directory after each run.

## Related Guidance

- [Linux Host Lite Overview](00-overview.md)
- [Activation and First Audit](01-activation-and-first-audit.md)
- [Output Schema Reference](03-output-schema-reference.md)
- [CI/CD Gate Integration](04-ci-cd-integration.md)
- [Licensing Overview](../../../licensing/overview.md)
