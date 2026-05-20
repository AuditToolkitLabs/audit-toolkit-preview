# Change Management

## Why change control matters

Small changes to connectors, sources, or scheduling can have a large effect on
report quality. Changes should be deliberate and validated.

## Changes that need review

- Connector credential changes
- Source mode or feed URL changes
- New vendors or collection methods
- Scheduler interval changes
- Retention or purge changes
- UI or API contract changes

## Change steps

1. Describe the change and the reason for it.
2. Confirm who is affected.
3. Apply the change in a controlled environment first.
4. Validate the result with a refresh or test run.
5. Record the outcome and any rollback details.

## Rollback

If the change affects data collection or advisory source quality, keep the
previous working configuration available so it can be restored quickly.

## Validation

At minimum, validate that the product still starts, the relevant refresh path
works, and the main report views still render correctly.
