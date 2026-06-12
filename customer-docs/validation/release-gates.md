# Release Gates

A build is not customer-ready until every gate below passes. These gates are the
central authority; product release runbooks reference them rather than redefining
them.

## 1. Documentation Gate

- Every required entry in the release-bundle docs manifest exists.
- No internal-only documents are present in the customer bundle.
- The customer deployment pack is included.
- Legal and licensing links resolve to central authority pages.
- The bundle records the central docs commit used for the sync.

## 2. Licensing And Entitlement Gate

- Public tier names match the canonical tier list.
- No `WEBSITE / STRIPE / KEYGEN / RUNTIME DRIFT` markers are unresolved.
- Online and offline licensing behave as documented for the release.

## 3. Security Gate

- The current OWASP security scorecard is recorded centrally for the release.
- No unresolved high or critical findings without an accepted, documented risk.
- Secrets scanning and dependency review pass.

## 4. Packaging Evidence Gate

- DEB, RPM, and MSI payloads are verified to contain exactly the intended files.
- Checksums are generated for all shipped artifacts, including copied docs.
- Build is reproducible from the recorded source manifest.

## 5. Validation Report Gate

- A readiness report exists for the product and version.
- Coverage matrices (CIS/STIG) are current where the product claims coverage.

## 6. Sign-Off

A release is approved only when all gates are green and the evidence is recorded
under [Validation](index.md) and the corresponding [Release](../releases/index.md)
entry.
