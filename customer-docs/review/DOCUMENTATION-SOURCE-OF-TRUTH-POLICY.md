# Documentation Source Of Truth Policy

Status: Active
Date: 2026-06-12

## Policy Statement

Website documentation must be sourced exclusively from AuditToolkit-Docs.

The website repository at E:/repo-splits-2/audit-toolkit-preview must not
contain independently authored documentation content.

All documentation rendered on the public site must originate from
AuditToolkit-Docs via controlled sync.

## Authoritative Scope

AuditToolkit-Docs is the authoritative source for:

- customer documentation
- admin guide
- operator runbook
- legal documentation
- licensing documentation

## Controlled Sync Requirements

1. Preview/presentation repositories may mirror, transform, or index content
   for rendering, but they may not author canonical documentation text.
2. Any documentation update must be authored in AuditToolkit-Docs first.
3. Sync jobs must preserve source traceability (commit SHA and sync timestamp).
4. If drift is detected between presentation content and AuditToolkit-Docs,
   AuditToolkit-Docs remains authoritative and drift must be corrected by
   re-syncing from source.

## Non-Compliance

The following are non-compliant:

- editing canonical documentation directly in presentation repositories
- publishing legal/licensing/admin/operator docs that do not exist in
  AuditToolkit-Docs
- rendering documentation that cannot be traced to a source commit in
  AuditToolkit-Docs

## Governance Linkage

This policy is enforced by release-bundle sync and validation controls where
applicable, and by repository governance for documentation change workflows.
