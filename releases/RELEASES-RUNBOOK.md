# Releases Runbook

How product releases get from the private Gitea server onto the public website.

## Pipeline

```
Private Gitea (localhost:3000)        On the Gitea host                Public
  release published                 ci/sync-releases.py              GitHub + Pages
  • notes, assets        ──token──▶  • download assets    ──gh────▶  GitHub Releases
                                     • write source-free   (binaries)  AuditToolkitLabs/releases
                                       JSON to releases/data ──git──▶  Pages site
                                                              (notes)   *-releases.html render
```

- **Source of truth:** private Gitea (`http://localhost:3000`, org `audittoolkitlabs`).
  Repos are private — needs `GITEA_TOKEN` (read-only). Loopback-only.
- **Download hub:** **GitHub Releases** on the PUBLIC repo `AuditToolkitLabs/releases`,
  one release per product version, tag `‹slug›-‹version›`
  (e.g. `storage-intelligence-platform-v1.0.17`).
- **Site:** `releases/data/*.json` (committed, source-free) is rendered by
  `releases.html` (hub) and the per-product `*-releases.html` pages.
- **Retention:** `keep_releases` in `releases/releases-sources.json` (default **2** =
  present + last one). Older GitHub releases are pruned automatically.

## Why this must run on the Gitea host

The release binaries live on **loopback** Gitea. A cloud runner (GitHub Actions) or
Power Automate **cannot reach them**, so they cannot move the binaries. Anything that
publishes binaries has to run on the machine that can see `localhost:3000`. Power
Automate / webhooks can still be used for *notifications*, not for the binary upload.

## One-time setup

1. **Token:** `setx GITEA_TOKEN <read-only-token>` (or set it in the scheduled task).
2. **gh CLI:** authenticated as an **org admin** of `AuditToolkitLabs`. This matters —
   the hub repo has a `block-all-tags` ruleset; an **OrganizationAdmin bypass** lets the
   admin identity create/delete release tags while everyone else stays blocked.
3. **git:** push rights to `AuditToolkitLabs/audit-toolkit-preview` (the site repo).

## Manual publish

```bash
# Publish a specific version of one product (and prune to retention):
python ci/sync-releases.py --product storage-intelligence-platform --tag v1.0.17 --publish-github

# Publish the newest N (keep_releases) of every product, idempotently:
python ci/sync-releases.py --publish-github

# Metadata-only refresh (no binary work) + rebuild the hub index:
python ci/sync-releases.py

# CI guard — non-zero exit if committed JSON is stale:
python ci/sync-releases.py --check
```

Then commit & push `releases/data/` (or just run the wrapper below, which does it).

## Automated publish (recommended)

`ci/publish-releases.ps1` does publish → prune → metadata refresh → commit → push in
one idempotent pass. Already-published versions are skipped, so it is cheap to run
repeatedly.

### Option A — Scheduled task (simplest, reliable)

Register it to run, say, every 15 minutes on the Gitea host:

```powershell
$action  = New-ScheduledTaskAction -Execute "pwsh.exe" `
  -Argument "-File E:\repo-splits-2\audit-toolkit-preview\ci\publish-releases.ps1"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
  -RepetitionInterval (New-TimeSpan -Minutes 15)
Register-ScheduledTask -TaskName "AuditToolkit-Release-Sync" `
  -Action $action -Trigger $trigger -RunLevel Highest
```

It polls: if no new tag, nothing is published and nothing is pushed.

### Option B — Trigger on each new release (event-driven)

Gitea can fire a webhook on the `release` event. Point it at a tiny local listener on
the Gitea host that runs `publish-releases.ps1`. Gitea → **Settings → Webhooks → Add
Webhook**, event = *Release*, target = your local listener URL. (Outbound webhooks
work even though Gitea itself is loopback.) The listener must run on the host for the
loopback reason above. Power Automate can receive the same webhook for **notifications**
(e.g. "v1.0.18 published") but cannot move the binaries.

## Adding a product

Add an entry to `releases/releases-sources.json`:

```json
{ "slug": "‹slug›", "name": "‹Product Name›", "repo": "‹Gitea-repo›",
  "page": "‹product›-releases.html", "blurb": "‹one line for the hub card›" }
```

Create a `‹product›-releases.html` page (copy `storage-scanner-releases.html`, change
the `DATA_URL`), then run a publish. The hub card appears automatically once the
product has at least one mirrored release.
