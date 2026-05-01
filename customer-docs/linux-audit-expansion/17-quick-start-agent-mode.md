# 17. Quick Start — Agent Mode

| Field | Value |
| --- | --- |
| Time to complete | 10–15 minutes |
| Prerequisites | Toolkit installed; report(s) generated |

---

## Objective

Run the lightweight standalone agent to provide a local operator dashboard
for viewing audit status, latest results, and report access — without
requiring a central SIEM or reporting platform.

## When to use agent mode

- On secured administration hosts where operators need local audit visibility.
- In demo or evaluation environments with minimal infrastructure.
- For troubleshooting and ad-hoc status checks during incident response.
- Where a lightweight local web view is preferred over CLI-only access.

## Step 1 — Verify the agent component

The agent is located in the `agents/html-linux/` directory within the
installation:

```bash
ls /opt/audit-toolkit/agents/html-linux/
# Should show: agent.sh, start-web.sh, index.html, and supporting files
```

## Step 2 — Check status

```bash
bash /opt/audit-toolkit/agents/html-linux/agent.sh status
```

This shows the current audit run status, the path to the most recent
report, and whether the report passed schema validation.

## Step 3 — View the local dashboard

Start the local web server:

```bash
bash /opt/audit-toolkit/agents/html-linux/start-web.sh
```

Then open a browser on the local host or over an SSH tunnel:

```
http://localhost:8080/
```

For a persistent background daemon:

```bash
bash /opt/audit-toolkit/agents/html-linux/start-web.sh --daemon
```

Stop the daemon:

```bash
bash /opt/audit-toolkit/agents/html-linux/agent.sh stop
```

## Step 4 — SSH tunnel for remote access

To access the dashboard securely from a remote workstation:

```bash
ssh -L 8080:localhost:8080 <your-linux-host>
```

Then browse to `http://localhost:8080/` on your local machine.

**Do not expose the agent web port on a public or untrusted network
interface without authentication controls.** The agent dashboard is
intended for use over SSH tunnels or on management networks only.

## Validation

Confirm the agent is working correctly:

```bash
# Check agent process status
bash /opt/audit-toolkit/agents/html-linux/agent.sh status

# Confirm the latest report is visible
bash /opt/audit-toolkit/agents/html-linux/agent.sh dashboard

# Confirm the underlying orchestrator still runs correctly
sudo audit-toolkit --auto --json /tmp/agent-test.json
python3 /opt/audit-toolkit/ci/validate-report-schema.py /tmp/agent-test.json
```

## Related references

- `agents/html-linux/README.md` — full agent reference.
- `docs/AGENT-QUICK-START.md` — quick reference card.
- `docs/AGENT-INTEGRATION-GUIDE.md` — advanced integration patterns.
- `docs/13-managed-agent-guide.md` — managed agent fleet guide.
