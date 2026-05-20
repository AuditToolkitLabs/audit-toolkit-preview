# Billing Incident Template

Use this template for any billing incident, including `PLAN_UNRESOLVED`, missing license issuance, or reconciliation mismatches.

## Incident Header

- Incident ID: `BILLING-YYYYMMDD-###`
- Severity: `P1 | P2 | P3`
- Status: `Open | Monitoring | Mitigated | Resolved`
- Opened At (UTC):
- Closed At (UTC):
- Incident Commander:
- Secondary Owner:

## Trigger and Detection

- Detection Source: `Ops email | Reconciliation report | Manual check`
- Trigger Event Type:
- Trigger Subject:
- Stripe Event ID:
- Stripe Session ID:
- Keygen License ID (if any):

## Customer Impact

- Impact Summary:
- Number of impacted transactions:
- First impacted timestamp (UTC):
- Last impacted timestamp (UTC):
- Customer communications required: `Yes | No`

## Timeline (UTC)

- T0:
- T+5m:
- T+15m:
- T+30m:
- T+60m:

## Triage Checklist

- [ ] Confirm Stripe payment status for affected session(s)
- [ ] Confirm metadata includes `keygen_policy_id` and `plan_code`
- [ ] Confirm worker received webhook and signature validation passed
- [ ] Confirm plan mapping resolution behavior
- [ ] Confirm Keygen license creation response
- [ ] Confirm customer email send status
- [ ] Confirm ops escalation email send status

## Root Cause

- Category: `Metadata | Mapping | Stripe payload | Keygen API | Email dispatch | Other`
- Root cause detail:
- Why detection did/did not catch earlier:

## Remediation Actions

- Immediate action taken:
- Sessions/licenses manually recovered:
- Automation fix applied:
- Config fix applied:
- Code fix applied:

## Verification

- [ ] New paid transaction tested successfully
- [ ] Keygen license created for test and/or recovered sessions
- [ ] Customer notification sent
- [ ] Reconciliation report status reviewed

## Post-Incident Follow-Up

- Preventive action items:
- Owner(s):
- Due date(s):
- Runbook updates required: `Yes | No`
