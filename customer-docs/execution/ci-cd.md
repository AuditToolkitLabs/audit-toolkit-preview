# CI/CD Execution

> Central authoritative copy. This page replaces the previously duplicated
> `docs/05-ci-cd.md` files in `Audit-Tool-` and
> `audittoolkit-linux-security-lite`. Product repos should link here.

The Linux audit framework includes a matrix job to run audits in official distro
containers.

## Matrix Images

- ubuntu:24.04
- debian:12
- almalinux:9
- fedora:latest
- opensuse/leap:15
- archlinux:latest
- alpine:3.19

## How to Add a New Distro

1. Add the container image to the `matrix.image` list in `.github/workflows/ci.yml`.
2. Update `ci/bootstrap.sh` to install minimal dependencies in that image.
3. If the distro has unique package/service tools, extend shims in `lib/pkg.sh`,
   `lib/svc.sh`, and `lib/paths.sh` (and `lib/firewall.sh` / `lib/security_stack.sh`
   as needed).
4. Run CI and verify the audit(s) pass. Add SKIP/WARN where a concept does not
   exist on that distro.

## Related

- [Execution Standard](execution-standard.md)
- [Orchestrator Usage Examples](orchestrator-examples.md)
- [Library API Reference](../api/library-api-reference.md)
