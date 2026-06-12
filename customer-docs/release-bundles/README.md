# Release Bundle Documentation Sync

Release bundles must copy customer-facing documentation from this central docs
repository instead of carrying independent duplicates in product repositories.

This repository is the exclusive source for website-rendered documentation
content. Presentation repositories must consume documentation through controlled
sync and must not carry independently authored documentation.

## Required Flow

1. Build product packages.
2. Create a release bundle staging directory.
3. Run `scripts/sync-release-bundle-docs.ps1` with product, version, and bundle
   root.
4. Run `scripts/validate-release-bundle-docs.ps1` against the same bundle root.
5. Generate or refresh bundle checksums after docs are copied and validated.
6. Record the central docs commit in the bundle manifest.

## Example

```powershell
.\scripts\sync-release-bundle-docs.ps1 `
  -Product audit-tool `
  -Version 6.4.10 `
  -BundleRoot F:\release-staging\AuditToolkit-audit-tool-6.4.10

.\scripts\validate-release-bundle-docs.ps1 `
  -Product audit-tool `
  -Version 6.4.10 `
  -BundleRoot F:\release-staging\AuditToolkit-audit-tool-6.4.10
```

## Validation Gate

The validator fails the release bundle when:

- Any required central document is missing.
- `manifest/docs-sync.json` is missing or does not match product/version input.
- `docsCommit` is missing or `unknown`.
- Internal-only docs, signing material, scripts, CI files, or inventory files are
  present in the customer bundle.

## Boundary

Only customer-facing docs listed in `bundle-docs-manifest.json` may be copied.
Internal operator runbooks, Control Centre docs, signing-key procedures, and CI
implementation notes must not be included in customer bundles.
