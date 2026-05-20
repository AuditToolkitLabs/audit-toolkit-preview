# Quick Start - Scheduler

## Goal

Run recurring advisory checks without relying on in-process timers.

## Recommended pattern

Use an external scheduler such as Windows Task Scheduler or cron to call the
due-check endpoint or helper script.

## Why this is recommended

- It avoids duplicate in-process worker behavior
- It works consistently across host types
- It is easier to observe and troubleshoot

## Suggested steps

1. Confirm the product is installed and healthy.
2. Configure advisory refresh settings.
3. Add an external scheduled task.
4. Run a manual due-check once to verify the path.
5. Review the resulting job record and refresh output.

## Operational note

If recurring refreshes fail, check the scheduler, the runtime host, and the
vendor source access path before changing product settings.
