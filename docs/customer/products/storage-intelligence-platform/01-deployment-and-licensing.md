# Storage Intelligence Platform — Deployment & Licensing

## Available Packages

Every release ships the same code in multiple formats. Choose the one that fits
your deployment tooling.

| Format        | Targets                                          | Notes                                                                       |
| ------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| DEB           | Ubuntu 22.04, Ubuntu 24.04, Debian 12            | Server and agent as `.deb` files. Install with `dpkg` or via Ansible.       |
| RPM           | RHEL 8/9, Rocky Linux 9, AlmaLinux 9             | Install with `rpm -i` or integrate into Satellite / Ansible automation.     |
| Docker        | Server and agent                                 | Loadable image tarballs for air-gapped use. Compose file and `.env` example included. |
| Windows ZIP   | Agent                                            | Agent package for Windows Server nodes.                                     |

The Docker server image includes PostgreSQL client tools. For air-gapped
environments, load images with `docker load` — no outbound internet access is
required at run time.

## Deployment Model

Agents run directly on each storage node and publish scan results to the central
control plane over a standard HTTPS connection. Because agents always initiate
the connection:

- Network segmentation and firewall rules remain simple.
- Agents continue scanning when the server is temporarily unreachable.
- No data is lost across maintenance windows or network partitions.

## Licensing Tiers

Licences are activated by key in the admin UI or via an environment variable at
startup. The free tier requires no key and has no expiry — it simply caps at ten
managed nodes.

| Tier      | Node limit | Machine slots | Notes                                                       |
| --------- | ---------- | ------------- | ----------------------------------------------------------- |
| Free      | 10 nodes   | —             | Full feature set. No key required. No expiry. BSL 1.1.      |
| Solo      | 10 nodes   | 1             | Single-operator deployment. Key issued on purchase.         |
| Team      | 50 nodes   | 2 (floating)  | Suitable for departmental storage environments.             |
| Business  | 200 nodes  | 3 (floating)  | Enterprise storage estates and multi-site deployments.      |
| Unlimited | Unlimited  | 5 (floating)  | No node cap. For large-scale or service-provider use.       |

Keys are issued automatically after purchase and activated in
**Admin → Settings**. Activation requires outbound HTTPS to the licence service
at key activation time only — no ongoing connectivity is required.

For the full licensing policy see the
[Licensing Overview](../../../licensing/overview.md).
