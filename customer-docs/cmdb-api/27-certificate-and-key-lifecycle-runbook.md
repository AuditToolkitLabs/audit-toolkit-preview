# 27. Certificate and Key Lifecycle Runbook

*ISO/IEC 20000-1 clauses 8.7, 9.1*

This runbook defines certificate and key lifecycle operations for the
core service and integration endpoints.

## 27.1 Scope

- TLS certificates used by user and agent endpoints.
- Private key storage and access controls.
- Rotation and emergency replacement procedures.

## 27.2 Baseline controls

- Use TLS 1.2 or higher.
- Use trusted CA-issued certificates.
- Restrict private key read access to service identity only.
- Monitor certificate expiry and alert in advance.

## 27.3 Renewal procedure

1. Generate CSR using approved key parameters.
2. Request and receive signed certificate.
3. Install certificate and chain on endpoint tier.
4. Validate hostname, chain and expiration.
5. Restart/reload service components.
6. Confirm users and agents can connect.

## 27.4 Emergency rotation procedure

1. Trigger incident process for suspected key compromise.
2. Revoke affected certificate where supported.
3. Replace certificate/key pair immediately.
4. Update dependent trust stores if needed.
5. Verify service and integration continuity.

## 27.5 Evidence checklist

- Certificate serial numbers (old/new).
- Expiry dates and renewal date.
- Change ticket reference.
- Post-change connectivity validation.
