# Operational Limits and Known Constraints

## Current constraints

- The product is focused on network switches and adjacent equipment.
- SAN switches are fully supported and can be scanned as part of the normal
  collection workflow.
- Pentest scanning is manual, admin-gated, and limited to IP-based targets and
  policy-approved ports.
- Live source quality depends on the access path the customer can support.
- External scheduler behavior is preferred over in-process timers.

## Practical limits

- Collection quality is only as good as the device credentials and vendor data
  sources that are configured.
- Public advisory data may not always include every field needed for perfect
  correlation.
- Fallback paths are useful, but they should be understood as fallback paths.

## Operational assumption

The product works best when the customer can keep credentials, sources, and
scheduled refreshes under clear operational control.
