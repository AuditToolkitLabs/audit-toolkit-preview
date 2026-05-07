# 33. Security FAQ

## Is this product documented as a standalone service?

Yes. This documentation set treats Asset Command Center as a standalone
collector and local reporting node.

## Does data have to leave the local node?

No. Upstream forwarding is optional and should remain disabled unless a
central Audit Toolkit deployment is actually in use.

## Is host-resident software required?

No. This standalone release is centered on direct network connector
collection from the server to target systems.

## Is MFA supported?

Yes. Administrator MFA controls are present in the Admin experience,
and the super-admin portal requires a separate MFA-verified session.

## Is a first-login license acceptance step documented?

No. This documentation set does not rely on or claim an in-product
acceptance workflow.

## What should customers do for third-party integrations?

Treat them as customer-validated integrations unless the release docs
explicitly declare a supported setup path.
