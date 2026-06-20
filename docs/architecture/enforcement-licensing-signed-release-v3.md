# AuditToolkit – Secure Enforcement Extension (V3)

Version: v3.0.0
Authority: Control-Centre
Security Model: Keygen (cloud) + Ed25519 (offline trust)

---

## 1. Architecture Extension

```
Control-Centre/
  ├── enforcement/
  ├── policies/
  ├── governance/
  ├── crypto/
  │     └── ed25519/
  │           ├── sign-release.ps1
  │           ├── verify-release.ps1
  │           └── public-keys.json
  └── licensing/
        ├── keygen-validator.ps1
        └── policy-resolver.ps1
```

> **Note:** This directory layout is the design target. The current workspace implements the same
> capabilities via pre-push hooks and the `scripts/` directory rather than this exact structure.

---

## 2. Keygen License Validation Integration

**Purpose:** Enforce that only valid licensed environments can run full validation or produce release certificates. Prevents unlicensed / downgraded environments from bypassing controls.

**Required environment variable:**
```
KEYGEN_LICENSE_KEY
```

Optional:
```
KEYGEN_ACCOUNT_ID
KEYGEN_PRODUCT_ID
```

**Validation script:** `/licensing/keygen-validator.ps1`

Responsibilities:
- Call Keygen API
- Validate: license status (ACTIVE only), expiry, policy name (starter/professional/etc)
- Output normalized result:

```json
{
  "valid": true,
  "policy": "enterprise",
  "expiry": "2026-12-01"
}
```

**Pipeline step — add before validation:**
```yaml
- name: Validate License
  run: pwsh ./control-centre/licensing/keygen-validator.ps1
```

**Fail conditions:** Pipeline fails if license is invalid, expired, or policy mismatches repo config.

---

## 3. Policy Resolution (Keygen + Local)

Source of truth priority:
1. Keygen license (authoritative)
2. Repo policy file (fallback)

**Script:** `/licensing/policy-resolver.ps1`

Logic:
- Read Keygen policy
- Override local `.enforcement-policy`
- Export POLICY env variable for pipeline

---

## 4. Ed25519 Signed Release Certificates

**Purpose:** Cryptographic proof that validation passed and the release is trusted. Works offline (aligns with existing AuditToolkit model).

**Key model:**
- Private key → Control-Centre only
- Public keys → distributed to all tools
- Supports rotation (v1 → v2)

### Sign Script

`/crypto/ed25519/sign-release.ps1`

Input: version, repo, commit, ledger file

Process:
1. Load private key
2. Hash certificate payload
3. Sign using Ed25519
4. Output signed certificate

Output: `release-cert-<version>.json`

```json
{
  "version": "v2.3.0",
  "repo": "audit-assurance-node",
  "commit": "abc123",
  "ledgerHash": "sha256-xyz",
  "timestamp": "2026-06-14",
  "signature": "<ed25519-signature>",
  "publicKeyId": "key-v1"
}
```

### Verify Script

`/crypto/ed25519/verify-release.ps1`

- Load public key set
- Validate signature
- Confirm integrity

---

## 5. Pipeline Integration

**Execution order (critical):**

1. License validation (Keygen)
2. Policy resolution
3. Enforcement version check
4. Validation execution (HTML / Links / GUI)
5. Ledger generation
6. Sign release certificate (Ed25519)

**Gitea pipeline steps:**

```yaml
- name: Resolve Policy
  run: pwsh ./control-centre/licensing/policy-resolver.ps1

- name: Run Validation
  run: pwsh ./control-centre/enforcement/orchestration/run-validation.ps1

- name: Sign Release Certificate
  run: pwsh ./control-centre/crypto/ed25519/sign-release.ps1
```

---

## 6. Governance Ledger Extension

Extend ledger with crypto proof:

```json
{
  "repo": "repo1",
  "status": "PASS",
  "policy": "enterprise",
  "timestamp": "...",
  "licenseValidated": true,
  "licensePolicy": "enterprise",
  "certificateSigned": true,
  "certificateRef": "release-cert-v2.3.0.json"
}
```

---

## 7. Release Gate (Hard Rule)

Release blocked unless:
- License validated (Keygen)
- Policy enforced
- All validations pass
- Ledger generated
- Certificate signed (Ed25519)

---

## 8. Key Rotation Support

`/public-keys.json`:

```json
[
  { "id": "key-v1", "key": "..." },
  { "id": "key-v2", "key": "..." }
]
```

**Rule:** Always sign with latest private key; always verify against all public keys.

---

## 9. Offline Validation

Signed certificate can be verified:
- Without Keygen
- Without CI
- At customer site

This aligns with the AuditToolkit offline licensing model and enterprise deployment strategy.

---

## 10. Security Model Summary

| Layer      | Control                    |
|------------|----------------------------|
| Licensing  | Keygen validation          |
| Policy     | Tier-based enforcement     |
| Validation | HTML + GUI + Links         |
| Governance | Ledger                     |
| Integrity  | Ed25519 signature          |
