# Purpose And Audience

## Purpose

This customer documentation library describes how the AuditToolkit product
suite is evaluated, deployed, administered, operated, integrated, and reviewed
by customers. It replaces duplicated product-level customer documentation with
one shared library plus product-specific pages for material that differs by
product.

The library is intended for customer use. It is not a software design
specification, developer onboarding guide, or internal operator runbook.
Engineering-only material remains in product repositories or internal docs and
is excluded from customer release bundles.

## Products Covered

The library covers:

| Product                          | Primary customer use                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| Audit-Tool                       | Full security audit platform with web UI, API, agents, reporting, and release bundles.        |
| Asset Command Centre             | Standalone asset discovery, inventory, local reporting, and optional upstream forwarding.     |
| AuditToolkit Linux Security Lite | Linux-only audit toolkit for local checks, scheduled audits, SIEM export, and CI/CD gates.    |
| CMDB API Data Collection Tool    | On-site CMDB and API data collection with connectors and managed agent onboarding.            |
| Switch Exposure Center           | Switch inventory, advisory refresh, exposure analysis, reports, scheduler, and API workflows. |
| Audit Assurance Node             | Remote assurance and elevation framework using SSH, WinRM, API, and agent adapters.           |

## Intended Audience

| Audience                             | What they will find here                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Evaluators and procurement reviewers | Product scope, security posture, support model, licensing, legal terms, and assurance evidence.         |
| End users and analysts               | How to use dashboards, results, reports, inventory views, exposures, and audit outputs.                 |
| Application administrators           | How to configure users, roles, identity sources, license state, integrations, and operational settings. |
| IT operations teams                  | How to install, monitor, back up, patch, recover, and support customer deployments.                     |
| Security and assurance teams         | Access controls, logging, data protection, credential handling, OWASP posture, and evidence packs.      |
| Integration engineers                | API, SIEM, webhook, scheduler, authentication, connector, and automation patterns.                      |
| Auditors and assessors               | Governance model, change records, acceptance evidence, support boundaries, and compliance artifacts.    |

## Documentation Conventions

- Product-neutral policy appears in the shared `customer/` sections.
- Product-specific behavior appears under `customer/products/<product>/`.
- Legal authority appears under `legal/`.
- Licensing authority appears under `licensing/`.
- Customer-specific values should be replaced by the customer in local runbooks
  or change records.
- Code paths, environment variables, commands, and product identifiers are
  written in code style.

## Out Of Scope

This library does not document:

- Internal signing procedures.
- Private operator runbooks.
- CI implementation details.
- Developer-only test plans.
- Secret values, private keys, tokens, or customer credentials.
- Host operating system administration beyond product deployment needs.

## Support Contacts

Use email for support and escalation:

| Purpose                                        | Contact                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------- |
| General, account, and commercial questions     | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com)       |
| Product support, defects, and how-to questions | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)   |
| Security vulnerabilities and advisories        | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) |
| Licensing and contract questions               | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)   |

Do not send passwords, private keys, API tokens, raw customer secrets, or
unredacted production data in support requests.
