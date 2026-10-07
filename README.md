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

Use Node.js 22, as in this repository's CI, and the pnpm version pinned in
`package.json` (`11.0.4`). Clone the documentation repository and enter its root:

```bash
git clone https://github.com/Connectum-Framework/docs.git
cd docs
pnpm install --frozen-lockfile
pnpm docs:dev
```

If you already cloned the repository, start at `pnpm install` from its root.
Open the local URL printed by VitePress; the default development port is `5173`,
but VitePress may select another port when it is occupied. Stop the server with
Ctrl+C before running the build commands in the same terminal.

## Build

```bash
pnpm docs:validate
pnpm docs:build
pnpm docs:validate:built
pnpm docs:preview
```

Run these commands from the repository root after installing dependencies.
`docs:validate` checks authored pages and links. After a successful build,
`docs:validate:built` checks the generated routes, search index, sitemap, and LLM
outputs. Open the preview URL printed by VitePress and stop it with Ctrl+C.

For an optional executable check of the Quickstart and eight framework README
examples, place the `connectum`, `docs`, and `examples` repositories in sibling
directories. From the framework repository, install and build its packages, then
run its acceptance script:

```bash
cd ../connectum
pnpm install --frozen-lockfile
pnpm build
pnpm docs:check --docs ../docs --examples ../examples
```

This check runs the selected examples against packed local packages and checks
their responses. It requires network access for dependencies and Buf imports;
it does not verify every claim or snippet in the documentation.

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
