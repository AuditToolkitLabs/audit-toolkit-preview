# Customer Documentation

This folder contains **customer-facing** documentation for the
**Security Audit Toolkit**. It is intentionally separate from the
`docs/` folder at the repository root, which is **internal engineering
and design documentation** describing how the product is built and
maintained.

## What goes where

| Folder | Audience | Purpose |
| --- | --- | --- |
| `docs/` | Engineering, contributors | Architecture, API spec, design notes, internal runbooks |
| `customer-docs/` | Customer admins, end users, auditors | Service description, usage, administration, and operations guidance for a deployed installation |

## How it is presented

Each markdown file in this folder is rendered to HTML and served from
the running application under `/help/`. The index lists every section
and each section is reachable as `/help/<slug>` (slug = file name
without `.md`).

The structure follows ISO/IEC 20000-1:2018 so customers can map any
section directly to a clause in their service-management system.

## Editing rules

- Keep customer-specific placeholders in angle brackets, e.g.
  `<your support email>`. These refer to the **customer's own internal**
  support, security and patch-distribution channels. Third-party
  (vendor) support contacts are fixed and listed in section 7.
- Do **not** include implementation details, design rationale, or
  internal change history — those belong in `docs/`.
- Tables should use the spaced pipe style (`| --- |`) and be surrounded
  by blank lines so markdownlint stays happy.
- Update the `Last updated` date in `index.md` when you publish a
  material change.

## Legal documents in this folder

| File | Contents |
| --- | --- |
| `LICENSE-EULA.md` | End-User Licence Agreement (BSL 1.1) — presented in-product at first sign-in |
| `NOTICE.md` | Third-party software notices and attributions |
