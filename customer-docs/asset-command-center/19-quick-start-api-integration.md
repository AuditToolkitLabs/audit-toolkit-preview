# 19. API and Automation Guide

Asset Command Centre includes a local API surface used by the UI,
collection workflows, license views, and administrative functions.

## Documentation guidance

- use the bundled OpenAPI material shipped with the product as the
  detailed API contract
- validate API usage against the running release before automating
  production workflows
- scope credentials and API keys to the minimum access required

## Common automation uses

- inventory export
- collection-job creation and review
- license-status review
- operational reporting and snapshot export
- key-scoped onboarding and scheduled collection workflows
