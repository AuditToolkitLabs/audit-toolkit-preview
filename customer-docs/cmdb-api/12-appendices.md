# 12. Appendices and Reference

*ISO/IEC 20000-1 clause 7.5*

## Appendix A — Glossary

| Term | Meaning |
| --- | --- |
| Agent | Lightweight program installed on a Windows or Linux endpoint that reports inventory back to the application. |
| API key | Credential used by automation or by an agent to authenticate to the REST API. Issued, rotated and revoked by an administrator. |
| Audit log | Append-only record of security-relevant events held in the application's database. |
| CMDB | Configuration Management Database; the normalised store of asset and configuration data. |
| Connector | Server-side component that polls a third-party system (e.g. vCenter) over its API and ingests its inventory. |
| EULA | End-User Licence Agreement, accepted at first sign-in. The acceptance event records user, IP, User-Agent and SHA-256 of the agreement text. |
| Installation | One running deployment of the application bound to one paid licence. |
| Workspace | Logical data partition inside an Installation; sometimes called a "technical tenant". |

## Appendix B — Architecture overview

A typical on-site deployment looks like:

```text
    [browser] ── HTTPS ──▶ [reverse proxy] ── HTTP ──▶ [Flask app]
                                                          │
                                                          ├── PostgreSQL
                                                          │
   [endpoint agents] ── HTTPS ──▶ [reverse proxy] ──▶ [Flask app]
                                                          │
                                                          └── connectors ─▶ vCenter / Nutanix / KVM / cloud
```

Detailed architecture diagrams suitable for inclusion in customer
service-management documentation are available on request.

## Appendix C — Tenancy and licensing tiers

| Tier | `LICENSE_TIER` | Workspaces | Intended use |
| --- | --- | ---: | --- |
| **Standard** | `standard` | 1 | Single organisation, single environment, on its own server. The default for an on-prem install. |
| **Workgroup** | `workgroup` | 10 | Single organisation that wants to separate departments / business units / environments inside one Installation. |
| **MSP** | `msp` | Unlimited | Managed-service provider hosting workspaces for *their* customers. Per-endpoint royalty applies. |
| **OEM** | `oem` | Unlimited | Embedded / white-label / redistribution use. Requires a separate signed OEM agreement. |

For the binding text and the per-endpoint royalty calculation, see
`LICENSE-EULA.md` shipped with the product.

## Appendix D — Information to gather before raising a support case

When contacting the service provider please include:

- The product version (visible in the administrator console footer).
- The licence tier currently configured.
- The deployment model (operating system, database version, reverse
  proxy in use).
- A clear description of the symptom and the steps that reproduce it.
- The relevant time window in UTC.
- Audit-log extracts for the time window, with any sensitive values
  redacted.
- Application log extracts (the file path is configured by your
  Infrastructure Owner).
- Any error message shown to the user, copied verbatim.

Send to the appropriate AuditAdmin Labs address — see section&nbsp;7.4
for the full directory:

- Product support / incidents: [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
- Security matters only: [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
- Licensing only: [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)

## Appendix E — Service provider contact details

**AuditToolkitLabs**
Michael Churchill trading as AuditToolkitLabs

| | |
| --- | --- |
| **Registered address** | 4th Floor, Silverstream House, 45 Fitzroy Street, Fitzrovia, London W1T 6EB |
| **Telephone** | [+44 (0) 20 8090 9610](tel:+442080909610) |
| **General / Admin** | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) |
| **Support** | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) |
| **Sales & Licensing** | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) |
| **Security / Bug reports** | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) |

For guidance on which address to use, see section&nbsp;7.4.

## Appendix F — Supporting policies and procedures

The following customer-side documents should exist alongside this
service description:

- Information security policy.
- Access control and joiner / mover / leaver procedure.
- Backup and disaster recovery plan covering the application host and
  database.
- Change management procedure.
- Incident management procedure.
- Vulnerability and patch management procedure.

This documentation does **not** replace any of the above; it describes
how the service interacts with them.

## Appendix G — Integration onboarding worksheet

Use this worksheet to plan and sign off each integration.

| Integration type | Owner | Prerequisites complete (Y/N) | Test evidence reference | Go-live date | Notes |
| --- | --- | --- | --- | --- | --- |
| LDAP/AD or SSO (SAML/OIDC) | `<owner>` | `<Y/N>` | `<change ticket / test run>` | `<YYYY-MM-DD>` | `<notes>` |
| SIEM log forwarding | `<owner>` | `<Y/N>` | `<dashboard / alert test>` | `<YYYY-MM-DD>` | `<notes>` |
| Ticketing/SOAR webhook | `<owner>` | `<Y/N>` | `<webhook delivery test>` | `<YYYY-MM-DD>` | `<notes>` |
| SMTP notifications | `<owner>` | `<Y/N>` | `<test email reference>` | `<YYYY-MM-DD>` | `<notes>` |
| Cloud/virtualisation connectors | `<owner>` | `<Y/N>` | `<first successful sync>` | `<YYYY-MM-DD>` | `<notes>` |
| Managed endpoint agents | `<owner>` | `<Y/N>` | `<agent check-in report>` | `<YYYY-MM-DD>` | `<notes>` |
| API integrations | `<owner>` | `<Y/N>` | `<API smoke test>` | `<YYYY-MM-DD>` | `<notes>` |

Minimum evidence for sign-off:

- Change record approved and implemented.
- Positive test result attached.
- Rollback plan documented.
- Operational owner assigned.

---

**End of document**
