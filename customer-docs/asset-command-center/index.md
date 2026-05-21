# Asset Command Centre Customer Documentation

This documentation set is scoped to the Asset Command Centre release in
this repository only.

It describes the standalone legacy-focused collector and local
reporting service, its supported operating model, its administrator and
super-admin workflows, its license view, and its supported deployment
and security expectations.

It does not describe deprecated commerce, fulfillment, or migration
workflows from other products or prior repository phases.

## Planned release baseline

- Planned release version: 1.1.0
- Release intent: patch release that preserves the standalone,
  agentless operating model and hardens release packaging and
  operational readiness.

Planned feature functions for version 1.1.0:

- Agentless inventory and discovery via SSH, WinRM, SNMP, IPMI, Nmap,
  and ansible-unified orchestration.
- Local reporting, snapshots, license status visibility, audit logging,
  and credential-managed operations.
- Optional upstream asset forwarding to a central Audit Toolkit
  deployment through the documented API-based forwarding flow.
- Cross-platform release packaging readiness for Linux package paths and
  Windows MSI distribution workflows.

## Release scope summary

- Product role: standalone collector and local reporting node.
- Primary operating mode: `legacy-only` connectors and
  `inventory-only` collection.
- Primary deployment target: Ubuntu Server 24.04 LTS x86_64,
  single-node, Docker-based.
- Local capabilities: inventory, discovery telemetry, reporting,
  snapshots, license status, audit logging, credential management.
- Optional capability: upstream forwarding to a central Audit Toolkit
  deployment when explicitly enabled.

## Table of contents

1. [Purpose and audience](01-purpose-and-audience.md)
2. [Service overview](02-service-overview.md)
3. [Roles and governance](03-roles-and-governance.md)
4. [Deployment transition and first-time setup](04-service-transition.md)
5. [User guide](05-end-user-guide.md)
6. [Administration guide](06-administration.md)
7. [Operations and support model](07-operations-and-support.md)
8. [Change and release management](08-change-management.md)
9. [Security and access model](09-security.md)
10. [Monitoring and reporting](10-monitoring-and-reporting.md)
11. [Continual improvement](11-continual-improvement.md)
12. [Appendices and terminology](12-appendices.md)
13. [Integration overview](13-integration-quick-starts.md)
14. [Authentication and access-source notes](14-quick-start-authentication-integration.md)
15. [SIEM and security webhook notes](15-quick-start-siem-integration.md)
16. [External workflow handoff notes](16-quick-start-ticketing-webhook-integration.md)
17. [Supported connector policy](17-quick-start-cloud-and-virtualisation-connectors.md)
18. [API and automation guide](19-quick-start-api-integration.md)
19. [Supported installation model](20-core-server-installation-linux-windows.md)
20. [Maintenance and patching runbook](21-maintenance-patching-and-release-runbook.md)
21. [Support engagement guide](22-support-engagement-guide.md)
22. [Automation operator guide](23-api-consumer-and-automation-guide.md)
23. [Backup and recovery runbook](24-backup-restore-and-disaster-recovery-runbook.md)
24. [Security event and export reference](26-siem-itsm-and-webhook-payload-reference.md)
25. [Certificate and key lifecycle](27-certificate-and-key-lifecycle-runbook.md)
26. [User attributes and access-source mapping notes](28-sso-claim-and-attribute-mapping-cookbook.md)
27. [Team labels and reporting-scope governance](29-tenant-and-workspace-governance-guide.md)
28. [Operational limits and constraints](30-operational-limits-and-known-constraints.md)
29. [API surface and collection reference](31-api-endpoints-and-data-collection-catalog.md)
30. [Data security and database maintenance](32-data-security-and-database-maintenance-runbook.md)
31. [Security FAQ](33-security-faq.md)
32. [Security control summary](34-owasp-security-scorecard.md)
33. [Production security posture report](35-production-security-posture.md)

## Related product documents

- [Asset Command Centre overview](README.md)
- [Customer security assurance report](14-customer-security-assurance-report.md)
- [Production security posture report](35-production-security-posture.md)
- [Customer release changelog](changelog.md)
- [Commercial EULA](../legal/EULA.md)

## Contact points

- General and commercial: [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com)
- Product support: [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
- Security reporting: [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
- Licensing: [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)

