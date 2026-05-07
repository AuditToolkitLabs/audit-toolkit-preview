# 24. Backup and Recovery Runbook

Customers are responsible for protecting the standalone node's data and
configuration.

## Back up at minimum

- PostgreSQL data
- application configuration
- encryption and secret material managed outside source control
- relevant logs and exported reports as required by customer policy

## Recovery approach

1. restore the Ubuntu host or provision a replacement host
2. restore configuration and secrets
3. restore the PostgreSQL data set
4. start the application stack
5. validate UI access, reporting, and connector readiness

Recovery targets depend on the customer's infrastructure, backup
frequency, and storage performance.
