# 22. Security FAQ — Procurement and Due Diligence

*For security reviewers, procurement teams, and information assurance assessors.*

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Last updated | 2026-05-03 |
| Product | AuditToolkit Linux Security Lite |

This document provides concise answers to questions commonly raised during
vendor security assessment. For implementation detail, refer to
[9 — Security, Access and Data Protection](09-security.md) and the
[OWASP Security Scorecard](../docs/OWASP-SECURITY-SCORECARD.md).

---

## Tool behaviour

**Q: Is AuditToolkit Linux Security Lite read-only?**

Yes, unconditionally. Every audit script in the library inspects local
system state using read-only commands (reading files, querying package
databases, checking service status). No script installs packages, modifies
configuration files, restarts services, or changes any system setting.
This is an architectural invariant enforced by code review and CI gates.

---

**Q: Does the toolkit make any network connections at runtime?**

No. All checks operate against local OS state only. The toolkit reads from
`/etc`, `/proc`, `/sys`, and the local package database. No outbound HTTP,
DNS, or socket connections are made during an audit run.

Enterprise note: if you explicitly configure webhook delivery or SIEM export
destinations, those interfaces will perform outbound requests to the endpoints
you configured. Audit checks themselves remain local read-only operations.

---

**Q: Does the toolkit require root?**

Root is recommended for full coverage, but not mandatory. When run without
root, checks requiring elevated privilege are marked `[SKIP]` rather than
failing, and the coverage score reflects the reduced scope. Many
organisations run with a targeted `sudo` policy and accept the resulting
coverage reduction.

---

## Data handling

**Q: Are enterprise API/UI/CLI interfaces local-only?**

By default, yes. The lightweight web service binds to loopback unless you
explicitly override deployment settings. Enterprise API routes and UI pages
run in the same local service and remain protected by the configured web
authentication and license tier checks.

**Q: What data does the toolkit collect and where is it stored?**

The toolkit writes a single JSON file per run to the path specified by
the operator (default: `/var/log/audit-toolkit/`). The report contains:

- Host identity (hostname, OS release, kernel version, architecture).
- Installed package inventory and versions.
- Running services and open ports.
- Security finding details (control name, check result, evidence snippet).

No data is transmitted off the host. No telemetry, usage data, or report
content is sent to AuditToolkitLabs or any third party. The toolkit has no
phone-home capability.

---

**Q: Who has access to the audit reports?**

Access is controlled entirely by the customer via filesystem permissions.
AuditToolkitLabs has no access to report files at any time. Reports are
local files; they go nowhere without explicit customer action.

---

**Q: How should audit reports be classified?**

Reports should be classified as **Restricted** or equivalent under the
customer's data classification policy. They contain host topology
information, software inventory, and security gap details that could be
useful to an attacker.

---

## Supply chain and integrity

**Q: How are release packages verified?**

Every release package is accompanied by a SHA-256 checksum file published
alongside the package on GitHub Releases. RPM packages carry a GPG
signature. Git release tags are GPG-signed by the AuditToolkitLabs
release key.

Verify before installing:

```bash
sha256sum -c SHA256SUMS --ignore-missing
```

---

**Q: Does the toolkit depend on external packages downloaded at runtime?**

No. The toolkit is pure Bash and depends only on standard system utilities
present in every supported Linux distribution (Bash, coreutils, grep, sed,
findutils, procps). No package downloads, pip installs, or external API
calls occur during a run.

---

**Q: Is the toolkit source code available for review?**

Yes. The full source code is available on GitHub at:
`https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite`

The codebase is written entirely in Bash. All audit scripts and library
shims can be reviewed before deployment. No compiled binaries or obfuscated
code are included.

---

## Vulnerability management

**Q: What is the toolkit's own OWASP Top 10 security posture?**

A full OWASP Top 10 security scorecard for the toolkit is maintained at
`docs/OWASP-SECURITY-SCORECARD.md`. The current score is 97/100 (grade A+),
assessed and revalidated in May 2026.

---

**Q: How are security vulnerabilities in the toolkit reported and patched?**

Report vulnerabilities to
[Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
or via GitHub's private security-advisory workflow.

AuditToolkitLabs:

- Acknowledges reports within 2 business days.
- Targets a patch within 14 days of confirming a valid vulnerability.
- Publishes a signed hot-fix release and advisory for Critical/High issues.
- Notifies subscribed customers via email
  ([Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
  — send `Subscribe` to join the advisory list).

---

**Q: Does the toolkit introduce new attack surface on the host?**

Minimal. The toolkit:

- Does not open any listening ports or sockets.
- Does not install any persistent daemons (unless you enable the optional
  systemd timer).
- Does not modify `/etc/sudoers`, PAM, or any authentication subsystem.
- Installs files to `/opt/audit-toolkit/` with root ownership and `755`
  permissions.

The attack surface is limited to the installed scripts themselves and the
report files they produce. Both should be protected by standard filesystem
access controls.

---

## Licensing and compliance

**Q: What licence governs use of the toolkit?**

Refer to the `LICENSE` file distributed with the product. For licence-
tier changes, multi-host licences, and commercial enquiries, contact
[License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com).

---

**Q: Is the toolkit compliant with CIS Benchmarks or NIST SP 800-53?**

The toolkit checks controls aligned to CIS Benchmark Level 1 and 2
recommendations for supported Linux distributions, and maps checks to
NIST SP 800-53 control families where applicable. The full mapping is in
`docs/CIS-COVERAGE-MATRIX.md` and `docs/07-cis-nist-compliance-mapping.md`.

The toolkit produces **evidence** for compliance assessment; it does not
certify compliance. Your compliance posture depends on the remediation
actions you take in response to findings.
