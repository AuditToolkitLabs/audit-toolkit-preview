# 15. Quick Start — Agent Deployment

## Overview

Agents run on target hosts and execute audit scripts locally, pushing
results to the central application server. This avoids the need for
SSH or WinRM credentials stored on the server.

Two agent types are available:

| Agent | Use case |
| --- | --- |
| **JRE standalone agent** | Single host; pushes results directly to the API. |
| **JRE managed agent** | Fleet deployment; coordinated by the managed agent server. |

## Prerequisites

- Target host: Linux or Windows (see section 12, Appendix F for
  supported platforms).
- Java Runtime Environment 17+ on the target host (bundled in the
  agent archive for offline deployments).
- API key issued for the `operator` role from
  **Admin → API Keys → New Key** on the application server.
- Network connectivity from the target to the application server on
  port 443.

## Standalone agent — Linux

### Step 1 — Download and extract

```bash
# On the target host
mkdir -p /opt/audit-agent
tar xzf unified-jre-agent-<version>.tar.gz -C /opt/audit-agent
```

### Step 2 — Configure

Edit `/opt/audit-agent/config/agent.conf`:

```ini
server_url = https://<your-toolkit-hostname>
api_key    = <your-api-key>
agent_id   = <unique-name-for-this-host>
mode       = standalone
```

### Step 3 — Install as a service

```bash
sudo /opt/audit-agent/install-service.sh
sudo systemctl enable --now audit-agent
```

### Step 4 — Verify registration

In the web console, navigate to **Admin → Agents**. The new agent
should appear with a **Online** status within 60 seconds.

## Standalone agent — Windows

### Step 1 — Extract (Windows)

```powershell
Expand-Archive unified-jre-agent-<version>.zip -DestinationPath "C:\AuditAgent"
```

### Step 2 — Configure (Windows)

Edit `C:\AuditAgent\config\agent.conf`:

```ini
server_url = https://<your-toolkit-hostname>
api_key    = <your-api-key>
agent_id   = <unique-name-for-this-host>
mode       = standalone
```

### Step 3 — Install as a Windows service

```powershell
& "C:\AuditAgent\install-service.ps1"
Start-Service AuditAgent
```

## Managed agent — fleet deployment

For fleet deployments (many hosts), use the managed agent server to
coordinate deployment and scheduling.

### Step 1 — Configure the managed agent server

In the web console, navigate to **Admin → Managed Agent Server** and
configure:

- The server URL and API key used by the managed agent server.
- Agent packages to distribute.

### Step 2 — Deploy agents via the console

1. Navigate to **Admin → Agents → Deploy**.
2. Select target hosts (imported from your inventory or entered
   manually).
3. Choose the deployment method:
   - **SSH push** (Linux): credentials entered once, not stored on
     targets.
   - **WinRM push** (Windows).
4. Click **Deploy**. The managed agent server pushes the agent
   package and starts the service.

### Step 3 — Verify

Navigate to **Admin → Agents**. All deployed agents should show
**Online** within 2 minutes of deployment.

## Upgrading agents

From the web console: **Admin → Agents → select agents → Upgrade**.

Or manually on each host:

```bash
# Linux
sudo systemctl stop audit-agent
tar xzf unified-jre-agent-<new-version>.tar.gz -C /opt/audit-agent --overwrite
sudo systemctl start audit-agent
```

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Agent does not appear in console | Check network connectivity from target to server on port 443; check API key is valid |
| Agent shows **Offline** | Check agent service is running: `systemctl status audit-agent` |
| TLS certificate error in agent log | Add your CA certificate to the system trust store on the target |
| Agent log shows `401 Unauthorized` | Regenerate or check the API key in `agent.conf` |

Agent logs: `/var/log/audit-agent/agent.log` (Linux) or
`C:\ProgramData\AuditAgent\logs\agent.log` (Windows).

Full guide: `MANAGED-AGENT-USER-GUIDE.md` and
`STANDALONE-AGENT-USER-GUIDE.md` at the repository root.
