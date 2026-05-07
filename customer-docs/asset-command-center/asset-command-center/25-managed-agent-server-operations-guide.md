# 25. Enrollment and Access Operations

The Deployment page includes key and bootstrap material for
standalone server enrollment workflows used with this release.

## Operational guidance

- create only the enrollment keys required for the rollout
- prefer short-lived keys where practical
- revoke stale keys after deployment or rotation
- keep a controlled inventory of issued enrollment material
  and API credentials

## Deployment mode

Direct network collection from the server to target endpoints should be
used for supported connector paths (SSH, WinRM, SNMP, and IPMI where
enabled).

The documented operating model remains local collection and local
reporting first.
