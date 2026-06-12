# Customer Documentation Source of Truth Policy

Status: active
Effective date: 2026-06-12

## 1. Purpose

This policy defines the authoritative source for all customer documentation
served by this preview repository.

## 2. Authoritative Repository

The primary baseline source for customer documentation is:

- `F:/AuditProducts/AuditToolkit-Docs`

Because the baseline source can be offline, this preview repository
(`audit-toolkit-preview`) must also contain a complete local working copy of
all website customer documentation.

## 3. Governance Contract

The following rules are mandatory:

1. Customer documentation must be authored and approved in
   `F:/AuditProducts/AuditToolkit-Docs` when that source is available.
2. Files under `customer-docs/` in this repository are the operational local
   source used by the website and may be updated directly to maintain service
   continuity when the baseline source is offline.
3. Local updates in this repository must be treated as governed changes and
   tracked with release/sync evidence.
4. When the baseline source becomes available, reconcile local changes back to
   `AuditToolkit-Docs` and re-align both repositories.
5. Website publication must always use the local files in this repository.

## 4. Scope

This policy applies to all content under `customer-docs/`, including:

- Product customer guides and indexes
- Administration guides
- Operator runbooks
- Licensing and legal customer documents
- Customer-facing release documentation

## 5. Auditability Requirements

For each customer documentation release, local update, or sync event, record:

- Source commit/tag from `AuditToolkit-Docs` (if used)
- Sync date/time
- Operator or automation identity
- Target release identifier (if applicable)
- Whether the change was `central-sync`, `local-offline-update`, or
   `reconciliation`

Mandatory ledger location:

- `docs-sync-ledger.md` at repository root

Ledger entry format must include:

- Date: `YYYY-MM-DD`
- Type: `LOCAL_UPDATE` | `CENTRAL_SYNC` | `RECONCILIATION`
- Source: `local` | `central`
- Files Affected: list of paths
- Description: change summary
- Sync Status: `pending` | `synced` | `rejected`

Store reconciliation evidence in the same release/sync records used by the
team.

## 6. Exception Handling

Emergency edits in this repository are allowed to preserve customer support and
website accuracy. These edits must still be reconciled back to
`AuditToolkit-Docs` when the baseline source is available.

## 7. Reconciliation Rules

1. Central docs remain authoritative for permanent history.
2. Local updates are allowed for offline continuity but are non-authoritative
   until reconciled.
3. Website repo must not directly overwrite central docs without central review
   and PR process.
4. When both central and local changed the same file, central is baseline and
   local deltas are manually reviewed before merge.
5. After reconciliation, sync direction returns to central -> website.
