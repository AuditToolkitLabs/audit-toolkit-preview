# AuditToolkit – Trust Chain V5

Version: v5.0.0
Mode: End-to-end Zero Trust (Build → Signed → Runtime → Licensed)

> **Status: Design / Future.** This document describes aspirational capabilities requiring
> machine-ID binding and telemetry infrastructure not yet implemented. Preserve as a
> design target for future development.

---

## 1. Objectives (Extension Layer)

This layer adds:
- License binding to release (anti-copy / anti-replay)
- Binary-level tamper detection (code signing integration)
- Runtime reporting to Control-Centre (optional, governed)

---

## 2. Extended Trust Model

```
BUILD → SIGN (Ed25519) → PACKAGE → DEPLOY → VERIFY →
LICENSE APPLY → LICENSE BIND → RUNTIME ENFORCEMENT → OPTIONAL REPORT
```

---

## 3. License → Release Binding (Anti-Replay)

**Purpose:** Prevent copying licenses between environments, using licenses on tampered builds, or replaying licenses across versions.

**Design principle:** Bind license to release certificate hash + install identifier (machine or instance ID).

### Extended License Structure

When license is applied (online or offline), generate `license-bound.json`:

```json
{
  "licenseId": "xxxx",
  "policy": "enterprise",
  "releaseHash": "sha256-<release-cert>",
  "machineId": "<generated-host-id>",
  "issued": "2026-06-14",
  "signature": "<ed25519-signature>"
}
```

### Machine ID Generation

| OS      | Source                        |
|---------|-------------------------------|
| Windows | `MachineGuid` (registry)      |
| Linux   | `/etc/machine-id`             |

### Binding Process (On License Apply)

1. Load release certificate
2. Hash certificate
3. Extract machine ID
4. Create binding object
5. Sign (offline or via Keygen response)
6. Store as `/config/license-bound.json`

### Validation at Startup

- Compare `license.releaseHash` == current `releaseCertHash`
- Compare `license.machineId` == current machine ID
- FAIL if mismatch

---

## 4. Binary Tamper Detection (Code Signing Layer)

**Purpose:** Ensure installer integrity, executable integrity, and defence against binary tampering.

### Windows (MSI / PowerShell Tools)

**Signing (build pipeline):**
```
signtool.exe sign /fd SHA256 /a AuditTool.exe
```

**Validation (runtime):**
```
signtool verify /pa AuditTool.exe
```
or PowerShell: `Get-AuthenticodeSignature`

Required result: `Valid` — fail if not signed, certificate invalid, or signature corrupted.

### Linux (DEB / RPM)

**DEB:** `dpkg-sig` signing required  
**RPM:** `rpmsign` required

**Validation at install / runtime startup:**
```
dpkg --verify
rpm --checksig
```

**Rule:** Binary validation must occur at install time and at runtime startup (lightweight check).

---

## 5. Runtime Telemetry (Control-Centre Reporting)

**Purpose:** Optional visibility into deployment status, license state, and trust state.

**Design constraints:**
- Must be optional
- Must not block execution
- Must support offline environments

### Report Format

`runtime-status.json`:

```json
{
  "repo": "audit-assurance-node",
  "version": "v2.3.0",
  "releaseVerified": true,
  "binaryVerified": true,
  "licenseStatus": "ACTIVE",
  "policy": "enterprise",
  "timestamp": "2026-06-14T10:15:00Z"
}
```

### Transmission Modes

**Online:** `POST /runtime/ingest` to Control-Centre API  
**Offline:** Store locally; export manually

**Security:** Sign payload with Ed25519 (same key system) to prevent spoofing.

---

## 6. Full Startup Flow

Non-bypassable order:

1. Verify release signature
2. Verify file integrity
3. Verify binary signature
4. Load license (if exists)
5. Validate license binding
6. Apply policy
7. Optional telemetry send

**Stop execution if:** Release signature invalid, binary signature invalid, or license binding mismatch (when license exists).

---

## 7. Policy Integration (Extended)

Policy now enforces:
- Feature access
- Telemetry allowed / blocked
- Validation strictness

---

## 8. Governance Extension

**Ledger additions:**

```json
{
  "releaseSigned": true,
  "binarySigned": true,
  "runtimeBinding": true,
  "telemetryEnabled": true
}
```

**Certificate extensions:**

```json
{
  "binaryHashes": {},
  "signatureType": "ed25519",
  "codeSigning": "enabled"
}
```

---

## 9. Security Model Summary

| Layer     | Protection              |
|-----------|-------------------------|
| CI        | Validation              |
| Release   | Ed25519 signature       |
| Package   | Integrity               |
| Binary    | Code signing            |
| Runtime   | Signature validation    |
| License   | Bound to release        |
| Telemetry | Signed reporting        |

---

## 10. Enterprise Guarantee

- Tamper-proof builds
- Tamper-proof binaries
- License tied to release + machine
- Offline verifiable trust
- Optional central visibility
