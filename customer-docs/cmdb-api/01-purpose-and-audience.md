# 1. Document Purpose and Audience

## 1.1 Purpose

This document describes the service provided by the CMDB API Data
Collection Tool when deployed on-site within your environment. It
covers expected behaviour for end users, configuration responsibilities
for administrators, and operational obligations shared between you (the
customer) and us (the service provider).

It is **not** a software design document; for engineering-level
specifications please refer to the internal `docs/` folder shipped with
the source distribution.

## 1.2 Intended audience

| Audience | What they will find here |
| --- | --- |
| Business users | How to access the application, perform routine tasks, and interpret the dashboards and reports. |
| Application administrators | How to manage users, configure data sources, set up agents and schedule reports. |
| IT operations and service-management staff | How the service fits into change, incident and backup processes. |
| Security and assurance teams | Authentication options, audit logging, access-control model, data-protection responsibilities. |
| Auditors and assessors | Mapping of features to ISO/IEC 20000-1:2018 clauses and the EULA acceptance evidence model. |

## 1.3 Conventions used

- **Customer-specific values** appear in angle brackets, e.g.
  `<your support email>`. These refer to the **customer's own internal**
  contacts (your service desk, your security team, your patch channel).
  Replace these in your local copy of the documentation if you publish
  it internally.
- **Vendor (AuditAdmin Labs) contacts** are fixed addresses and are
  listed in section&nbsp;7 “Operations and Support Model”.
- **ISO/IEC 20000-1 clause references** are shown in italics under each
  section heading.
- **Permanent identifiers** such as `LICENSE_TIER`, `tenant_id` and
  HTTP paths are shown in code style.
