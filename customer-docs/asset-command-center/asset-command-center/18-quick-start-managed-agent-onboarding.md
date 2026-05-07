# 18. Deployment and Onboarding Patterns

The Deployment page combines two patterns:

1. standalone server deployment guidance
2. API-key-based onboarding material for direct connector workflows

## Supported standalone server target

- Ubuntu Server 24.04 LTS x86_64
- single-node deployment
- Docker-based runtime preferred

## Onboarding guidance

- generate only the keys and enrollment artifacts required for the
  rollout
- use short-lived onboarding material where possible
- revoke stale deployment keys after cutover
- keep local reporting enabled during initial validation

## Direct connectivity model

This standalone release uses direct network connectivity from the
collection node to target systems. Primary methods are SSH, WinRM,
SNMP, and optional IPMI where enabled.

No host-resident software is required for the documented standalone
collection model.
