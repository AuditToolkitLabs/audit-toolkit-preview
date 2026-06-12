# AuditToolkit - Offline Documentation Sync and Reconciliation Model

## Purpose

Define the controlled operating model for documentation when:

- The website repository operates independently of central docs
- Documentation updates may occur offline
- Synchronization to central docs must be controlled, auditable, and reversible

This ensures:

- Central docs remain authoritative
- Website repo remains operational offline
- All changes are traceable
- No unmanaged drift occurs

## 1. Architecture Context

### Central Source of Truth

AuditToolkit-Docs (`F:/AuditProducts/AuditToolkit-Docs`)

Holds:

- Authoritative documentation
- Versioned release documentation
- Legal and licensing
- Validation artifacts

### Website Repository

audit-toolkit-preview

Acts as:

- Local operational documentation store
- Rendering layer (GitHub Pages)
- Offline documentation provider

## 2. Operating Model

### Online Mode

Normal behavior:

AuditToolkit-Docs -> Sync -> Website Repo -> GitHub Pages

### Offline Mode

Allowed behavior:

- Website repo may be updated locally
- Changes must be recorded
- Changes must not bypass governance

### Reconciliation Mode

Once connectivity returns:

- Local changes must be reviewed
- Changes must be applied to central docs
- Website repo re-synchronized from central

## 3. Sync Ledger (Mandatory)

### Ledger Purpose

Track all documentation changes made outside central docs.

### File Location

`docs-sync-ledger.md`

### Required Entry Format

Each entry must include:

- Date: YYYY-MM-DD
- Type: LOCAL_UPDATE | CENTRAL_SYNC | RECONCILIATION
- Source: local | central
- Files Affected: list of paths
- Description: summary of change
- Sync Status: pending | synced | rejected

### Example Entry

Date: 2026-06-12
Type: LOCAL_UPDATE
Source: local
Files Affected: customer-docs/SOURCE-OF-TRUTH-POLICY.md
Description: Updated policy for offline-first local documentation operation.
Sync Status: pending

## 4. Sync Rules

1. Central is authoritative for permanent documentation history.
2. Website repo is a controlled working copy for operations and offline
   continuity.
3. Website repo must not directly overwrite central docs without review and PR
   flow in central.
4. After reconciliation, sync flow resumes from central to website.

## 5. Reconciliation Process

1. Identify pending entries in `docs-sync-ledger.md`.
2. Review local changes and classify as valid improvement or reject.
3. Apply valid changes to AuditToolkit-Docs.
4. Create central PR with message:
   `docs: reconcile offline documentation updates from preview repo`
5. Re-sync website repo from central (for example with
   `sync-docs-to-website.ps1`).
6. Update ledger entries to `synced` or `rejected` with notes.

## 6. Commit Discipline

### Website Repo

Allowed commit intent:

- docs: local update (offline support)
- docs: sync from central
- docs: reconciliation checkpoint

### Central Docs Repo

Allowed commit intent:

- docs: authoritative update
- docs: reconciliation import
- docs: version release

### Prohibited

- Bypassing reconciliation for local-offline updates
- Unlogged documentation modifications in website repo

## 7. Conflict Handling

If both central and local changed the same file:

1. Central version is baseline for comparison.
2. Local changes are reviewed manually.
3. Valid local deltas are merged into central through normal review.

## 8. Integration with Existing Pipeline

Implemented pipeline capabilities include release docs sync, validation, and
packaging docs injection.

Extended flow:

central docs -> website sync -> release bundle -> installer

## 9. Validation Rules

The process must guarantee:

- All website documentation changes are logged
- No silent modifications
- Reconciliation trace exists

## 10. Completion Criteria

Model is operating correctly when:

- Sync ledger exists
- Local changes are recorded
- Reconciliation process is followed
- Central docs are updated after reconciliation
- Website repo is re-synchronized

## 11. Final Model

- Central Docs -> Source of Truth
- Website Repo -> Offline Working Copy
- Sync Ledger -> Audit Trail
- Reconciliation -> Controlled Update

## Final Statement

AuditToolkit documentation operates under a controlled offline-first model.
Documentation changes are traceable, governed, reconciled, and version-aligned.
