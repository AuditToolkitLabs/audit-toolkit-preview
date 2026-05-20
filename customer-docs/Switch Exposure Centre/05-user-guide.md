# User Guide

## Working with the console

The browser console is the main place where operators review devices,
advisories, exposures, and operational status.

## Common tasks

- Find a device and review its inventory record
- Review advisories that correlate to the device platform or firmware
- Check exposure summaries and remediation state
- Open job history to see whether a refresh completed successfully
- Review reports for export or stakeholder review
- Run a manual pentest port scan for approved targets
- Recollect a device to refresh its inventory and exposure data

## Inventory workflow

Inventory records are intended to answer what the device is, what software it
runs, and how it is connected to the rest of the security model. Keep device
names, platform details, and version data current so correlation remains useful.

## Advisory workflow

Advisory data is most valuable when it is current and source quality is known.
When a live source is unavailable, the UI should still show whether the product
used a sample feed or a customer-managed file export.

## Exposure workflow

Use exposure views to understand priority, not just volume. The goal is to
identify which devices need the most urgent attention and which advisory groups
should be handled first.

## Reports workflow

Reports are meant to support discussion with operations, security, and
management teams. They should answer the current state, the remaining risk,
and the next action to take.

## Pentest and scan workflow

Pentest scanning is an admin-controlled manual port-scan function. It is used
for approved targets only and is separate from ordinary inventory collection.

For the full pentest and network scan workflow, see
[Pentest and Network Scanning](24-pentest-and-network-scanning.md).
