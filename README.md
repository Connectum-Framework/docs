<p align="center">
<a href="https://connectum.dev">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://connectum.dev/assets/splash-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://connectum.dev/assets/splash.png">
  <img alt="Connectum — Microservices Framework" src="https://connectum.dev/assets/splash.png" width="600">
</picture>
</a>
</p>

# Connectum Documentation

English VitePress documentation for Connectum. The site source lives in `en/`; the API
reference under `en/api/` is generated from the framework repository's JSDoc.

## Development

```bash
cd docs
pnpm install
pnpm docs:dev
```

The local site opens at `http://localhost:5173`.

## Build

```bash
pnpm docs:build
pnpm docs:preview
```

Check authored pages and links with `pnpm docs:validate`. After a successful build,
`pnpm docs:validate:built` checks the generated routes, search index, sitemap, and LLM
outputs.

## Structure

```
docs/
├── .vitepress/          # VitePress configuration
│   ├── config.ts        # Main config with i18n
│   └── config/          # Config modules (en, shared)
├── en/                  # English documentation (primary)
│   ├── index.md         # Landing page
│   ├── guide/           # User guide (progressive)
│   │   └── production/  # Production deployment
│   ├── packages/        # Per-package guides
│   ├── api/             # Auto-generated API Reference (TypeDoc)
│   ├── migration/       # Migration & changelog
│   └── contributing/    # Contributor guides and ADRs
├── public/              # Static assets (assets/, CNAME, robots.txt)
└── package.json         # VitePress dependency
```

## Links

- [Main Repository](https://github.com/Connectum-Framework/connectum) -- Framework source code
- [Examples](https://github.com/Connectum-Framework/examples) -- Usage examples
