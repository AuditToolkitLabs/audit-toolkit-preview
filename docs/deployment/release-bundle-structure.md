# Release Bundle Structure

## 1. Purpose

This document defines the standard release packaging format delivered to
AuditToolkit customers. It exists to make every customer bundle predictable,
verifiable, and free of internal-only material.

## 2. Bundle Principles

Every release bundle must be:

- Native-package first: MSI for Windows, DEB for Debian-family Linux, RPM for
  RPM-family Linux.
- Self-describing: includes release notes, manifest, checksums, and install
  documentation.
- Customer-safe: excludes source repositories, staging directories, private
  keys, CI configuration secrets, and internal runbooks.
- Verifiable: every delivered artifact is listed in the manifest and checksum
  file.
- Versioned: package versions, manifest version, and documentation version must
  align with the release tag.

## 3. Top-Level Layout

```text
AuditToolkit-<product>-<version>/
|-- README.md
|-- RELEASE-NOTES.md
|-- CUSTOMER-DEPLOYMENT-PACK.md
|-- manifest/
|   |-- release-manifest.json
|   |-- docs-sync.json
|   `-- SHA256SUMS.txt
|-- packages/
|   |-- linux/
|   |   |-- deb/
|   |   |   `-- <product>_<version>_<arch>.deb
|   |   `-- rpm/
|   |       `-- <product>-<version>-<release>.<arch>.rpm
|   `-- windows/
|       `-- <product>-<version>-<arch>.msi
|-- licenses/
|   `-- README.md
|-- legal/
|   |-- EULA.md
|   `-- LIABILITY-DISCLAIMER-AND-INDEMNITY.md
|-- licensing/
|   `-- LICENSING.md
|-- support/
|   |-- collect-diagnostics.ps1
|   `-- collect-diagnostics.sh
`-- checks/
    |-- verify-bundle.ps1
    `-- verify-bundle.sh
```

Products that do not support every operating system may omit unsupported
package folders, but the manifest must explicitly list supported and omitted
targets.

## 4. Required Files

| File                             | Required    | Purpose                                         |
| -------------------------------- | ----------- | ----------------------------------------------- |
| `README.md`                      | Yes         | Short bundle overview and quick start.          |
| `RELEASE-NOTES.md`               | Yes         | Version, changes, known issues, upgrade notes.  |
| `CUSTOMER-DEPLOYMENT-PACK.md`    | Yes         | Customer install and operation guide.           |
| `manifest/release-manifest.json` | Yes         | Machine-readable artifact inventory.            |
| `manifest/docs-sync.json`        | Yes         | Central docs commit and sync evidence.          |
| `manifest/SHA256SUMS.txt`        | Yes         | Checksum list for all customer-delivered files. |
| `packages/`                      | Yes         | Native OS packages.                             |
| `legal/`                         | Yes         | Current approved legal terms.                   |
| `licensing/`                     | Yes         | Customer-facing license operation guidance.     |
| `licenses/README.md`             | Yes         | Explains online and offline license handling.   |
| `support/`                       | Recommended | Customer-safe diagnostics collection scripts.   |
| `checks/`                        | Recommended | Bundle integrity verification scripts.          |

## 5. Manifest Schema

The release manifest must be JSON and include at least the following fields:

```json
{
  "schema": "audittoolkit.release-manifest.v1",
  "product": "audit-tool",
  "version": "6.4.10",
  "releaseDate": "2026-06-11",
  "commit": "<source-commit>",
  "docsCommit": "<audittoolkit-docs-commit>",
  "supportedPlatforms": ["windows-x64", "linux-amd64-deb", "linux-amd64-rpm"],
  "artifacts": [
    {
      "path": "packages/linux/deb/audit-tool_6.4.10_amd64.deb",
      "type": "deb",
      "os": "linux",
      "architecture": "amd64",
      "sha256": "<sha256>"
    }
  ],
  "services": [
    {
      "name": "audit-tool.service",
      "platform": "linux",
      "startup": "enabled"
    }
  ],
  "documentation": [
    "README.md",
    "RELEASE-NOTES.md",
    "CUSTOMER-DEPLOYMENT-PACK.md",
    "legal/EULA.md",
    "legal/LIABILITY-DISCLAIMER-AND-INDEMNITY.md",
    "licensing/LICENSING.md"
  ]
}
```

Additional product-specific fields are allowed, but required fields must remain
stable for validation tooling.

## 6. Package Naming Standard

### DEB

```text
<product>_<version>_<arch>.deb
```

Example:

```text
audit-tool_6.4.10_amd64.deb
```

### RPM

```text
<product>-<version>-<release>.<arch>.rpm
```

Example:

```text
audit-tool-6.4.10-1.x86_64.rpm
```

### MSI

```text
<product>-<version>-<arch>.msi
```

Example:

```text
audit-tool-6.4.10-x64.msi
```

## 7. Checksum Standard

`manifest/SHA256SUMS.txt` must include every file delivered in the customer
bundle except the checksum file itself.

Format:

```text
<sha256>  <relative-path>
```

Example:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef  packages/linux/deb/audit-tool_6.4.10_amd64.deb
```

Paths must be relative to the bundle root and use forward slashes.

## 8. Customer-Safe Support Scripts

Support scripts may collect:

- Service status
- Package inventory
- Product version
- Product logs
- Health endpoint output
- License status summary without secret values
- Operating system information

Support scripts must not collect:

- Passwords
- API tokens
- Private keys
- Raw license signing keys
- Full database dumps unless explicitly approved
- Internal operator configuration

## 9. Excluded Material

The following must never appear in a customer release bundle:

- `.git/` directories or source repository metadata
- Build staging folders such as `.stage/`, `out/`, `dist/`, or temporary nFPM
  extraction directories unless the folder is the intentional final bundle root
- Control Centre source or runtime data
- Internal operator runbooks
- CI secrets, Keygen administrator tokens, or signing keys
- Private offline-license keys
- Test-only fixtures, mock credentials, or generated caches
- Local developer virtual environments
- Raw source archives as the deployment mechanism

## 10. Bundle Validation Gate

Before a bundle is released, validation must confirm:

- All manifest paths exist.
- All checksum entries match the files on disk.
- Every package has the expected version.
- Installer metadata uses the standard application, config, data, and log
  locations.
- Customer documentation is present.
- Internal-only documentation is absent.
- No private keys or common secret markers are present.
- Native packages install successfully in validation environments.
- Services start automatically after installation and reboot.
- License validation succeeds in the supported online or offline mode.

## 11. Release Bundle Readiness Checklist

Use this checklist before handoff:

- Release tag approved
- CI package builds passed
- Licensing contract tests passed
- Execution contract tests passed where applicable
- MSI, DEB, and RPM artifacts present for supported platforms
- Manifest complete and schema-valid
- Checksums generated and verified
- Customer deployment guide included
- Release notes included
- Legal and licensing docs synced from `AuditToolkit-Docs`
- `scripts/validate-release-bundle-docs.ps1` passed for the bundle root
- Internal operator material excluded
- Support scripts reviewed for customer-safe output
- Bundle installed successfully on at least one supported Windows target where
  Windows is supported
- Bundle installed successfully on at least one supported DEB target where DEB is
  supported
- Bundle installed successfully on at least one supported RPM target where RPM is
  supported

## 12. Versioning and Retention

Release bundles must be immutable after publication. If an artifact must change,
publish a new version or rebuild number and generate a new manifest and checksum
file.

Retain internally:

- The final customer bundle
- The manifest and checksums
- Build logs
- CI validation output
- Package install validation evidence
- The commit and tag used for the build
- The central docs commit used for the bundle sync

Do not retain customer secrets or private signing keys inside release evidence.
