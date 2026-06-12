# Document Consolidation Review

Generated: 2026-06-11

## Scope

Reviewed documentation under `F:\AuditProducts`, including product repository
documentation locations and shared folders that sit outside the current
multi-root workspace.

Included locations:

- `*/customer-docs/`
- `*/docs/`
- root `README.md`, `INSTALL.md`, and `CONFIG.md`
- shared non-workspace folders: `legal/`, `docs/`, and `contracts/`

Excluded from this pass: dependency folders, virtual environments, build output,
package staging, caches, and generated runtime output.

## Inventory Summary

| Metric | Count |
| --- | ---: |
| Documentation files reviewed | 598 |
| Exact duplicate content groups | 9 |
| Repeated filename groups | 68 |

### Documents By Top-Level Folder

| Folder | Count |
| --- | ---: |
| `Audit-Tool-` | 246 |
| `audittoolkit-linux-security-lite` | 98 |
| `Switch-Exposure-Center` | 75 |
| `cmdb-api-data-collection-tool` | 73 |
| `Asset-Command-Centre` | 67 |
| `audit-assurance-node` | 16 |
| `AuditToolkit-Control-Centre` | 7 |
| `docs` | 7 |
| `contracts` | 5 |
| `legal` | 3 |
| `AuditToolkit-Docs` | 1 |

### Documents By Classification

| Type | Count |
| --- | ---: |
| OTHER | 178 |
| API | 116 |
| USAGE | 62 |
| INSTALL | 58 |
| EXECUTION | 53 |
| LEGAL | 53 |
| VALIDATION | 35 |
| CONFIG | 26 |
| PACKAGING | 17 |

## Findings

### 1. Consolidation Is Needed

Yes. The workspace has enough duplicated and repeated documentation to justify
central consolidation into `AuditToolkit-Docs`.

The strongest consolidation candidates are:

- Legal and licensing content
- Offline licensing guidance
- Platform/customer documentation pack templates
- API and OpenAPI standards
- Execution/orchestrator standards shared by Audit-Tool and Linux Security Lite
- Validation reports and scorecards
- Release, packaging, and bundle structure docs

### 2. Shared Material Exists Outside Product Repos

Shared documentation already exists outside the product repos:

- `legal/EULA.md`
- `legal/LIABILITY-DISCLAIMER-AND-INDEMNITY.md`
- `docs/ARCHITECTURE.md`
- `contracts/*`

These should be treated as migration sources or legacy shared sources, not as
additional long-term authorities. The long-term authority should be
`AuditToolkit-Docs`, with shared outside-workspace copies either removed,
archived, or turned into pointers after migration.

### 3. Legal Docs Are Duplicated Across Products

Legal documents appear in multiple product locations and shared folders.

Examples:

- `legal/EULA.md`
- `Asset-Command-Centre/customer-docs/legal/EULA.md`
- `Switch-Exposure-Center/docs/EULA.md`
- `Audit-Tool-/customer-docs/LICENSE-EULA.md`
- `cmdb-api-data-collection-tool/LICENSE-EULA.md`
- liability/indemnity docs in Linux Lite and Switch customer docs

Recommendation: keep the approved central versions in:

- `AuditToolkit-Docs/legal/eula.md`
- `AuditToolkit-Docs/legal/liability-disclaimer-and-indemnity.md`

Product repos should keep only a short legal pointer or release-bundle copy
generated from the central sync model.

### 4. Licensing Docs Are Repeated In Nearly Every Product

`LICENSING.md` exists in six product repos:

- `Asset-Command-Centre/docs/LICENSING.md`
- `audit-assurance-node/docs/LICENSING.md`
- `Audit-Tool-/docs/LICENSING.md`
- `audittoolkit-linux-security-lite/docs/LICENSING.md`
- `cmdb-api-data-collection-tool/docs/LICENSING.md`
- `Switch-Exposure-Center/docs/LICENSING.md`

`OFFLINE-LICENSING.md` appears in five product repos.

Recommendation: centralize policy and entitlement rules in
`AuditToolkit-Docs/licensing/overview.md`; add separate central pages for
offline licensing, entitlement units, and key rotation. Local repos should keep
only product-specific license paths or UI instructions.

### 5. Customer Documentation Packs Are Template-Duplicated

The numbered customer-doc packs are repeated across five products, including:

- `01-purpose-and-audience.md`
- `03-roles-and-governance.md`
- `04-service-transition.md`
- `06-administration.md`
- `07-operations-and-support.md`
- `08-change-management.md`
- `09-security.md`
- `10-monitoring-and-reporting.md`
- `11-continual-improvement.md`
- `12-appendices.md`

Recommendation: move shared customer-service-management templates central, then
keep per-product customer docs only where the content is product-specific.

### 6. Audit-Tool and Linux Security Lite Share Exact Docs

Exact duplicate content was found between `Audit-Tool-` and
`audittoolkit-linux-security-lite`, including:

- `docs/05-ci-cd.md`
- `docs/06-library-api-reference.md`
- `docs/11-orchestrator-examples.md`
- license example files under `docs/licensing-examples/`

Same-name duplicates also include many shared framework docs:

- `00-overview.md`
- `03-developer-guide.md`
- `04-audit-authoring.md`
- `07-architecture.md`
- `07-cis-nist-compliance-mapping.md`
- `08-openrc-migration-guide.md`
- `09-linux-least-privilege-guide.md`
- `14-api-usage-guide.md`

Recommendation: move common Linux audit framework docs central and leave
product-local notes for path differences only.

### 7. API Docs Are A Major Consolidation Area

The review classified 116 API-related docs or contract files. Repeated API names
and OpenAPI files exist across products, including `openapi.json`,
`openapi.yaml`, API references, contract schemas, webhook guides, and integration
guides.

Recommendation: centralize API standards, schemas, and cross-product conventions
under `AuditToolkit-Docs/api/`. Product repos may keep generated API references
only when generated directly from product source.

### 8. Validation And Scorecard Docs Should Move Central

Validation, readiness, quality, and scorecard docs appear across repos, with 35
files classified as validation-oriented and repeated OWASP scorecard material.

Recommendation: move final validation reports, security scorecards, release
readiness, and packaging evidence into `AuditToolkit-Docs/validation/`. Keep only
local validation commands in product repos.

## Exact Duplicate Groups

The exact duplicate scan found these groups:

| Duplicate content | Paths |
| --- | --- |
| Liability/indemnity customer doc | `audittoolkit-linux-security-lite/customer-docs/28-liability-disclaimer-and-indemnity.md`; `Switch-Exposure-Center/docs/customer-docs/switch-exposure-center/28-liability-disclaimer-and-indemnity.md` |
| Library API reference | `Audit-Tool-/docs/06-library-api-reference.md`; `audittoolkit-linux-security-lite/docs/06-library-api-reference.md` |
| CI/CD doc | `Audit-Tool-/docs/05-ci-cd.md`; `audittoolkit-linux-security-lite/docs/05-ci-cd.md` |
| CMDB screenshot storage state | `cmdb-api-data-collection-tool/customer-docs/screenshots/storage_state.json`; `cmdb-api-data-collection-tool/docs/assets/screenshots/v0.2.5/storage_state.json` |
| AGPL license example | `Audit-Tool-/docs/licensing-examples/LICENSE-AGPL-EXAMPLE.txt`; `audittoolkit-linux-security-lite/docs/licensing-examples/LICENSE-AGPL-EXAMPLE.txt` |
| CMDB screenshot manifest | `cmdb-api-data-collection-tool/customer-docs/screenshots/manifest.csv`; `cmdb-api-data-collection-tool/docs/assets/screenshots/v0.2.5/manifest.csv` |
| Orchestrator examples | `Audit-Tool-/docs/11-orchestrator-examples.md`; `audittoolkit-linux-security-lite/docs/11-orchestrator-examples.md` |
| Linux Lite OWASP scorecard | `audittoolkit-linux-security-lite/customer-docs/OWASP-SECURITY-SCORECARD.md`; `audittoolkit-linux-security-lite/docs/OWASP-SECURITY-SCORECARD.md` |
| BSL license example | `Audit-Tool-/docs/licensing-examples/LICENSE-BSL-EXAMPLE.txt`; `audittoolkit-linux-security-lite/docs/licensing-examples/LICENSE-BSL-EXAMPLE.txt` |

## Recommended Consolidation Model

Use `AuditToolkit-Docs` as the single documentation authority.

Recommended central structure:

- `legal/` for EULA, liability, notices, privacy, legal contacts
- `licensing/` for tiers, online activation, offline licensing, entitlements,
  key rotation, and drift handling
- `platform/` for architecture, deployment model, data flow, security model
- `api/` for API standards, OpenAPI conventions, schemas, webhook contracts
- `execution/` for execution standards, adapter contracts, agent contracts
- `deployment/` for customer deployment pack, release bundle structure,
  MSI/DEB/RPM install standards, upgrades, rollback
- `validation/` for release gates, readiness reports, security scorecards,
  packaging evidence
- `products/<product>/` for customer-facing product pages and central product
  landing pages
- `releases/<product>/<version>/` for release notes and versioned release docs

## Per-Repo Local Documentation Standard

Each product repo should keep only:

- Minimal `README.md`
- `INSTALL.md` if install steps are repo/product-specific
- `CONFIG.md` if config keys are product-specific
- Tool-specific usage examples that belong next to source
- Generated API docs only when generated from current product source
- Short pointers to central legal, licensing, deployment, API, and validation
  authority pages

## Priority Migration Plan

1. **Legal first**: replace product-local legal duplicates with links to
   `AuditToolkit-Docs/legal/` and ensure release bundles sync legal docs from
   central.
2. **Licensing second**: move `LICENSING.md` and `OFFLINE-LICENSING.md` policy
   content central; keep local path-specific notes only.
3. **Customer pack templates third**: centralize the shared numbered customer-doc
   templates and keep product-specific variants only where necessary.
4. **Audit framework docs fourth**: consolidate exact duplicates between
   `Audit-Tool-` and `audittoolkit-linux-security-lite`.
5. **API/contracts fifth**: centralize API standards and shared schemas; keep
   generated product OpenAPI references local or publish generated copies to
   central release pages.
6. **Validation/release docs sixth**: move final reports, readiness status,
   scorecards, and release evidence central.
7. **Enforcement last**: add checks that fail on duplicated legal/licensing text
   or release bundles missing `manifest/docs-sync.json`.

## Answer To The Review Question

Yes, consolidation is needed. The review found repeated docs across product
repos and confirmed that authoritative-looking legal and architecture material
also exists outside the current multi-root workspace folders. The right target is
the new `AuditToolkit-Docs` repo, with product repos reduced to minimal local
context and central links.

Do not delete local docs immediately. The safer next step is a staged migration:
centralize one category at a time, replace product-local duplicates with links,
and keep release bundles populated through `scripts/sync-release-bundle-docs.ps1`.
