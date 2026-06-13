# NVD Broker: Architecture & Sales Positioning

**Document Date:** May 20, 2026  
**Status:** Deployed & Live  
**Owner:** AuditToolkit Labs

---

## 1. Current State: Centralized NVD Broker (Phase 1)

### Live Deployment

The NVD Broker is **now deployed and live** as a Cloudflare Worker.

**Service URL:**

```text
https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev
```

**What it does right now:**

- Central gateway for all AuditToolkit tools to access NVD/CVE data
- Server-side API key storage (customers never see credentials)
- Rate-limited access to NVD with shared quota management
- KV-backed caching to minimize upstream calls
- Wraps responses with fetch timestamp and cache metadata
- Supports downloadable JSON files for offline distribution to customers

### Current Role: Fallback Service

**In the current architecture, this broker serves as:**

1. **Fallback for tools without API keys** – Tools can be deployed with zero NVD credentials and still access CVE data through the central broker
2. **Compliance compliance layer** – Keeps API keys server-side only; customers can download and redistribute data safely
3. **Rate limit shield** – Protects tools from NVD API rate limits by centralizing and sharing quota
4. **Development enabler** – Local/offline development works without a real NVD key (no-key fallback mode)

**This is intentionally temporary.**

---

## 2. Roadmap: Three-Tier NVD Access Model (Phase 2+)

### The Vision

Tools will eventually support **three independent NVD access modes**, with customers choosing based on their deployment model and scale:

```text
┌─────────────────────────────────────────────────────────────┐
│          Customer's NVD Access Choice                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tier 1: Central Broker (AuditToolkit-Managed)             │
│  ├─ No customer config needed                               │
│  ├─ Works out-of-box at low volume                          │
│  ├─ AuditToolkit controls rate limits & cache              │
│  ├─ Best for: SMB customers, trials, low-volume audits     │
│  └─ Cost: Included in subscription                          │
│                                                              │
│  Tier 2: Customer's Own NVD API Key                        │
│  ├─ Customer brings their own NVD API key                  │
│  ├─ Tool uses customer's key directly                      │
│  ├─ Customer controls rate limits & caching                │
│  ├─ Best for: Enterprise, high-volume audits, self-hosted  │
│  └─ Cost: Customer's NVD subscription cost                 │
│                                                              │
│  Tier 3: Public NVD Access (No Key)                        │
│  ├─ No API key required                                    │
│  ├─ Tool uses public NVD endpoints (limited)               │
│  ├─ Best for: Low-frequency lookups, offline caching      │
│  ├─ Slower, rate-limited by NVD                           │
│  └─ Cost: Free                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Phased Implementation

**Phase 1 (CURRENT):** Centralized broker only

- ✅ Deployed and live
- ✅ Fallback for all tools
- ✅ Compliance-safe distribution model

**Phase 2 (PLANNED):** Tool-level configuration support

- [ ] Update each tool (Linux Audit Expansion, Secure Exposure Centre, etc.) to accept `NVD_API_KEY` configuration
- [ ] Add logic: If customer provides key → use it directly; otherwise → fall back to central broker
- [ ] Reuse `nvd-broker-client.mjs` as fallback client

**Phase 3 (OPTIONAL):** Public access mode

- [ ] Add no-key public fallback using NVD's public endpoints
- [ ] Implement local caching to respect public rate limits
- [ ] Document usage restrictions for public mode

---

## 3. Sales Positioning

### The Story

> **"CVE Intelligence, Your Way"**
>
> AuditToolkit tools come with intelligent NVD access. Start with our centralized CVE broker—no configuration required. As you scale or demand higher performance, seamlessly switch to your own NVD API key for dedicated rate limits. We make it simple to match your deployment model.

### Key Sales Points

#### For SMB / Trial Customers

- ✅ **Zero configuration** – Just deploy and run; CVE data is ready
- ✅ **No credential management** – AuditToolkit handles the API key
- ✅ **Fast onboarding** – No procurement cycles for NVD keys

#### For Enterprise / Self-Hosted Customers

- ✅ **Bring your own NVD key** – Keep CVE lookups on your infrastructure if desired
- ✅ **Flexible deployment** – Works on-prem, in air-gapped environments, or private clouds
- ✅ **Compliance flexibility** – Some orgs prefer managing credentials themselves
- ✅ **Cost transparency** – Pay only your NVD subscription, not AuditToolkit's

#### For High-Volume Customers

- ✅ **Dedicated API quota** – Bypass shared rate limits with your own key
- ✅ **Performance tuning** – Control caching strategy and refresh frequency
- ✅ **Audit trails** – Your NVD API logs remain under your control

### Positioning in Sales Materials

**Current messaging:**

> "AuditToolkit includes centralized CVE intelligence powered by NVD, with intelligent caching and rate limiting. Fully managed—no configuration required. Enterprise customers can configure their own NVD API key for dedicated access."

**Sample marketing bullet:**

- 🔒 **Intelligent CVE Access** – Centralized NVD broker with automatic caching, or bring your own API key for dedicated rate limits.

---

## 4. Deployment Model: How Customers Use This

### Scenario A: SMB Customer (Using Central Broker)

**Deployment steps:**

1. Download Linux Audit Expansion or other tool
2. Deploy tool to their server (no NVD configuration)
3. Tool automatically uses AuditToolkit's centralized broker
4. CVE lookups work out-of-box

**Configuration:**

```yaml
# No NVD configuration needed
# Tool defaults to central broker
nvd_broker_url: "https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev"
nvd_api_key: null # Not required
```

### Scenario B: Enterprise Customer (Using Own API Key)

**Deployment steps:**

1. Download Linux Audit Expansion or other tool
2. Obtain NVD API key from NIST (free registration)
3. Configure tool with the API key
4. Tool uses customer's key directly

**Configuration:**

```yaml
# Customer provides their own NVD key
nvd_api_key: "sk_nist_xxxxxxxxxxxxx"
nvd_mode: "direct" # Bypass central broker
```

### Scenario C: Air-Gapped Enterprise (Using Public Access)

**Deployment steps:**

1. Download tool
2. Enable no-key public mode
3. Tool uses limited NVD public endpoints
4. Cache responses locally for offline use

**Configuration:**

```yaml
# No credentials; use public NVD endpoints
nvd_mode: "public"
nvd_cache_dir: "/var/cache/nvd" # Local cache
```

---

## 5. Current Implementation Details

### Broker Architecture

**Component:** Cloudflare Worker  
**Language:** JavaScript/Node.js  
**Runtime:** Cloudflare Workers Edge Network  
**Caching:** Dual-layer (Cache API + KV namespace)  
**Rate Limiting:** KV-backed token bucket coordination

### Broker Endpoints

| Endpoint                       | Purpose                 | Auth        |
| ------------------------------ | ----------------------- | ----------- |
| `GET /nvd/cve/:cveId`          | Lookup single CVE       | Optional    |
| `GET /nvd/search?cpeName=...`  | Search CVEs             | Optional    |
| `GET /nvd/download/cve/:cveId` | Download CVE as JSON    | Public      |
| `GET /nvd/download/search?...` | Download search results | Public      |
| `POST /admin/nvd/refresh`      | Refresh cache           | Admin token |
| `POST /admin/nvd/prewarm`      | Batch preload cache     | Admin token |

### Configuration Variables

Tools can be configured via environment variables:

```bash
# Use central broker (default)
NVD_BROKER_BASE_URL="https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev"
NVD_BROKER_TOKEN="optional-internal-token"

# Or use direct NVD API key (future)
NVD_API_KEY="your-nist-api-key"
NVD_MODE="direct"

# Or public mode (future)
NVD_MODE="public"
NVD_PUBLIC_CACHE_DIR="/var/cache/nvd"
```

---

## 6. Documentation for Tools & Customers

### For Tool Developers (Internal)

**Use the reusable client:**

```bash
# Instead of making direct NVD calls, use the broker
NVD_BROKER_BASE_URL="https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev" \
  node scripts/nvd-broker-client.mjs download-cve CVE-2024-3094
```

### For Customer Documentation

**SMB/Standard deployment:**

> "AuditToolkit includes NVD/CVE intelligence. Simply deploy the tool; CVE lookups are automatically enabled through our centralized service."

**Enterprise deployment:**

> "If you manage your own NVD API key, configure the tool to use it directly. Otherwise, the tool falls back to our centralized broker service."

**URL for documentation:**

```text
Centralized NVD Broker Service (fallback):
https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev

Example integration:
GET /nvd/download/cve/CVE-2024-3094
```

---

## 7. Future Work & Phase 2 Tasks

### Before Phase 2 rollout

- [ ] **Audit existing tools** – Identify all places that need NVD integration points
- [ ] **Add config schema** – Define tool configuration for NVD mode selection
- [ ] **Implement tool-level fallback logic** – Tools check for customer key → fall back to broker
- [ ] **Write integration docs** – Guide for updating each tool to support all three modes
- [ ] **Create customer config templates** – .env examples for all three modes
- [ ] **Sales enablement** – Train team on three-tier positioning

### Phase 2 Implementation

1. Update Linux Audit Expansion to support own API key
2. Update Secure Exposure Centre
3. Update CMDB API
4. Update other tools
5. Roll out gradually with beta customers

---

## 8. Compliance & Security Notes

### Current State Compliance

✅ **NVD API ToS Compliant**

- Only AuditToolkit's server (the worker) holds the API key
- Customers never see or manage the key
- Rate limiting is centralized and controlled
- No key material in customer-facing code

✅ **Data Distribution Safe**

- Download endpoints return JSON attachments, no key exposure
- Customers can cache and redistribute data safely
- No API key in response headers or body

✅ **Encryption in Transit**

- All traffic to broker is HTTPS
- Cloudflare workers enforce TLS 1.2+

### Future State (Phase 2+)

When customers bring their own keys:

- Customers manage their own key security
- AuditToolkit tool respects customer's rate limits and caching policies
- No change to AuditToolkit's compliance posture

---

## 9. Metrics to Track

As Phase 2 rolls out, monitor:

| Metric                   | Purpose                             |
| ------------------------ | ----------------------------------- |
| Customers using own keys | Adoption of direct API mode         |
| Cache hit rate           | Efficiency of caching layer         |
| Rate limit violations    | Identify customers needing own keys |
| Downstream NVD API calls | Total upstream usage                |

---

## 10. Contact & Ownership

**Current Broker Deployment:**

- Status: Live (May 20, 2026)
- URL: [https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev](https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev)
- Owner: AuditToolkit Labs Engineering
- Repository: audit-toolkit-preview (cloudflare-worker/)

**For questions:**

- Broker architecture: See `cloudflare-worker/README.md`
- Client integration: See `cloudflare-worker/scripts/nvd-broker-client.mjs`
- Sales positioning: Contact Product/Marketing

---

**Document Version:** 1.0  
**Last Updated:** May 20, 2026  
**Next Review:** Before Phase 2 rollout (TBD)
