# 18. Quick Start — SIEM and Webhook Integration

## Overview

The Security Audit Toolkit can forward audit events and findings to
external SIEM, ITSM, and collaboration platforms via:

- **Outbound webhooks** — HTTP POST to any URL.
- **Slack / Microsoft Teams** — native incoming webhook support.
- **ServiceNow / Jira** — built-in ticket creation on FAIL findings.
- **GitHub Actions** — trigger CI/CD workflows from audit results.
- **Syslog** — structured syslog output for SIEM ingestion.

Configure all integrations under **Admin → Alerts → Integrations**.

---

## Slack

1. In Slack, create an **Incoming Webhook** app for your workspace and
   copy the webhook URL.
2. In the Toolkit, navigate to **Admin → Alerts → Integrations →
   Slack**.
3. Paste the webhook URL and select the events to forward:
   - Audit complete (with score summary)
   - New FAIL finding
   - Agent offline
   - Licence expiry warning
4. Click **Test** to send a test message.

---

## Microsoft Teams

1. In your Teams channel, add the **Incoming Webhook** connector and
   copy the URL.
2. Navigate to **Admin → Alerts → Integrations → Microsoft Teams**.
3. Paste the webhook URL and configure the same event filters as above.

---

## ServiceNow

1. Create a ServiceNow Integration User with the `itil` role and an
   OAuth client.
2. Navigate to **Admin → Alerts → Integrations → ServiceNow** and
   enter:
   - Instance URL: `https://<instance>.service-now.com`
   - Client ID and secret.
   - Table: `incident` (or `sn_si_incident` for security incidents).
3. Configure the field mapping:

| Toolkit field | ServiceNow field |
| --- | --- |
| `target.hostname` | `cmdb_ci` |
| `finding.name` | `short_description` |
| `finding.detail` | `description` |
| `finding.severity` | `urgency` |

---

## Jira

1. Generate a Jira API token at
   `https://id.atlassian.com/manage-profile/security/api-tokens`.
2. Navigate to **Admin → Alerts → Integrations → Jira** and enter:
   - Jira base URL.
   - Email and API token.
   - Project key and issue type.
3. Map Toolkit severity to Jira priority.

---

## Generic webhook

Any HTTP endpoint accepting JSON can receive Toolkit events.

1. Navigate to **Admin → Alerts → Integrations → Webhook**.
2. Enter the target URL, optional auth headers, and event filters.
3. Select the payload format: **Standard JSON**, **CloudEvents 1.0**,
   or **custom template**.

### Standard JSON payload schema

```json
{
  "event": "audit.complete",
  "timestamp": "2026-05-02T09:00:00Z",
  "target": {
    "id": 1,
    "hostname": "web-server-01",
    "os_type": "linux"
  },
  "summary": {
    "score": 87.5,
    "pass": 210,
    "warn": 7,
    "fail": 3,
    "skip": 12
  },
  "result_url": "https://<hostname>/results/1234",
  "findings": [
    {
      "check": "SSH PermitRootLogin",
      "status": "FAIL",
      "detail": "PermitRootLogin is set to 'yes'",
      "recommendation": "Set PermitRootLogin to 'no' or 'prohibit-password'"
    }
  ]
}
```

---

## Syslog

For SIEM platforms that ingest syslog (Splunk, QRadar, Microsoft
Sentinel):

1. Navigate to **Admin → Alerts → Integrations → Syslog**.
2. Enter the syslog collector host and port (UDP/514 or TCP/6514 for
   TLS).
3. Select the format: **RFC 5424** (default) or **CEF** (Common Event
   Format for ArcSight).

Events forwarded include: audit-complete, new FAIL finding, user
sign-in failure, API key operations, and configuration changes.

---

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Webhook returns 4xx | Check the URL, authentication headers, and payload schema |
| Slack / Teams message not received | Verify the webhook URL is active; check the Slack app is still installed |
| ServiceNow tickets not created | Check the integration user has the `itil` role; review the event log in **Admin → Audit Log** |
| Syslog events not appearing in SIEM | Confirm UDP/TCP port is open between the Toolkit server and the collector |
