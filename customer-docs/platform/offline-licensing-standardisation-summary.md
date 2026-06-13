# Offline Licensing Standardisation — Platform Summary

|               |                                 |
| ------------- | ------------------------------- |
| **Completed** | 2026-06-11                      |
| **Author**    | AuditToolkit Platform Team      |
| **Status**    | COMPLETE — all 6 repos verified |

---

## Purpose

Standardise offline license validation across all standalone AuditToolkit product repos
so that each tool can validate the same signed `.offline.lic` file independently,
without requiring `Audit-Tool-` to be deployed at the customer site.

Prior to this work, only `Audit-Tool-` could validate offline licenses. All other
products would fall back to community tier if the Keygen API was unreachable.

---

## Architectural Rules (hard constraints)

| Rule                                            | Rationale                                |
| ----------------------------------------------- | ---------------------------------------- |
| No repo depends on Audit-Tool- being present    | Customer site deployments are standalone |
| No signing or generation in product repos       | Only Control Centre may issue licenses   |
| No Control Centre logic in product repos        | Separation of issuance and consumption   |
| Control Centre unchanged                        | Standardisation is consumer-side only    |
| Every standalone tool validates the same format | One .lic file works everywhere           |

---

## Files Deployed to Each Product Repo

| File                                      | Purpose                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `shared/licensing/verify_license_file.py` | Ed25519 verifier — exact copy of authoritative version in `Audit-Tool-` |
| `shared/licensing/license_schema.json`    | JSON schema — validates 16 required fields before signature check       |

Each file is placed at `<repo_root>/shared/licensing/`. Python imports it via namespace packages (no `__init__.py` required under Python 3.3+).

---

## Repos Standardised

| Repo                               | Licensing module modified                                 | `parents[N]` for repo root | cryptography     |
| ---------------------------------- | --------------------------------------------------------- | -------------------------- | ---------------- |
| `Audit-Tool-`                      | `shared/licensing/verify_license_file.py` (authoritative) | n/a                        | ✓ present        |
| `audit-assurance-node`             | `web/licensing.py` (new)                                  | `parents[1]`               | added `>=42.0.0` |
| `Switch-Exposure-Center`           | `src/services/licensing.py`                               | `parents[2]`               | ✓ present        |
| `Asset-Command-Centre`             | `tools/asset-management/src/services/licensing.py`        | `parents[4]`               | ✓ present        |
| `audittoolkit-linux-security-lite` | `agents/html-linux/web/licensing.py`                      | `parents[3]`               | ✓ present        |
| `cmdb-api-data-collection-tool`    | `app/license.py`                                          | `parents[1]`               | ✓ present        |

---

## Integration Pattern

Each licensing module received the same optional import block + helper function:

```python
# ---------------------------------------------------------------------------
# Optional offline license verifier (Ed25519, no Control Centre dependency)
# ---------------------------------------------------------------------------
import sys as _sys
from pathlib import Path as _Path
_OFFLINE_LIC_ROOT = _Path(__file__).resolve().parents[N]
if str(_OFFLINE_LIC_ROOT) not in _sys.path:
    _sys.path.insert(0, str(_OFFLINE_LIC_ROOT))
del _sys, _Path

try:
    from shared.licensing.verify_license_file import VerificationResult, verify_license_file
    _OFFLINE_VERIFIER_AVAILABLE = True
except ImportError:
    _OFFLINE_VERIFIER_AVAILABLE = False


def load_offline_license() -> "dict | None":
    """Check data/licenses/ for a valid offline .lic file; return entitlement or None."""
    if not _OFFLINE_VERIFIER_AVAILABLE:
        return None
    schema_path = _OFFLINE_LIC_ROOT / "shared" / "licensing" / "license_schema.json"
    if not schema_path.exists():
        return None
    for search_dir in [
        _OFFLINE_LIC_ROOT / "data" / "licenses",
        _OFFLINE_LIC_ROOT / "config",
        _OFFLINE_LIC_ROOT,
    ]:
        if not search_dir.is_dir():
            continue
        for lic_file in sorted(search_dir.glob("*.offline.lic")):
            result = verify_license_file(lic_file, schema_path)
            if result.ok:
                return result.entitlement
    return None
```

The sys.path insertion ensures that the `shared/` directory at the repo root is
discoverable regardless of which working directory the app is launched from.

---

## License File Search Order

`load_offline_license()` searches these directories in order, returning the first
valid file found:

1. `<repo_root>/data/licenses/*.offline.lic`
2. `<repo_root>/config/*.offline.lic`
3. `<repo_root>/*.offline.lic`

---

## Signing Key

| Field                | Value                                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| Algorithm            | Ed25519                                                                       |
| `key_id`             | `v1`                                                                          |
| Public key           | `MCowBQYDK2VwAyEAY3U5oFRB6zBcgKSKP7UJ5r8964pBuP+YkVbEiiHLeII=`                |
| Private key location | `F:\AuditProducts\keys\offline-license-ed25519-pkcs8.pem` (outside all repos) |

---

## Validation Test Results (2026-06-11)

Test .lic: `e312f62d-a5fa-4fde-8c4d-034413182651.offline.lic` (tier: starter, expires 2026-06-25)

### Positive tests — all 6 repos

| Repo                               | Result | Tier    |
| ---------------------------------- | ------ | ------- |
| `Audit-Tool-`                      | PASS   | starter |
| `audit-assurance-node`             | PASS   | starter |
| `Switch-Exposure-Center`           | PASS   | starter |
| `Asset-Command-Centre`             | PASS   | starter |
| `audittoolkit-linux-security-lite` | PASS   | starter |
| `cmdb-api-data-collection-tool`    | PASS   | starter |

### Negative tests (all run against `audit-assurance-node` verifier)

| Case                                                      | Expected | Actual reason                   |
| --------------------------------------------------------- | -------- | ------------------------------- |
| Corrupted signature (invalid base64 content)              | FAIL     | `Signature verification failed` |
| Missing required field (`tier` removed)                   | FAIL     | `Missing required fields: tier` |
| Tampered payload (tier changed to `enterprise` post-sign) | FAIL     | `Signature verification failed` |

---

## What Each Product Should Do Next

Product teams should wire `load_offline_license()` into their existing license check
flow as a fallback when the Keygen API is unreachable:

```python
from <module>.licensing import load_offline_license

def get_effective_license():
    # 1. Try Keygen online validation (existing logic)
    keygen_result = try_keygen_validate()
    if keygen_result:
        return keygen_result

    # 2. Fall back to offline .lic file
    offline = load_offline_license()
    if offline:
        return offline

    # 3. Community tier
    return COMMUNITY_ENTITLEMENT
```

The entitlement dict returned by `load_offline_license()` contains:
`tier`, `license_id`, `account_id`, `product_id`, `policy_id`, `key_id`,
`expires_at`, `ttl_expires_at`, `entitlements`, `limits`, `deployment_mode`,
`support_level`, `license_source` (`"offline"`), `validation_source` (`"offline"`).

---

## Related Documents

- `AuditToolkit-Control-Centre/docs/OFFLINE-FALLBACK-OPERATOR-RUNBOOK.md`
- `AuditToolkit-Control-Centre/docs/OFFLINE-FALLBACK-SETTINGS.md`
- `AuditToolkit-Control-Centre/docs/first-live-issuance-validation-summary.md`
- Per-repo: `docs/OFFLINE-LICENSING.md` (in each product repo)
