# Operations And Support Model

## Support Responsibilities

| Activity                                                      | Customer             | AuditToolkitLabs      |
| ------------------------------------------------------------- | -------------------- | --------------------- |
| First-line support for local users and operators              | Yes                  | Guidance where needed |
| Host OS, VM, container, network, database, and backup support | Yes                  | No                    |
| Product defect investigation                                  | Triage and evidence  | Yes                   |
| Product patches, releases, and advisories                     | No                   | Yes                   |
| License entitlement and renewal support                       | Request and evidence | Yes                   |
| Customer data redaction before escalation                     | Yes                  | No                    |
| Roadmap and product change decisions                          | Input                | Yes                   |

Support requests to AuditToolkitLabs should be raised by a named application
administrator, service owner, security owner, or licensed customer contact.

## Incident Triage

Common incident signals include:

- Service unavailable or health endpoint failing.
- Scheduled job failure.
- Missing or empty report output.
- Connector, API, or agent failure.
- Unexpected drop in coverage, confidence, or exposure score.
- License state mismatch.
- Authentication or role assignment issue.
- SIEM, webhook, scheduler, or ticketing delivery failure.

First-line triage should confirm:

1. Product name and version.
2. Deployment mode and operating system.
3. Exact command, UI action, API call, or job that failed.
4. Error message and timestamp.
5. Recent changes to host, network, identity, license, target, or connector
   configuration.
6. Whether the issue reproduces in a test scope.
7. Whether local logs show product errors or external dependency failures.

## Severity Guidance

| Severity | Description                                                                                              | Suggested route                                                              |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Critical | Complete product outage, confirmed product-linked data loss, or suspected security exposure.             | Email [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com). |
| High     | Repeated product failure affecting a class of targets, jobs, agents, or integrations with no workaround. | Email [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com).   |
| Medium   | Incorrect output, degraded coverage, partial integration failure, or workaround available.               | Email [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com).   |
| Low      | Documentation question, cosmetic issue, feature request, or general how-to question.                     | Email [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com).   |

## Escalation Package

Include only customer-safe evidence:

- Product and version.
- Deployment mode and OS details.
- Non-secret configuration summary.
- Exact command, API request shape, or job name.
- Relevant timestamps in UTC where possible.
- Redacted logs or report excerpts.
- Exit code or HTTP status where applicable.
- Recent change history.
- License status output with keys masked.

Never include passwords, private keys, API tokens, raw customer secrets, full
offline license file contents, unredacted production hostnames, or sensitive
customer data unless an approved secure support channel and redaction process
has been agreed.

## Continuity Practices

Recommended customer practices:

- Keep release bundles, checksums, and documentation sync evidence together.
- Pilot upgrades before broad deployment.
- Back up stateful data before package upgrades or schema migrations.
- Retain supportable versions according to customer change policy.
- Verify restore procedures periodically.
- Review support contacts and escalation ownership after staffing changes.
