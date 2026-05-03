# 23. Licensing, Legal Terms, and Acceptable Use

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Last updated | 2026-05-03 |
| Product | AuditToolkit Linux Security Lite |
| Release | v1.1.1 |
| Provider | AuditToolkitLabs |
| Provider contact | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) |

**See also:** [24. Enterprise Compliance Platform](24-enterprise-compliance-platform.md) — Detailed feature comparison, use cases, and pricing for Community, Professional, and Enterprise tiers.

---

## 23.1 Provider

AuditToolkit Linux Security Lite is developed and distributed by:

**AuditToolkitLabs**
4th Floor, Silverstream House, 45 Fitzroy Street, London W1T 6EB
Email: [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com)
Licensing: [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)

AuditToolkitLabs is referred to in all legal and licensing documents as the
**Provider**. References to "we", "us", or "AuditToolkitLabs" in this
document and in the LICENSE, EULA, and DISCLAIMER files distributed with
the product all refer to AuditToolkitLabs.

---

## 23.2 Licensing model

AuditToolkit Linux Security Lite is licensed under the **Business Source
License 1.1 (BSL 1.1)**.

### Free use (no commercial license required)

You may use the software without charge for:

| Permitted use | Condition |
| --- | --- |
| Internal security auditing and compliance monitoring | Within your own organisation, on any number of Linux hosts you own or are authorised to manage |
| Evaluation, testing, and non-commercial research | Without limit |

"Internal use" means use exclusively within the legal entity that downloads
and operates the software. It does not include use on behalf of affiliates,
group companies, or subsidiaries unless covered by a separate agreement.

### Uses that require a commercial license

A commercial license must be obtained from AuditToolkitLabs **before** any
of the following:

| Restricted use | Description |
| --- | --- |
| Offering auditing as a service | Operating the tool on behalf of third parties for compensation |
| Embedding in a commercial product | Including the tool in a security product sold or licensed to others |
| Hosting or SaaS delivery | Providing the tool as a hosted or managed service to external customers |
| Connecting to the AuditToolkit Core Service via API | The Core Service is a separate paid product; a commercial subscription and a Provider-issued API key are required before activating this integration |

Enterprise feature access (UI/API/CLI for compliance reporting, trend analysis,
SIEM export, and webhooks) is controlled by tier entitlements and is intended
for internal operations by authorised personnel.

Contact [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)
to obtain a commercial license or to discuss your use case before deployment.

### AuditToolkit Core Service integration

The Software includes the ability to connect to and push audit findings to the
**AuditToolkit Core Service**, a separate, centrally managed platform, via API.
This integration is available through the agent or add-on settings
(`CORE_SERVER_URL` / `API_KEY`).

> **Important.** The AuditToolkit Core Service is a **separate, paid product**.
> This Lite edition licence does not grant any right to access, use, or connect
> to the Core Service. A separate commercial subscription issued by
> AuditToolkitLabs must be in place before you configure or activate this
> integration. The API key required for this integration is issued by
> AuditToolkitLabs under that paid subscription.

Configuring a Core Server URL without a valid subscription constitutes
unauthorised use. Contact [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)
to enquire about Core Service access and pricing.

### Automatic open-source transition

Five years from the date of first public GA release, the software automatically converts
to the **MIT License**, becoming fully open-source. The Change Date will be published
when a stable release is announced. This software is currently in pre-release (beta)
status and no GA date has been set.

### Full license text

The canonical, legally binding license terms are in the `LICENSE` file
distributed with the product. In the event of any conflict between this
document and the `LICENSE` file, the `LICENSE` file controls.

---

## 23.3 End User Licence Agreement (EULA)

The EULA is distributed with the product as `EULA.md`. A summary of key
provisions is provided here for reference. The full `EULA.md` text governs.

### Grant

You are granted a limited, non-exclusive, non-transferable license to use
AuditToolkit Linux Security Lite for internal security auditing of Linux
systems you own or are authorised to manage, subject to the limits in
section 23.2 above.

### Restrictions

You must not:

- Circumvent or tamper with any licensing or enforcement mechanism
- Remove or alter copyright, attribution, or license notices
- Redistribute or sublicense the software except as permitted by the `LICENSE`
- Use the software in violation of applicable law or regulation

### Warranty disclaimer

THE SOFTWARE IS PROVIDED **"AS IS"** AND **"AS AVAILABLE"**, WITHOUT
WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

Audit output is advisory. Results must be validated within your own risk and
control framework before any action is taken.

### Limitation of liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, AUDITTOOLKITLABS WILL NOT BE LIABLE
FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
FOR LOSS OF DATA, PROFITS, OR BUSINESS INTERRUPTION ARISING FROM USE OF THE
SOFTWARE.

### Indemnification

You agree to indemnify and hold AuditToolkitLabs harmless from claims
arising from your misuse of the software, your violation of applicable law,
or any system modification made using or informed by the software. See
`EULA.md` section 9 for the full indemnification clause.

### Full EULA text

The `EULA.md` file distributed with the product contains the complete,
legally binding EULA. By installing or using the software you accept its
terms.

---

## 23.4 Disclaimer and user responsibility

The `DISCLAIMER.md` file distributed with the product governs user
responsibility for system modifications performed using remediation scripts.
Key provisions are summarised here.

### Audit scripts (read-only)

Audit scripts in the `audits/` directory:

- Perform **read-only** inspection of local Linux system state
- Do **not** modify any files, settings, services, or kernel parameters
- Are designed to be safe for use in production environments
- Produce advisory output only — findings do not constitute professional security advice

### Remediation scripts (system-modifying)

Remediation scripts in the `fix/` directory **will modify system
configuration**. They must not be run without completing the pre-use
requirements in section 23.5.

System modifications that fix scripts may make include:

- System configuration files (`/etc/*`)
- Service configurations and startup settings
- Firewall rules
- User permissions and access controls
- SSH configuration
- Kernel parameters
- SELinux and AppArmor security policies

Potential consequences of misconfigured or untested fix scripts include loss
of SSH access, service disruptions, authentication failures, and network
connectivity loss.

### User responsibility

By using the software you acknowledge and accept that:

1. **You are responsible for testing** all scripts — particularly remediation
   scripts — in a non-production environment before production use.
2. **You are responsible for backups** — ensure a full, verified system
   backup exists before applying any fix script.
3. **You are responsible for understanding** the changes each script makes
   before running it.
4. **You are responsible for compliance** with your organisation's change
   management policies and any applicable regulatory obligations.
5. **You are responsible for rollback** — maintain a documented plan to
   reverse changes if they cause unintended effects.
6. **You are responsible for authorisation** — you must be authorised to
   modify systems before running any script against them.

### Professional advice

This tool does not constitute professional security advice. For regulatory
compliance requirements, critical infrastructure, or contractual security
obligations, consult qualified security professionals in addition to using
this tool.

---

## 23.5 Pre-use approval and change control requirements

> **Mandatory requirement.** All use of AuditToolkit Linux Security Lite
> within an organisation must be approved through the organisation's internal
> change control and governance process before first deployment and before
> any significant change in scope (for example, adding new host targets,
> domains, or enabling remediation scripts).

### Why approval is required

AuditToolkit Linux Security Lite executes scripts with elevated privileges
on production Linux hosts. Although audit scripts are read-only, they
inspect sensitive system areas including authentication configuration,
network settings, service state, and installed software. Remediation
scripts can modify system configuration. Neither class of script should be
introduced to a production environment without documented approval.

### Minimum requirements before deployment

The following approvals and checks must be completed and documented before
deploying or running the toolkit in any environment:

| Requirement | Owner | Notes |
| --- | --- | --- |
| Change request raised and approved | Platform or Change Owner | Use your organisation's standard change management process (e.g. RFC, ITSM ticket). |
| Security team reviewed | Information Security | Confirm the tool's privilege model and data handling are acceptable for the target environment. |
| Platform team notified | Platform / Linux Administration | Confirm scheduled execution windows and resource impact. |
| Legal and procurement reviewed (if applicable) | Legal / Procurement | Required if the tool will be used to generate compliance evidence for a regulated environment or customer-facing SLA. |
| Non-production test completed | Toolkit Administrator | Run the toolkit against a representative non-production host and validate output before production deployment. |

### Audit script use (standard change)

Running audit scripts against already-approved host targets under an
established schedule is a **standard change** and does not require a new
approval for each run, provided the initial deployment was approved and the
scope has not changed.

### Remediation script use (normal change, minimum)

Running any remediation script from the `fix/` directory is a **normal
change** at minimum. It requires:

1. Change request raised and approved before execution
2. Non-production validation of the specific fix script
3. Full system backup confirmed before execution
4. Dry-run review (`--dry-run` or `DRY_RUN=true`) completed and output
   reviewed
5. Rollback procedure documented and tested
6. Platform Owner notified

Emergency use of a fix script (for example, applying an urgent security
remediation) is an **emergency change** and must be ratified with the
Platform Owner and Security team within 24 hours of execution.

### Scope changes requiring new approval

A new change request is required before:

- Extending the toolkit to new hosts or environments not covered by the
  original approval
- Enabling additional audit domains or presets not previously run
- Running any remediation script for the first time or against a new
  environment
- Upgrading to a new major version of the toolkit
- Changing the privilege level under which the toolkit runs

---

## 23.6 Data handling

AuditToolkit Linux Security Lite is designed for local and on-premises
execution. No audit data, findings, or system configuration details are
transmitted to AuditToolkitLabs as part of normal operation.

The Software does not contact any AuditToolkitLabs servers or external endpoints during
normal audit operation. No audit findings, system configuration details, or host data
are transmitted to the Provider or any third party.

You are responsible for:

- Controlling where report JSON artefacts are stored and for how long
- Applying appropriate access controls to the report output directory
- Determining whether report artefacts contain data subject to your
  organisation's data classification or data protection obligations
- Network egress controls appropriate to your environment

---

## 23.7 Legal document reference

| Document | Location in distribution | Purpose |
| --- | --- | --- |
| `LICENSE` | Repository root | Canonical BSL 1.1 license terms — legally binding |
| `EULA.md` | Repository root | End User Licence Agreement — legally binding |
| `DISCLAIMER.md` | Repository root | Warranty disclaimer, limitation of liability, user responsibility |
| This document (`23-licensing-and-legal.md`) | `customer-docs/` | Customer-facing summary and acceptable use guidance |

In the event of any conflict between this document and the `LICENSE` or
`EULA.md` files, the `LICENSE` and `EULA.md` files control.

---

## 23.8 Contacting the Provider

| Purpose | Contact |
| --- | --- |
| Licensing and commercial enquiries | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) |
| General and account enquiries | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) |
| Product support and defects | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) |
| Security vulnerability disclosure | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) |

Response times and support commitments are described in
[20 — Support Engagement Guide](20-support-engagement-guide.md).
