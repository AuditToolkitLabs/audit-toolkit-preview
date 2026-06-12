# Central Docs Repo Structure

## 1. Purpose

`AuditToolkit-Docs` is the central, authoritative documentation repository for
the AuditToolkit platform. It consolidates customer-facing and platform-level
documentation that was previously duplicated across product repositories while
allowing each product repo to keep minimal local context.

Primary outcomes:

- One canonical static reference source for all platform documentation content
- One source of truth for legal, licensing, platform, API, execution,
  validation, release, and bundle standards
- One enforced source of truth for customer documentation, admin guides,
  operator runbooks, legal content, and licensing content
- Minimal per-repo documentation limited to install, configuration, README, and
  product-specific usage notes
- A repeatable release-bundle sync model that copies approved central docs into
  customer release bundles

## 2. Authority Rules

### Must Move To Central

The following documentation classes are authoritative in `AuditToolkit-Docs`:

| Class | Examples | Per-repo action |
| --- | --- | --- |
| Legal | EULA, liability, indemnity, notices, legal FAQs | Replace with short pointer or remove duplicate text. |
| Licensing | online/offline licensing, Keygen setup, entitlement maps | Keep only product-specific license path notes locally. |
| Platform architecture | suite architecture, deployment model, data flows | Replace duplicate platform diagrams with central links. |
| API standards | OpenAPI standards, envelope schemas, API conventions | Keep product endpoint references only if generated from code. |
| Execution standards | agent execution, adapter standards, scheduling contracts | Keep product-specific command examples only. |
| Validation reports | readiness reports, security scorecards, release gates | Move final reports and matrices central. |
| Release notes | product release history and bundle notes | Publish centrally; include a copy in release bundles. |
| Packaging standards | MSI/DEB/RPM bundle format, checksums, manifests | Keep only local build commands in product repos. |

### Must Stay Per Repo

The following files remain local to each product repository:

| Local doc | Purpose |
| --- | --- |
| `README.md` | Minimal repo identity, build/test commands, and central docs links. |
| `INSTALL.md` | Product-specific local developer or package install notes. |
| `CONFIG.md` | Product-specific config keys and local examples. |
| Tool-specific usage | CLI examples or workflows unique to that repo. |
| Generated API output | Allowed only when generated from product source and linked centrally. |

### Must Be Removed As Duplication

Remove or replace these with central links:

- Duplicated legal text
- Duplicated licensing policy text
- Duplicated platform architecture explanations
- Duplicated API standards and execution standards
- Old validation reports superseded by central release validation records
- Release notes copied across multiple repos without ownership

## 3. Proposed Repository Layout

```text
AuditToolkit-Docs/
├── README.md
├── CENTRAL-DOCS-REPO-STRUCTURE.md
├── docs-inventory.md
├── index.md
├── legal/
│   ├── eula.md
│   ├── liability-disclaimer-and-indemnity.md
│   └── notices.md
├── licensing/
│   ├── overview.md
│   ├── online-activation.md
│   ├── offline-licensing.md
│   ├── entitlement-model.md
│   └── key-rotation.md
├── platform/
│   ├── architecture.md
│   ├── deployment-model.md
│   ├── data-flows.md
│   ├── security-model.md
│   └── operating-model.md
├── products/
│   ├── audit-tool/
│   ├── audit-assurance-node/
│   ├── asset-command-centre/
│   ├── cmdb-api-data-collection-tool/
│   ├── switch-exposure-center/
│   └── linux-security-lite/
├── api/
│   ├── standards.md
│   ├── authentication.md
│   ├── schemas/
│   └── openapi/
├── execution/
│   ├── execution-standard.md
│   ├── adapter-standard.md
│   ├── fleet-agent-contract.md
│   └── validation-sweep.md
├── deployment/
│   ├── customer-deployment-pack.md
│   ├── operator-runbook.md
│   ├── release-bundle-structure.md
│   ├── windows-msi.md
│   ├── linux-deb-rpm.md
│   └── upgrade-and-rollback.md
├── validation/
│   ├── release-gates.md
│   ├── packaging-evidence/
│   ├── security-scorecards/
│   └── readiness-reports/
├── releases/
│   ├── index.md
│   └── <product>/<version>/release-notes.md
├── release-bundles/
│   ├── README.md
│   └── bundle-docs-manifest.json
├── assets/
│   ├── diagrams/
│   └── screenshots/
├── scripts/
│   └── sync-release-bundle-docs.ps1
└── .github/
    └── workflows/
  └── sync-release-bundle-docs.yml
```

## 4. Migration Map

| Existing source | Central destination | Local repo residue |
| --- | --- | --- |
| `*/customer-docs/*end-user-license-agreement*` | `legal/eula.md` | Link only. |
| `*/customer-docs/*liability*` | `legal/liability-disclaimer-and-indemnity.md` | Link only. |
| `*/docs/LICENSING.md` | `licensing/overview.md` or product subsection | Product license path notes only. |
| `*/docs/OFFLINE-LICENSING.md` | `licensing/offline-licensing.md` | Product file path notes only. |
| `*/docs/*ARCHITECTURE*` | `platform/architecture.md` or product architecture page | Short pointer. |
| `*/docs/*API*` and OpenAPI specs | `api/` | Generated product API reference if needed. |
| `*/docs/*EXECUTION*` and agent contracts | `execution/` | Product examples only. |
| `*/docs/*VALIDATION*`, scorecards, readiness reports | `validation/` | Latest local validation command only. |
| `*/docs/*RELEASE*`, changelogs | `releases/` | Link to central release note. |
| `*/docs/*PACKAGE*`, MSI/DEB/RPM docs | `deployment/` | Local build command only. |

## 5. Per-Repo Minimal README Standard

Each product repo README should eventually follow this pattern:

```markdown
# <Product Name>

Short product purpose.

## Local Development

- Build: `<command>`
- Test: `<command>`
- Package: `<command>`

## Product Usage

Tool-specific examples that belong with the source.

## Documentation

- Customer docs: /customer/products/<product>/
- Deployment: /deployment/customer-deployment-pack.md
- Licensing: /licensing/overview.md
- Legal: /legal/eula.md
```

## 6. Presentation Boundary

This repository stores static documentation content only.

See also: [Documentation Source Of Truth Policy](review/DOCUMENTATION-SOURCE-OF-TRUTH-POLICY.md)

Presentation contract:

- Content source repo: `AuditToolkit-Docs`
- Presentation repo: `E:/repo-splits-2/audit-toolkit-preview`
- Presentation runtime and theming: owned by preview repository
- This repository does not deploy or host the presentation layer

## 7. Release Bundle Auto-Sync Model

Release bundles consume an approved subset of central documentation. The sync
model is intentionally pull-based from central docs into bundle staging so each
bundle carries the same customer-facing deployment, legal, licensing, and
release structure.

### Bundle Docs Manifest

`release-bundles/bundle-docs-manifest.json` defines:

- Source central doc path
- Destination bundle path
- Whether the file is required
- Which products receive the file

### Sync Workflow

`.github/workflows/sync-release-bundle-docs.yml` validates the manifest and can
copy approved documentation into a release bundle staging directory.

Inputs:

- `product`
- `version`
- `bundleRoot`

Outputs:

- `CUSTOMER-DEPLOYMENT-PACK.md`
- `RELEASE-NOTES.md` when present for the product/version
- license/legal docs required by the bundle manifest
- checksum-ready customer documentation set

### Release Gate

A bundle is not customer-ready unless:

- Every required docs manifest entry exists.
- No internal-only docs are present.
- The customer deployment pack is included.
- Legal and licensing links resolve.
- Checksums include all copied docs.
- The bundle manifest names the central docs commit used for sync.

## 8. Migration Phases

### Phase 1: Inventory and Rules

- Generate `docs-inventory.md`.
- Classify files by documentation type.
- Mark local keep, central move, and duplicate removal candidates.

### Phase 2: Central Skeleton

- Create central repo structure.
- Configure preview repository content ingestion and routing.
- Add release-bundle sync manifest and script.

### Phase 3: High-Risk Docs First

- Move legal, licensing, platform architecture, API standards, execution
  standards, validation reports, and release notes.
- Replace repo-local duplicates with links.

### Phase 4: Product Pages

- Create one product landing page per repo.
- Preserve product-specific install/config/usage details locally.
- Cross-link local READMEs to central product pages.

### Phase 5: Enforcement

- Add repo checks that detect duplicated legal/platform/API standards.
- Require release bundles to sync docs from `AuditToolkit-Docs`.
- Fail release packaging when required central docs are missing.

## 9. Acceptance Criteria

The consolidation is complete when:

- Central source content is complete and consumable by the preview repository.
- Legal, licensing, platform, API, execution, validation, release, and packaging
  standards exist centrally.
- Each product repo keeps only minimal README, INSTALL, CONFIG, and
  tool-specific usage docs.
- Duplicated legal and platform text has been removed or replaced by links.
- Release bundles include docs through the central sync manifest.
- Release evidence records the central docs commit used for each customer
  bundle.
