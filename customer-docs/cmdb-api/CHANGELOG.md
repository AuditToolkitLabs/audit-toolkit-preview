# Changelog

All notable changes to the CMDB API Data Collection Tool are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-05-15

### Fixed

- **Webhook Validation**
  - Fixed webhook URL validation to properly handle test-mode DNS failures
  - Limit test-mode DNS bypass to example domains only (RFC 2606 compliant)
  - Tightened URL checks to prevent invalid URI patterns

- **Security Hardening**
  - Added release-scope security gate in CI/CD pipeline
  - Enhanced security scanning with CodeQL custom configuration
  - Implemented dual-scope security reporting (raw + deployable scope)
  - Improved TLS context initialization for API connections

- **Configuration Management**
  - Fixed CodeQL configuration syntax errors causing persistent CI failures
  - Restored proper YAML structure for security scanning rules

### Security

- Security assessment confirms 0 findings in deployable release scope (CodeQL + Bandit)
- Full-workspace transparency scan retained for audit visibility (8,024 findings across all paths including test/venv)
- Upgraded CI/CD actions to latest secure versions (v5/v4 with Node24 opt-in)
- Enhanced audit logging for webhook operations

### Known Limitations

- Single-instance deployment recommended for production (clustering not yet supported)
- Managed agent currently supports Windows PowerShell 5.0+ and bash-based Linux systems
- Maximum concurrent API connections: 100 (configurable)

### Upgrade Path

Users running v1.0.0 should upgrade to v1.0.1 for webhook validation fixes and security hardening.

## [1.0.0] - 2026-05-13

### Added

- **Core CMDB Functionality**
  - API-based data collection from multiple sources
  - Configuration Database (CMDB) for centralized asset and configuration management
  - RESTful API for programmatic access to CMDB data
  - Web UI for manual data entry and browsing

- **Managed Agent**
  - Lightweight managed agent for distributed data collection
  - Secure communication with API server
  - Automated inventory collection from remote hosts
  - Support for Windows and Linux environments

- **Integrations**
  - SIEM integration (webhook-based event forwarding)
  - ITSM ticketing system integration
  - SSO/OAuth2 authentication support
  - Custom webhook delivery for third-party systems
  - Service Bus and Event Hub connectors for Azure environments

- **Security & Compliance**
  - Role-based access control (RBAC)
  - API key authentication
  - Enterprise audit logging
  - Security compliance reports (OWASP scorecard alignment)
  - Data encryption for sensitive fields
  - TLS 1.2 and TLS 1.3 support

- **Reporting & Analytics**
  - Vulnerability correlation and CVE tracking
  - Risk scoring and prioritization
  - Customizable compliance reports (PDF export)
  - Dashboard with key metrics and insights
  - Grafana integration for monitoring

- **Data Management**
  - Automated backup and restore functionality
  - Database migrations for version upgrades
  - Support for SQLite and PostgreSQL backends
  - Multi-tenancy support for hosted deployments

- **Administrative Features**
  - Certificate lifecycle management
  - License activation and validation
  - Configuration management via environment variables
  - Comprehensive documentation for deployment and operations
  - Docker containerization for easy deployment

- **Documentation**
  - Complete customer documentation suite
  - Installation and deployment guides
  - Operations and support runbooks
  - API consumer and automation guide
  - Quick-start integration guides
  - Security and compliance documentation

### Security Notes (v1.0.0)

- Initial security hardening and vulnerability remediation completed
- OWASP security scorecard review and alignment
- Dependency scanning and management
- Secure credential handling
- Protection against common web vulnerabilities

### Initial Limitations (v1.0.0)

- Single-instance deployment recommended for production (clustering not yet supported)
- Managed agent currently supports Windows PowerShell 5.0+ and bash-based Linux systems
- Maximum concurrent API connections: 100 (configurable)

---

## Release Information

**Current Version:** 1.0.1  
**Release Date:** May 15, 2026  
**Status:** General Availability (Patch Release)

**Previous Release:**

- **Version:** 1.0.0  
- **Release Date:** May 13, 2026

For installation, upgrade, and deployment instructions, refer to:

- [Service Transition and Initial Setup](04-service-transition.md)
- [Core Server Installation Guide](20-core-server-installation-linux-windows.md)
- [Deployment Guide](../docs/04-deployment-guide.md)
