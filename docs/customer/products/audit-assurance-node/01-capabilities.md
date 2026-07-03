# Audit Assurance Node Capabilities

Audit Assurance Node coordinates fleet-scale audit collection and turns the
results into signed, tamper-evident evidence. This page summarises what the
product can do, grouped by capability area.

## Evidence integrity and assurance

The core of the product: every audit run produces a signed, tamper-evident
evidence bundle so you can prove *what* was audited, *when*, and that the results
have **not** been altered since collection.

- Validated adapter results are assembled into a **structured evidence bundle**
  and **signed with an HMAC key** scoped to the environment (e.g. a dedicated
  production key).
- Bundles are stored under the configured bundle path and listed in the operator
  console under **Assurance & Evidence**.
- Each bundle carries a run correlation ID (RunId) tying every audit-trail and
  log event back to the exact run that produced it.
- Integrity can be **re-verified at any time** — a verification step locates the
  latest bundle, loads the environment key, and reports PASS/FAIL. A FAIL means
  the bundle was altered or the key does not match, and is treated as a
  chain-of-custody failure.
- HMAC signing keys are environment-scoped; keys are managed separately from the
  bundles, and prior keys are retained for as long as historical evidence must be
  verified.

See the **Feature Guide** for full detail.

## Transports

The node supports multiple execution and ingestion transports while keeping
downstream assurance processing consistent. Use the least broad transport that
satisfies the evidence requirement.

- **Local** — lab runs or host-local validation.
- **SSH** — approved Linux/Unix remote targets; captures stdout, stderr, exit
  code, and target/transport metadata into the normalised result object.
- **WinRM** — approved Windows targets via PowerShell remoting, with support for
  constrained endpoints such as Just Enough Administration (JEA).
- **API** — platforms exposing structured management APIs (hypervisors, consoles,
  appliances) via token-based read access.
- **Agent** — constrained or air-gapped environments, triggering an approved
  local agent or ingesting an agent-produced result file.

Each transport has documented pre-enablement checks covering target
authorisation, credential scope, logging, network paths, and provenance.

## Adapters and the contract layer

Adapters isolate transport-specific execution from the assurance pipeline. Each
adapter connects to a target or evidence source, executes or ingests audit
output, and returns a **normalised result object** — so the pipeline processes
evidence without needing to know which transport produced it.

- **Adapter contract** — all adapters must return a result object with required
  `target`, `execution`, `script`, and `status` fields (including success, exit
  code, stdout, and stderr). Invalid objects are **rejected** before any evidence
  is signed or bundled.
- **Supported adapters** — SSH (Linux/Unix), WinRM/HTTPS (Windows), Agent (HTTPS,
  registered AuditToolkit agents), and API (Audit-Tool REST HTTPS).
- **Clear boundaries** — adapters connect, execute/query, capture, normalise, and
  validate; they do **not** perform compliance scoring, evidence signing, bundle
  creation, report generation, or assurance policy decisions.
- **Contract testing** — the product ships adapter contract tests for valid and
  invalid fixtures across local, SSH, WinRM, agent, and API results; these should
  pass before adding or changing an adapter.
- **Guided setup** — each adapter has a step-by-step pattern (reachability,
  credentials, least-privilege scope, pilot audit, contract-field confirmation)
  and a troubleshooting table for common failures.

## Parallel execution and tracing

The node can execute across multiple target hosts within a single run and prove
the concurrent run behaved as expected — results were not dropped, duplicated, or
reordered in a way that affects evidence.

- Per-run tracing logs the `RunId`, per-slot worker identifier, target/transport,
  queueing and dispatch events, adapter start/completion/exit events, timings,
  exit codes, and result acceptance or rejection.
- **Concurrency confirmation** via overlapping execution windows; parallelism of
  `1` runs intentionally sequentially.
- **Drop/duplicate detection** by comparing inventory counts against queueing,
  dispatch, completion, and final result counts, with grouping by hostname.
- **Deterministic ordering** — results are sorted by stable fields (host, script
  path, transport) before reporting and bundling, so output stays predictable
  even under concurrency.
- Customer controls guide safe scaling of parallelism (target-owner approval,
  capacity checks, maintenance windows, start-low-and-increase).

## Authentication and access control

Credential handling is separated from execution adapters so each transport can
request approved credentials without hardcoding secrets.

- **Central authentication layer** loads configuration, retrieves secrets from
  approved sources (config file or environment variables, with env vars taking
  precedence), and supplies credential objects to adapters — adapters never embed
  secrets.
- **Role-based access control** in the console with three hierarchical roles:
  Viewer (view and download evidence), Operator (dispatch/requeue/cancel jobs,
  enrol/remove agents), and Admin (user, role, and identity configuration).
- **Enterprise identity (SSO)** — OIDC (Microsoft Entra ID, Okta) and LDAP /
  Active Directory in-box; SAML 2.0 as an optional add-on this release. MFA is
  enforced at the identity provider. Directory groups/claims map to roles;
  unmapped users receive the default Viewer role, with a local break-glass admin.
- **Coordinator API auth** — the coordination API used by Audit-Tool and agents
  is authenticated with bearer tokens in the `X-API-Token` header; the node
  validates tokens but does not administer them.
- **Secure practices** — never hardcode or commit secrets, use separate
  credentials per environment, prefer short-lived/centrally managed secrets, and
  align rotation with change management.
