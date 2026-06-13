# Adapter Standard

Adapters connect an AuditToolkit control plane to a target using a specific
transport (SSH, WinRM, HTTP API, or managed agent). This standard defines the
behaviour every adapter must satisfy so that audit content remains transport
neutral.

## 1. Assurance Neutrality

An audit or collector must produce equivalent findings regardless of the
transport used to reach the target. Adapters move commands and results; they do
not interpret, filter, or re-score findings.

## 2. Common Adapter Contract

Every adapter exposes a consistent capability surface:

| Capability | Requirement                                                       |
| ---------- | ----------------------------------------------------------------- |
| Connect    | Establish an authenticated session to the target.                 |
| Execute    | Run a command or script and return stdout, stderr, and exit code. |
| Transfer   | Stage and retrieve files where the transport supports it.         |
| Probe      | Report target identity and reachability without side effects.     |
| Disconnect | Release the session and any temporary material.                   |

## 3. Transport Notes

- **SSH** — Key-based authentication preferred; host key verification required.
- **WinRM** — Use constrained endpoints (JEA) where available; avoid full admin.
- **HTTP API** — Token-scoped; respect rate limits and TLS verification.
- **Managed agent** — Mutually authenticated; agent runs least-privilege work.

Product repositories may document transport-specific command examples, but the
neutral contract above is authoritative.

## 4. Failure Handling

Adapters distinguish transport failures (unreachable, auth failed) from control
results. A transport failure is reported as an execution error, not as a `[FAIL]`
control result, so that scorecards are not skewed by connectivity problems.

## 5. Security

- No credentials are written to result output or logs.
- Temporary remote material is removed on disconnect.
- TLS and host key verification are enabled by default and only relaxed by
  explicit, documented operator action.
