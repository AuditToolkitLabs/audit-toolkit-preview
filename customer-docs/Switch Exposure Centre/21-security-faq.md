# Security FAQ

## Is the product read-only?

No. It stores inventory, source settings, and operational results. It should be operated with appropriate access controls.

## Does the product hide secrets?

Yes. Secret values are intended to be masked or write-only in normal views.

## Does the product have a security scorecard?

Yes. The repository includes an internal OWASP scorecard in the main docs set.
That scorecard summarizes the current posture and is based on the current
codebase state.

## What should customers do about access control?

Restrict administrative access to the smallest practical group and use change
control for connector and source configuration.

## What about vendor feed credentials?

Customers are responsible for providing any required private feed credentials
or customer-managed export files when the vendor source is not public.
