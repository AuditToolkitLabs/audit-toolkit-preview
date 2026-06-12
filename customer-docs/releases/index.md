# Releases

This section is the central home for product release notes and versioned release
documentation. Each product publishes release notes here; product repositories
link to the central release entry rather than copying release history.

## Layout

```text
releases/
├── index.md
└── <product>/
    └── <version>/
        └── release-notes.md
```

## Products

- audit-tool
- audit-assurance-node
- asset-command-centre
- cmdb-api-data-collection-tool
- switch-exposure-center
- linux-security-lite

## Release Note Requirements

Each release note records:

- Product, version, and release date
- Summary of changes (features, fixes, security)
- Upgrade and rollback notes
- The central docs commit used for the customer bundle
- Links to the [release gates](../validation/release-gates.md) evidence

## Related

- [Validation And Release Gates](../validation/index.md)
- [Release Bundle Structure](../deployment/release-bundle-structure.md)
- [Release Bundle Docs Sync](../release-bundles/README.md)
