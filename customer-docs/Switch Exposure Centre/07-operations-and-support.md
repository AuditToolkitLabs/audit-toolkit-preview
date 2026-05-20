# Operations and Support

## Operating model

The product is designed to run as a service with recurring refreshes and an
operator review loop. Support should focus on data freshness, source access,
connectivity, and runtime health.

## Health checks

Use the health endpoints and the job history to determine whether the service
is alive, ready, and producing current results.

## Typical incident types

- Device connector authentication failures
- Advisory source failures or fallback to sample data
- Missing or stale inventory data
- Database connectivity problems
- Scheduler or refresh timing issues
- Pentest scanner disabled by policy or rejected by target/port limits

## Support evidence

When raising a support case, include:

- Product version
- A short description of the issue
- The affected vendor or device group
- The latest job output or error message
- Any recent configuration changes

## Escalation

Escalate when the issue affects production reporting, blocks refreshes for a
critical vendor, or appears to be a platform defect rather than a data issue.

Pentest scan output is written to the action log. When troubleshooting a scan,
check the scan report, the pentest authentication state, and the configured
port policy before treating the issue as a platform fault.
