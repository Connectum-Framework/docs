# Connectum Documentation

> Minimalist framework for building production-ready gRPC/ConnectRPC microservices on Node.js 25+

**Current version**: v1.0.0-beta.2 | **8 packages** across 4 layers

## Documentation Site

This directory contains the VitePress documentation for the Connectum framework.

### Development

```bash
cd docs
pnpm install
pnpm docs:dev
```

The documentation site will be available at `http://localhost:5173`.

### Build

```bash
pnpm docs:build
pnpm docs:preview
```

## Structure

```
docs/
├── .vitepress/          # VitePress configuration
│   ├── config.ts        # Main config with i18n
│   └── config/          # Locale configs (en, ru)
├── en/                  # English documentation (primary)
│   ├── index.md         # Landing page
│   ├── guide/           # User guide (progressive)
│   ├── packages/        # Per-package API docs
│   ├── production/      # Production deployment
│   ├── migration/       # Migration & changelog
│   └── contributing/    # Contributing (ADR, architecture)
├── ru/                  # Russian locale (stub)
├── assets/              # Images, diagrams
└── package.json         # VitePress dependency
```

## Links

- [Main Repository](https://github.com/Connectum-Framework/connectum) -- Framework source code
- [Examples](https://github.com/Connectum-Framework/examples) -- Usage examples
