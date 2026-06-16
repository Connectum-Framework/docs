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

> Minimalist framework for building production-ready gRPC/ConnectRPC microservices on Node.js 22.13+

**Modular packages** across dependency layers

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
│   └── config/          # Config modules (en, shared)
├── en/                  # English documentation (primary)
│   ├── index.md         # Landing page
│   ├── guide/           # User guide (progressive)
│   │   └── production/  # Production deployment
│   ├── packages/        # Per-package guides
│   ├── api/             # Auto-generated API Reference (TypeDoc)
│   ├── migration/       # Migration & changelog
│   └── contributing/    # Contributing (ADR, architecture)
├── public/              # Static assets (assets/, CNAME, robots.txt)
└── package.json         # VitePress dependency
```

## Links

- [Main Repository](https://github.com/Connectum-Framework/connectum) -- Framework source code
- [Examples](https://github.com/Connectum-Framework/examples) -- Usage examples
