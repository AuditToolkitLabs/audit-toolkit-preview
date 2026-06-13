# Execution Standard

This standard defines common execution behaviour for AuditToolkit products that
run audit scripts, collectors, or remediation against local and remote targets.

## 1. Read-Only By Default

Audit and collection execution must be read-only. Scripts inspect state and
report findings; they must not modify the target. Remediation is a separate,
explicitly invoked capability and is never implied by an audit run.

## 2. Result Markers

Every executed check emits one of the following markers so orchestrators and
aggregators can parse results consistently:

| Marker   | Meaning                       | Exit contribution |
| -------- | ----------------------------- | ----------------- |
| `[PASS]` | Control satisfied             | 0                 |
| `[WARN]` | Non-blocking concern          | 1                 |
| `[FAIL]` | Control not satisfied         | 2                 |
| `[SKIP]` | Not applicable on this target | unchanged         |

The overall exit code is the highest severity observed: `0` (PASS/SKIP only),
`1` (any WARN, no FAIL), `2` (any FAIL).

## 3. Summary Requirement

Every audit must emit a summary block at the end of execution so that
orchestrators can aggregate results across many scripts. An audit that does not
print a summary is treated as incomplete.

## 4. Portability

Execution logic must not hardcode distro-specific package names, init systems,
or firewall tools. Use the shared compatibility shims (package, service,
firewall, paths, security stack). New checks that cannot run on a target must
emit `[SKIP]` with a reason rather than failing.

## 5. Elevation

Elevation is requested only when a control requires it, is scoped to the minimum
needed, and is logged. Products that support least-privilege execution (JEA on
Windows, sudo wrappers on Linux) must prefer the least-privilege path.

## 6. Determinism And Logging

- Execution must be deterministic for a given target state.
- Output must be safe to log; secrets must never be written to result output.
- Verbose and trace logging are opt-in and must not change PASS/WARN/FAIL logic.

## 7. Orchestration

Orchestrators discover executable units, filter by domain or pattern, optionally
run interactively, execute the selected units, and aggregate markers into a
single overall result. See [Orchestrator Usage Examples](orchestrator-examples.md).
