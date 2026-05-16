# 27. Certificate and Key Lifecycle

The product includes sensitive key and certificate workflows that must
be controlled operationally.

## Materials to govern

- TLS certificates used for the customer-facing HTTPS path
- application secret and encryption values
- target-system credentials stored through the product
- generated SSH keys and certificate artifacts from the super-admin
  portal
- API and enrollment keys used for onboarding and automation

## Recommended controls

- rotate privileged keys on a defined schedule
- store secrets outside source control
- restrict super-admin portal use
- document every key or certificate change through customer change
  control
