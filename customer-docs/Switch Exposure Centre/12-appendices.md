# Appendices

## Glossary

- CMDB: configuration management database
- CVE: common vulnerabilities and exposures
- CVSS: common vulnerability scoring system
- KEV: known exploited vulnerabilities
- SSH: secure shell
- NETCONF: network configuration protocol

## Key paths

- `src/app.py`: Flask application factory
- `src/api/`: API route modules
- `src/connectors/`: vendor connector implementations
- `src/services/`: business logic and refresh services
- `src/static/`: browser console assets
- `docs/`: repository documentation

## Troubleshooting checklist

- Confirm the database is reachable.
- Confirm connector credentials are present.
- Confirm the advisory source is reachable or that the fallback path is valid.
- Confirm the latest refresh job finished successfully.
- Confirm the browser console shows the expected inventory and exposures.

## Support bundle content

A good support bundle includes version, affected vendors, recent job output,
configuration changes, and the exact symptoms observed by the operator.
