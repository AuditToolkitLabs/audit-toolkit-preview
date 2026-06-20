# AuditToolkit – Deployment Trust Chain (V4)

Version: v4.0.0
Model: Build → Signed Release → Deploy → Runtime License Enforcement

---

## 1. Core Principle

**Build pipeline:**
- No dependency on Keygen
- Produces signed, trusted artifact

**Runtime (customer site):**
- License applied
- Feature/policy enforcement activated

---

## 2. Trust Chain Architecture

```
      BUILD (CI/CD)
          │
          ▼
  VALIDATION + SIGNING (Ed25519)
          │
          ▼
  PACKAGE (DEB / RPM / MSI)
          │
          ▼
  DEPLOY (Customer Environment)
          │
          ▼
  RUNTIME TRUST VALIDATION (signature check)
          │
          ▼
  LICENSE ACTIVATION (Keygen / Offline)
          │
          ▼
  FEATURE / POLICY ENFORCEMENT
```

---

## 3. Package Integration (OS-Native)

All packages must include:

```
/opt/audittoolkit/  (or Windows equivalent)
  ├── app/
  ├── config/
  ├── release/
  │     ├── release-cert.json
  │     └── public-keys.json
  ├── runtime/
  │     ├── verify-release.ps1  (or binary equivalent)
  │     └── license-check.ps1
  └── logs/
```

---

## 4. Release Certificate Embedding

After signing (V3), inject into package:

```
release/
  release-cert.json
  public-keys.json
```

**Package rules:**
- Installer must embed certificate
- Installer must not modify it
- Certificate is immutable

---

## 5. Runtime Signature Validation

Executed on application startup (mandatory).

Script: `/runtime/verify-release.ps1`

Responsibilities:
- Load `release-cert.json`
- Load public key set
- Validate signature
- Validate integrity (hash vs files)

**Fail conditions** — application must refuse to start if:
- Signature invalid
- Certificate missing
- Integrity mismatch

**Log output:**
```
"RELEASE TRUST: VERIFIED (key-vX)"
OR
"RELEASE TRUST: FAILED"
```

---

## 6. File Integrity Validation (Extension)

Optional but recommended. Include file manifest in certificate:

```json
{
  "files": {
    "app/main.exe": "sha256-abc",
    "app/ui/index.html": "sha256-def"
  }
}
```

Runtime check: hash key files, compare against certificate.

---

## 7. License Application (Post-Deployment)

Customer flow:
1. Install package
2. App starts → verifies release signature
3. App runs in unlicensed mode (restricted)
4. Customer applies Keygen license (online) or offline license file (Ed25519 model)

---

## 8. Runtime License Validation

Script: `/runtime/license-check.ps1`

Validates license (Keygen or offline) and determines tier:
- starter
- professional
- business
- enterprise

---

## 9. Runtime Policy Enforcement

Policy JSON ties directly to the same enforcement model:

```json
{
  "tier": "enterprise",
  "features": {
    "full-audit": true,
    "gui-testing": true,
    "export": true
  }
}
```

Application must enable/disable features dynamically and enforce limits based on tier.

---

## 10. Startup Sequence

Strict order — non-bypassable:

1. **Verify release signature** → if FAIL → STOP
2. **Verify file integrity** → if FAIL → STOP
3. **Load config**
4. **Load license** → if missing → unlicensed mode
5. **Enable features based on license**

---

## 11. Unlicensed Mode

**Allow:**
- Limited functionality
- UI visibility
- Demo mode

**Block:**
- Advanced features
- Export/output
- Automation hooks

---

## 12. Governance + Traceability

Runtime log: `/logs/runtime-validation.log`

```
[2026-06-14 10:10]
Release Signature: VERIFIED
Integrity Check:   VERIFIED
License Status:    ACTIVE
Policy:            ENTERPRISE
```

Optional: upload status to Control-Centre (future capability).

---

## 13. Packaging Hooks (Per OS)

**DEB/RPM** — post-install script (`/var/lib/dpkg/info/postinst`):
- Verify cert exists
- Log install event

**MSI (Windows)** — custom action:
- Copy cert to ProgramData
- Register validation script

---

## 14. Hard Security Rules

- Private key never leaves Control-Centre
- Public keys rotate safely (v1 → v2)
- App trusts multiple public keys simultaneously
- Runtime verification is non-bypassable

---

## 15. Trust Model Summary

| Stage   | Control                  |
|---------|--------------------------|
| Build   | CI validation            |
| Release | Ed25519 signature        |
| Package | Embedded certificate     |
| Startup | Signature verification   |
| Runtime | License enforcement      |
