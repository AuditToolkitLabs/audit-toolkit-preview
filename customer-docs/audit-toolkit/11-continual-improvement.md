# 11. Continual Improvement

*ISO/IEC 20000-1 clause 10*

## 11.1 Feedback channels

We welcome feedback from customers at all licence tiers:

| Channel | Purpose |
| --- | --- |
| GitHub Issues | Bug reports, feature requests, documentation suggestions |
| GitHub Discussions | General questions, community ideas, sharing audit scripts |
| Email: [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) | Commercial and contractual feedback |

When submitting a feature request via GitHub Issues, use the
`enhancement` label and provide:

- A clear description of the problem you are trying to solve.
- Your current workaround (if any).
- The licence tier you are on (affects prioritisation).

## 11.2 Roadmap

The product roadmap is maintained publicly in `ROADMAP.md` at the
repository root. Key planned improvements include:

- Extended hypervisor support (additional platforms).
- Enhanced CVE correlation against audit findings.
- Native SIEM connector packages for Splunk and Microsoft Sentinel.
- Multi-workspace support for lower licence tiers.
- Dashboard customisation and widget library expansion.

Roadmap items are not commitments; they reflect current intention and
are subject to change.

## 11.3 Beta programme

The Security Audit Toolkit operates a public beta programme.
Beta releases are published on the GitHub releases page with a
`-beta` suffix. Participation is voluntary and free.

Beta participants are encouraged to:

- Report issues via GitHub Issues with the `beta` label.
- Provide feedback on new features before they reach stable release.

See `docs/BETA-PROGRAM-TERMS.md` for the beta programme terms.

## 11.4 Audit script contributions

The audit scripts in the `audits/` directory are open for community
contribution. If you have written a script that would benefit other
users:

1. Fork the repository.
2. Follow the authoring guide in `docs/04-audit-authoring.md`.
3. Ensure the script passes `make lint` (ShellCheck and shfmt).
4. Submit a pull request.

All contributed scripts are reviewed by the maintainer before merging.

## 11.5 Service review

For customers on Business or Enterprise licence tiers, an annual
service review can be requested by emailing
[admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com). The
review covers:

- Product usage and adoption statistics (shared on request).
- Upcoming roadmap items relevant to your environment.
- Licensing tier appropriateness.
- Any outstanding support issues.
