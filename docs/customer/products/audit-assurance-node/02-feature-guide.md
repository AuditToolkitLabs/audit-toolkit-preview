# Audit Evidence and Integrity

This is the core assurance capability of Audit Assurance Node: every audit run produces a
**signed, tamper-evident evidence bundle**, so you can prove *what* was audited, *when*, and
that the results **have not been altered** since collection.

## Why this matters

Running an audit tells you the state of a host. **Assurance** is being able to *prove*, later
and to a third party (auditor, regulator, customer), that the audit ran and its results are
authentic and unmodified. Audit Assurance Node provides that chain of custody.

## How evidence is produced

1. Audit scripts are dispatched to target hosts through validated, transport-neutral adapters
   (SSH / WinRM / agent / API).
2. Results are checked against the **adapter contract** so every result has a consistent,
   auditable structure before it is trusted.
3. Validated results are assembled into a **structured evidence bundle** and **signed with an
   HMAC key** scoped to the environment (e.g. a dedicated production key).
4. Bundles are stored under the configured bundle path (e.g. `evidence/bundles/`) and listed
   in the operator console under **Assurance & Evidence**.

Each bundle carries a run correlation ID (RunId) so every event in the audit trail and logs
can be tied back to the exact run that produced it.

## Verifying integrity

Integrity can be re-verified at any time — the signature lets you detect tampering after the
fact:

```powershell
# Verify the most recent bundle against the configured (e.g. production) HMAC key
.\Verify-LatestBundle.ps1
```

`Verify-LatestBundle` locates the latest bundle, loads the environment HMAC key, runs
`Test-AuditBundle`, and reports PASS/FAIL. A FAIL means the bundle was altered or the key does
not match — treat it as a chain-of-custody failure and investigate.

## Using evidence

- **Operator console** — under Assurance & Evidence, browse bundles, inspect a bundle's manifest
  and signature verification, and download or forward it.
- **Compliance and governance** — attach verified bundles as audit evidence; their signatures
  demonstrate authenticity and integrity.
- **Retention** — retain bundles per your evidence-retention policy; keep the verifying key
  management separate from the bundles themselves.

## Key management

- HMAC signing keys are environment-scoped; protect the production key as a sensitive secret.
- Anyone verifying a bundle needs the matching key; distribute verification keys through an
  approved channel only.
- Rotating a signing key affects verification of bundles signed with the previous key — retain
  prior keys for as long as you must verify historical evidence.
