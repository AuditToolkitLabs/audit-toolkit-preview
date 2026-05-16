# Cloudflare Worker Secrets Setup

## Quick Start

1. **Copy the template:**

   ```powershell
   Copy-Item .env.secrets.example .env.secrets
   ```

2. **Edit `.env.secrets` locally** with your actual values:

   - `STRIPE_WEBHOOK_SECRET` - From Stripe Dashboard > Webhooks
   - `STRIPE_API_SECRET` - From Stripe Dashboard > API Keys
   - `KEYGEN_ACCOUNT_ID` - Your Keygen account ID
   - `KEYGEN_API_TOKEN` - From Keygen Dashboard > API Tokens
   - `KEYGEN_WEBHOOK_PUBLIC_KEY` - From Keygen Dashboard > Settings > Account public key (PEM)
   - `M365_FLOW_WEBHOOK_URL` - Already pre-filled (from Power Automate)
   - `ADMIN_API_TOKEN` - Your admin authentication token

3. **Deploy secrets to Wrangler:**

   ```powershell
   .\deploy-secrets.ps1
   ```

## Security Notes

- **Never commit `.env.secrets`** to version control (protected by `.gitignore`)
- `.env.secrets.example` is safe to commit (contains only placeholders)
- Secrets are stored securely in Cloudflare Workers environment
- Verify deployment: `wrangler secret list`

## Individual Secret Configuration

If you prefer to set secrets one at a time:

```powershell
# Add Node.js to PATH (if needed)
$env:Path += ";C:\Program Files\nodejs"

# Set individual secret
echo "your-secret-value" | wrangler secret put SECRET_NAME
```

## Deployment Info

- **Worker URL:** `https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev`
- **Version ID:** `66f236d6-7226-4c48-8bd5-4fdffae7b433`
- **KV Namespace (Production):** `23253825a905423e90de008f824ddc7f`
- **KV Namespace (Preview):** `ea2009e1c4884a3facbdc51276dfa014`

## Next Steps

1. Register Stripe webhook at Worker URL
2. Test `/health` endpoint
3. Monitor Worker logs via Wrangler: `wrangler tail`
