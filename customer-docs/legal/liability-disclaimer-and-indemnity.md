# Liability Disclaimer and Indemnity

**AuditToolkit Product Suite**
**Licensor**: Michael Churchill trading as AuditToolkitLabs
**Licensor Address**: 4th Floor, Silverstream House, 45 Fitzroy Street, Fitzrovia, London W1T 6EB
**Version**: current
**Effective Date**: June 2026

This document applies to all products in the AuditToolkit suite:

- Audit-Tool (Security Audit Toolkit)
- Audit Assurance Node
- AuditToolkit Linux Security Lite
- CMDB API Data Collection Tool
- Switch Exposure Center
- Asset Command Centre

---

## 1. Use at Your Own Risk

You acknowledge and agree that use of the AuditToolkit Software ("Software") is at your sole risk.

You are solely responsible for:

- Evaluating suitability for your specific environment and use case
- Testing the Software in non-production environments before production deployment
- Validating all findings, inventory, and recommendations before taking action
- Making security, compliance, and operational decisions using independent judgment and multiple information sources
- Maintaining independent monitoring, alerting, and incident response capabilities

---

## 2. No Guarantees and Advisory Nature

The Software provides advisory output only. No output, score, finding, recommendation, or report is guaranteed to be complete, current, or sufficient for any legal, regulatory, or contractual purpose.

To the maximum extent permitted by law, AuditToolkitLabs disclaims all guarantees regarding:

- Accuracy, completeness, timeliness, and applicability of audit findings, asset data, or vulnerability context
- Detection of all vulnerabilities, weaknesses, misconfigurations, or compliance gaps
- Discovery of all assets, devices, or hosts present in an environment
- Compatibility with every platform, package set, runtime, operating system version, or deployment model
- Availability, uninterrupted operation, or error-free execution
- Suitability for a particular purpose, risk model, or regulatory requirement
- The accuracy of information reported by managed hosts via any collection transport (SSH, WinRM, SNMP, API, agent)

Security and audit tooling supplements a security programme; it does not replace qualified security personnel, penetration testing, or formal risk assessments. All outputs must be independently validated by qualified personnel before any operational, compliance, or remediation action is taken.

---

## 3. Third-Party Data, Integrations, and Vendor Content

Where the Software is configured to consume or transmit third-party data — including vendor advisory feeds, CVE databases, SIEM routes, ITSM endpoints, chat webhooks, or external APIs — AuditToolkitLabs is not responsible for:

- Availability, quality, accuracy, or currency of third-party systems or content
- Delays, schema changes, API endpoint failures, or transmission interruptions
- Licensee misconfiguration of credentials, destinations, retention policies, or routing
- Operational or compliance outcomes resulting from third-party dependencies
- Advisory data from vendor sources, including accuracy of CVE, CVSS, or CISA KEV information

The Licensee is solely responsible for validating all external data and integration behaviour before acting on it.

---

## 4. Limitation of Liability

To the maximum extent permitted by law, AuditToolkitLabs and its affiliates, officers, directors, employees, agents, licensors, and suppliers shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including damages for loss of profits, revenue, business opportunity, goodwill, data, or service availability, arising from or related to use of the Software.

This exclusion applies regardless of the legal theory — contract, tort, negligence, strict liability, statute, or otherwise — even if advised of the possibility of such damages.

Where liability cannot be excluded, AuditToolkitLabs's total aggregate liability for all claims related to the Software is limited to the greater of:

- Amounts paid by the Licensee for the Software in the 12 months preceding the claim; or
- USD $100.

Nothing in this document excludes or limits liability that cannot be excluded or limited under applicable law, including the Unfair Contract Terms Act 1977, the Consumer Rights Act 2015, or any other applicable UK statute, including liability for death or personal injury caused by negligence and liability for fraud or fraudulent misrepresentation.

---

## 5. Operational Risk Acknowledgment

### 5.1 Inherent Operational Risk

You acknowledge that software-based security auditing and asset collection includes inherent operational risk, including:

- False positives and false negatives in audit findings
- Environmental drift between audit runs
- Package metadata anomalies and version detection inaccuracies
- Permission constraints affecting scan completeness
- Remediation side effects and service disruption
- Network connectivity interruptions affecting collection completeness
- Firmware-specific or OS-specific variations in data formatting or availability

### 5.2 Your Responsibilities

You are solely responsible for:

- Backup and recovery planning before any remediation activity
- Change control and deployment approvals in accordance with your governance process
- Validation of all findings before remediation or operational action
- Rollback planning and service continuity in the event of a failed remediation
- Secure handling of credentials, SSH keys, API tokens, and secrets stored in or used by the Software
- Monitoring Software operation and system health independently
- Ensuring collection activity does not disrupt production systems
- Obtaining internal approvals before deploying the Software, including change control and security authorization

---

## 6. Comprehensive Indemnity

You agree to defend, indemnify, and hold harmless AuditToolkitLabs and its affiliates, officers, directors, employees, agents, licensors, and suppliers (collectively, "Indemnified Parties") from and against any and all claims, demands, actions, proceedings, liabilities, damages, losses, fines, penalties, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:

### 6.1 Your Use of the Software

- Your installation, deployment, configuration, operation, or use of the Software
- Your use of the Software outside the scope of the licence grant
- Your modification or attempted modification of the Software
- Your deployment of the Software in your environment

### 6.2 Your Data and Systems

- Data collected and processed by the Software in your environment
- Loss of or damage to your systems or data arising from Software use
- Unauthorized access resulting from your security practices or omissions
- Configuration errors or mismanagement by your personnel
- Misuse of audit findings, inventory, or operational recommendations obtained from the Software

### 6.3 Remediation and Operational Actions

- Any remediation action, configuration change, or operational decision made on the basis of Software output
- Downtime or service interruptions caused by remediation activity performed following Software recommendations
- Costs incurred in responding to false or inaccurate findings
- Costs of rolling back changes made based on Software output
- Security incidents or breaches occurring in connection with Software-driven remediation

### 6.4 Legal and Regulatory Matters

- Your violation of applicable laws or regulations
- Regulatory fines or penalties arising from your use of the Software
- Infringement claims related to your data or use of the Software
- Breach of third-party agreements, vendor terms of service, or collection authorisation requirements
- Privacy violations or data protection breaches arising from your collection activity
- Any allegation that your use of the Software for security testing, scanning, or data collection was unauthorised or unlawful

### 6.5 Third-Party Claims

- Claims from managed device owners or vendors regarding collection or query activity against their systems
- Claims from employees or users regarding data processing undertaken by you using the Software
- Claims from network users regarding service disruptions caused by collection activity
- Claims arising from your handling, sharing, or distribution of data collected by the Software

### 6.6 Defense and Settlement Process

For indemnified claims:

- You will assume and fund the defense promptly after receiving notice
- Indemnified Parties may participate with counsel of their choice at your expense where permitted by law
- You may not settle any claim that admits fault on, imposes obligations on, or restricts the rights of an Indemnified Party without prior written consent
- Your indemnity obligations are independent of any insurance coverage you maintain

### 6.7 Scope and Survival

Indemnity obligations survive termination of Software use, contract expiration, or account closure. Exceptions apply to the extent a claim arises solely from AuditToolkitLabs's wilful misconduct or gross negligence.

---

## 7. Compliance and Legal Responsibility

You are solely responsible for ensuring your use of the Software complies with all applicable laws, regulations, standards, and contractual obligations, including:

- Privacy and data protection law (UK GDPR, GDPR, CCPA, and equivalents)
- Cybersecurity law and regulation
- Export control requirements
- Sector-specific compliance requirements (HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST, and others)
- Your organisation's internal policies, change control procedures, and risk frameworks
- Third-party terms of service and vendor data access agreements

The Software and its documentation do not constitute legal advice. Consult qualified legal counsel regarding your specific compliance obligations.

---

## 8. Security Responsibilities

### 8.1 Credential and Access Security

You are solely responsible for:

- Securing all usernames, passwords, SSH keys, API tokens, and authentication credentials
- Protecting credentials stored in the Software's configuration
- Rotating credentials regularly and revoking access when personnel change
- Monitoring for unauthorized access to the Software and its stored data
- Implementing role-based access control to restrict Software access to authorised personnel

### 8.2 Network and Infrastructure Security

You are solely responsible for:

- Implementing appropriate network segmentation to limit collection exposure
- Controlling inbound and outbound access to the Software through firewalls and ACLs
- Monitoring for unauthorized access or unusual activity
- Implementing TLS/HTTPS for all remote access to the Software
- Maintaining secure communications with managed devices and collection targets

### 8.3 Data Protection

You are solely responsible for:

- Encrypting sensitive data at rest and in transit
- Implementing and testing backup procedures
- Maintaining multiple backups in independent locations
- Verifying backup integrity and recoverability
- Protecting encryption keys and backup media

---

## 9. Assumption of Risk

By installing or using the Software, you explicitly assume all risks arising from:

- Security posture decisions made from Software output
- Configuration and operational implementation choices
- Integration with internal and external tools or services
- Data retention, protection, and disclosure decisions
- Remediation actions applied to production systems
- Collection activity across your infrastructure

You acknowledge that you cannot transfer or delegate these risks to AuditToolkitLabs. Deploying the Software does not reduce your obligations with respect to network security, asset management, regulatory compliance, or data protection.

---

## 10. Relationship to the EULA

This document supplements and operates cumulatively with the End User License Agreement (EULA) and the repository `LICENSE` file. Where these documents overlap, the strictest legally enforceable limitation of liability and indemnity position applies to the maximum extent permitted by law.

In the event of direct conflict between this document and the EULA, the EULA controls.

---

## 11. Severability

If any provision of this document is held invalid, illegal, or unenforceable, the remaining provisions remain fully effective. The invalid provision is reformed only to the minimum extent necessary to make it valid and enforceable. Your indemnification obligations and the limitation of liability provisions remain in effect to the fullest extent permitted by law.

---

## 12. Acknowledgment

By installing, accessing, or using any AuditToolkit product, you acknowledge that you have read, understood, and accepted this Liability Disclaimer and Indemnity. Your continued use constitutes ongoing acceptance.

If you do not agree to these terms, you must uninstall the Software immediately and cease all use.

---

_Last updated: June 2026_
_Michael Churchill trading as AuditToolkitLabs — 4th Floor, Silverstream House, 45 Fitzroy Street, Fitzrovia, London W1T 6EB_
