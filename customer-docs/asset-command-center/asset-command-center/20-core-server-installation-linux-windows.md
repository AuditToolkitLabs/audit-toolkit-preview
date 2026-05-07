# 20. Supported Installation Model

The primary supported installation model for this release is:

- Ubuntu Server 24.04 LTS x86_64
- single-node deployment
- Docker-based runtime
- local PostgreSQL by default, external PostgreSQL at scale

## Installation summary

1. provision the Ubuntu host on the management network
2. install Docker Engine and Docker Compose plugin
3. place product files, configuration, and persistent storage under a
   dedicated application path
4. configure secrets, encryption key, database connection, and
   connector-policy settings
5. start the stack and validate UI, worker, and storage health

Windows-specific installation guidance is not treated as the primary
release-ready customer path for this standalone release.
