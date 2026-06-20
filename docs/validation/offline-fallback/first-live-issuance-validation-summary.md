# First Live Offline Fallback Issuance - Validation Summary

## Metadata

| Field                     | Value                                                           |
| ------------------------- | --------------------------------------------------------------- |
| Product context           | AuditToolkit-Control-Centre offline fallback licensing workflow |
| Execution date            | 2026-06-11                                                      |
| Summary status            | PASS                                                            |
| Source of evidence        | Internal operator execution and runtime verifier output         |
| Published in central docs | 2026-06-12                                                      |

## Purpose

This record captures the first successful live validation of the offline fallback
license issuance flow used for restricted-connectivity deployments.

This page is the central validation authority target referenced by product
repositories that keep only local pointer stubs.

## Validation Outcome

The end-to-end flow completed successfully:

1. Keygen license lookup and policy/tier derivation
2. Ed25519 signing of offline payload
3. Shared runtime verifier acceptance
4. Audit log recording
5. Generation gate reset to safe default

## Verification Highlights

- Schema validation: PASS
- Signature verification: PASS
- Expiry and TTL checks: PASS
- Key ID recognition: PASS (`v1`)
- Runtime verifier parity: PASS

## Defects Found And Corrected During Validation

1. PowerShell strict-mode reference to `$PSSenderInfo` on unset variable
2. Date parsing mismatch due to JSON auto-conversion to `DateTime`
3. UTF-8 BOM incompatibility for Python payload reader

All three defects were corrected before final PASS confirmation.

## Controls And Safety Conditions

- Offline fallback remains internal-only and manually executed
- No customer self-service path exists for issuance
- Private signing keys remain outside repositories
- Failed verification blocks release of generated files
- Generation gate defaults to disabled after operation

## Traceability

- Local pointer file in product repo: `docs/first-live-issuance-validation-summary.md`
- Validation section index: `validation/index.md`

## Related

- [Validation Index](../index.md)
- [Release Gates](../release-gates.md)
- [Licensing Overview](../../licensing/overview.md)
- [Legal Authority](../../legal/authority.md)
