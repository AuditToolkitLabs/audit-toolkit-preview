# Documentation Sync Ledger

Purpose: Mandatory audit trail for documentation updates performed in the
website repository outside normal central-source sync windows.

Entry schema:

- Date: YYYY-MM-DD
- Type: LOCAL_UPDATE | CENTRAL_SYNC | RECONCILIATION
- Source: local | central
- Files Affected: [list]
- Description: [what changed]
- Sync Status: pending | synced | rejected

---

Date: 2026-06-12
Type: LOCAL_UPDATE
Source: local
Files Affected:

- customer-docs/SOURCE-OF-TRUTH-POLICY.md
- customer-docs/README.md
- README.md
- docs.html
- customer-docs/audit-toolkit/README.md
- customer-docs/cmdb-api/README.md
- customer-docs/asset-command-center/README.md
- customer-docs/linux-security-lite/README.md
- customer-docs/Switch Exposure Centre/README.md

Description: Implemented offline-first source governance and local-store wording for website documentation.
Sync Status: pending

---

Date: 2026-06-12
Type: LOCAL_UPDATE
Source: local
Files Affected:

- OFFLINE-DOC-SYNC-RECONCILIATION-MODEL.md
- docs-sync-ledger.md

Description: Added formal offline sync and reconciliation operating model and mandatory ledger.
Sync Status: pending

---

Date: 2026-06-12
Type: LOCAL_UPDATE
Source: local
Files Affected:

- customer-docs/audit-toolkit/index.md
- customer-docs/cmdb-api/index.md
- customer-docs/asset-command-center/index.md
- customer-docs/linux-security-lite/index.md
- customer-docs/Switch Exposure Centre/index.md
- ci/validate-docs-sync-ledger.py
- .github/workflows/docs-sync-ledger-guard.yml

Description: Added offline reconciliation checklist sections and CI guard to require sync-ledger updates for documentation changes.
Sync Status: pending
