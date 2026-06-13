# Customer Documentation Library Plan

## 1. Purpose

This plan defines the customer-facing documentation library for the
AuditToolkit product suite. The library is maintained in `AuditToolkit-Docs`
as the static reference source consumed by the presentation repository.

The customer library replaces duplicated product-level customer documents with
one shared documentation set plus product-specific pages for material that
cannot be generalized safely.

## 2. Product Scope

The library covers six product repositories:

| Product                          | Repository                         | Product slug                    | Current customer-doc source                  |
| -------------------------------- | ---------------------------------- | ------------------------------- | -------------------------------------------- |
| Audit-Tool                       | `Audit-Tool-`                      | `audit-tool`                    | `customer-docs/`                             |
| Asset Command Centre             | `Asset-Command-Centre`             | `asset-command-centre`          | `customer-docs/asset-command-center/`        |
| AuditToolkit Linux Security Lite | `audittoolkit-linux-security-lite` | `linux-security-lite`           | `customer-docs/`                             |
| CMDB API Data Collection Tool    | `cmdb-api-data-collection-tool`    | `cmdb-api-data-collection-tool` | `customer-docs/`                             |
| Switch Exposure Center           | `Switch-Exposure-Center`           | `switch-exposure-center`        | `docs/customer-docs/switch-exposure-center/` |
| Audit Assurance Node             | `audit-assurance-node`             | `audit-assurance-node`          | `README.md` and `docs/`                      |

## 3. Library Principles

- Common customer policy is written once under `customer/`.
- Product-specific behavior lives under `customer/products/<product>/`.
- Legal and licensing authority remains under `legal/` and `licensing/`.
- Release bundles copy customer-facing docs from this repository only.
- Product repos keep minimal local pointers and implementation-specific notes.
- Internal operator runbooks, signing procedures, CI notes, and development-only
  docs are excluded from customer bundles.
- Website-rendered documentation must originate from this repository via
  controlled sync only.
- The preview website repository must not contain independently authored
  documentation content.

## 4. Customer-Facing Information Architecture

The library is organized by task and by product:

| Section                          | Purpose                                                             |
| -------------------------------- | ------------------------------------------------------------------- |
| `customer/start-here/`           | Audience, support model, documentation usage.                       |
| `customer/suite/`                | Shared product-suite overview, governance, and roles.               |
| `customer/products/`             | Product-specific customer guides and limits.                        |
| `customer/deployment/`           | Installation, transition, verification, and uninstall guidance.     |
| `customer/administration/`       | Administration, retention, access, and configuration.               |
| `customer/operations/`           | Monitoring, support, patching, backup, recovery, and limits.        |
| `customer/integrations/`         | API, SIEM, webhooks, authentication, schedulers, connectors.        |
| `customer/security/`             | Access, data protection, hardening, secrets, certificates.          |
| `customer/compliance-assurance/` | Procurement, assurance, OWASP, STIG, and release security evidence. |
| `customer/api-automation/`       | API consumer patterns, payloads, automation examples.               |
| `customer/reference/`            | Glossary, paths, troubleshooting, and support package reference.    |

## 5. Migration Rules

Each source document is classified as one of:

| Classification    | Rule                                                            |
| ----------------- | --------------------------------------------------------------- |
| `central-common`  | Merge into shared `customer/` documentation.                    |
| `central-product` | Move into `customer/products/<product>/`.                       |
| `local-pointer`   | Replace product copy with a pointer to central docs.            |
| `local-keep`      | Keep in the product repo because it is implementation-specific. |
| `internal-only`   | Do not publish in customer docs or release bundles.             |
| `release-bundle`  | Include through release-bundle documentation sync.              |

## 6. First Implementation Pass

The first pass creates:

- The `customer/` folder structure.
- Customer library index pages.
- Product-specific index pages for all six products.
- Source mapping for existing customer-doc sets.
- Navigation links from the repository root and preview-repository landing page.

The first pass does not delete product-repo documents. Product repos should be
converted to pointers only after central coverage has been reviewed.

## 7. Acceptance Criteria

The customer library is ready for migration when:

- `customer/index.md` is the primary customer documentation entry point.
- Every product has a central product index.
- Common topics have central destinations.
- The source map identifies the source and target for every major customer doc
  family.
- Release-bundle sync can include customer docs without internal material.
- Markdown diagnostics pass for the central docs set.
