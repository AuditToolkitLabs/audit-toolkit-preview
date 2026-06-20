# Licensing Overview

See also: [Licensing Authority](authority.md)

## 1. Purpose

This page defines the customer-facing licensing model used across AuditToolkit
products. It is the central release-bundle source for licensing concepts,
license modes, entitlement boundaries, and support escalation rules.

Product repositories may keep only product-specific license file paths,
environment variable names, or UI instructions. Tier definitions, entitlement
rules, and legal licensing policy belong in this central documentation set.

## 2. Canonical Public Tiers

AuditToolkit uses the following public tier names:

- Community
- Starter
- Professional
- Business
- Enterprise

Legacy labels such as `free`, `trial`, `taster`, and `custom` are compatibility
aliases only. They must not be presented as active public commercial tiers in
customer documentation, release bundles, billing pages, or product UI.

## 3. License Modes

### Online Activation

Online activation is the default mode. The deployed product validates the
customer license key against the configured licensing service when outbound
HTTPS access is available.

Customer responsibilities:

- Keep system time synchronized.
- Protect license keys as sensitive operational data.
- Ensure outbound HTTPS access is available where online activation is used.
- Confirm the license product, tier, and entitlement scope match the deployment.

### Offline License File

Offline license files are signed `.offline.lic` files supplied by AuditToolkit
for approved restricted-connectivity environments. They are not a second
licensing system; each offline file is derived from an active license record and
validated by the runtime verifier.

Customer responsibilities:

- Store the offline file only in the documented product license directory.
- Do not edit, re-sign, rename for policy changes, or manually patch the file.
- Replace expired offline files through the approved support process.
- Contact support if a valid offline file is rejected by runtime validation.

## 4. Entitlement Evaluation

Entitlement decisions are evaluated by:

- Tier
- Deployment mode
- Tenant or workspace scope
- Local entitlement-unit count
- Product-specific feature gates
- License expiry and offline file TTL, where applicable

In MSP or multi-tenant operation, limits apply per tenant or managed-customer
scope unless the executed commercial agreement explicitly states otherwise.

## 5. Runtime Context

Products may use runtime context values such as:

| Context           | Default   | Purpose                                                        |
| ----------------- | --------- | -------------------------------------------------------------- |
| `TENANT_ID`       | `default` | Separates tenant-scoped entitlement checks.                    |
| `DEPLOYMENT_MODE` | `single`  | Distinguishes standalone, bundled, and multi-tenant operation. |

Product-specific configuration documents may list exact variable names or UI
fields. The rules above remain the central authority for how those values are
interpreted.

## 6. Standard License Locations

Product-specific release notes define the exact license path. Standard defaults
are:

| Platform | Standard location pattern                              |
| -------- | ------------------------------------------------------ |
| Linux    | `/var/lib/audittoolkit/<product>/data/licenses/`       |
| Windows  | `C:\ProgramData\AuditToolkit\<Product>\data\licenses\` |

Do not store private signing keys, Keygen administrator tokens, or internal
operator material in customer license directories.

## 7. Customer-Safe Troubleshooting

| Symptom                             | First checks                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| License key rejected                | Confirm product, tier, expiry, system time, and outbound HTTPS access.            |
| Offline file rejected               | Confirm file path, permissions, product match, expiry, and offline TTL.           |
| Feature unavailable                 | Confirm tier entitlement and deployment mode.                                     |
| Host or entitlement limit reached   | Remove unused registered hosts where supported or upgrade entitlement.            |
| License status changed unexpectedly | Contact AuditToolkit support with product, version, and non-secret status output. |

Never send private keys, administrator tokens, passwords, or raw customer
secrets in a support package.

## 8. Drift Marker

Use the marker `WEBSITE / STRIPE / KEYGEN / RUNTIME DRIFT` for unresolved
mismatches between public pricing, billing configuration, licensing records,
and runtime enforcement. Drift must be resolved before publishing release notes
or customer-facing entitlement claims.
