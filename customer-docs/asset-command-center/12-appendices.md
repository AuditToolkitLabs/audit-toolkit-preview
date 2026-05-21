# 12. Appendices and Terminology

## Planned release version

- Planned release version: 1.1.0

## Key terms

| Term | Meaning in this release |
| --- | --- |
| Asset Command Centre | The standalone collector and local reporting service documented here. |
| Connector mode | The policy controlling which connector families are active. |
| `legacy-only` | The default operating mode for this release. |
| Collection profile | The policy controlling collection behavior. |
| `inventory-only` | The default profile for the standalone release. |
| Report scope | Per-user filters that constrain reporting views. |
| Team | An administrative label used on user records; not a tenancy boundary. |
| Super admin portal | Separate privileged portal requiring an additional MFA-verified session. |

## Supported release target

- Ubuntu Server 24.04 LTS x86_64
- single-node deployment
- Docker-based runtime preferred
- local reporting enabled
- optional upstream forwarding disabled by default

## Connector focus

Primary active connector set for this release:

- `ssh-host`
- `ssh-network`
- `winrm-host`
- `snmp-network`
- `ipmi-bmc`
- `nmap-sweep`
- `ansible-unified`

## Planned 1.1.0 feature-function summary

- Preserve standalone, agentless collection and inventory as the
  baseline operating model.
- Preserve local reporting, license view, and controlled administrative
  operations as first-class customer workflows.
- Preserve optional API-based forwarding to central Audit Toolkit as an
  explicitly enabled integration path.
- Preserve release packaging coverage for Linux package distributions and
  Windows MSI distribution workflows.

## Licensing notes

The product exposes a license view and administrative license form for
Asset Command Centre. Commercial questions should be directed to
[License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com).

All purchase, pricing, and upgrade transactions are handled externally at
[https://audittoolkitlabs.com/](https://audittoolkitlabs.com/). The product UI
does not host direct Stripe checkout links. In-product licensing is limited to
entering and validating issued license keys.

