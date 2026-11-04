<p align="center">
<a href="https://connectum.dev">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://connectum.dev/assets/splash-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://connectum.dev/assets/splash.png">
  <img alt="Connectum — Proto-first gRPC/ConnectRPC framework for TypeScript" src="https://connectum.dev/assets/splash.png" width="600">
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

Navigation and compatibility routes have their own checks:

```bash
pnpm guide:test
pnpm navigation:typecheck
pnpm docs:routes:check
```

When changing a compatibility destination, update `.vitepress/data/site.json`
and run `pnpm docs:routes`. Keep the canonical article in Guides; the generated
transition page preserves links without maintaining another copy of its prose.

The runnable unit and integration examples are checked against the built
framework revision recorded by the scaffold generator:

```bash
pnpm --dir .vitepress/catalog/example install --frozen-lockfile
CONNECTUM_FRAMEWORK_ROOT=../connectum pnpm testing-guides:verify
```

This check generates a default scaffold, links its dependencies to that target,
runs protobuf generation, typechecks, then executes the exact TypeScript
snippets from the Testing guides. It uses a temporary local gRPC listener and
does not require a broker or change the application's lockfile.

After changing navigation, check the links already published in every framework
package README against the built site, including fragments:

```bash
pnpm docs:check:package-readmes --framework-root ../connectum
```

The check also resolves relative files and requests external URLs, so it needs
network access. It writes `.tmp/package-readme-links.json` and fails on unresolved
targets. After deployment, repeat with `--site-url https://connectum.dev` to
check the served pages as well. Preserve published links through compatibility
routes rather than requiring a package release just to replace a URL.

For browser regressions, point `PLAYWRIGHT_MODULE` to an installed Playwright
`index.mjs` and use an already running preview. These checks use Chrome and
start no server; the accepted-demo check also needs `unzip` to inspect the
project downloaded by Builder.

```bash
node scripts/check-navigation-browser.mjs --url http://127.0.0.1:4185 --output .tmp/navigation-browser
node scripts/check-quickstart-browser.mjs --url http://127.0.0.1:4185 --output .tmp/quickstart-browser
node scripts/check-accepted-demos-browser.mjs --url http://127.0.0.1:4185 --output .tmp/accepted-demos-browser
```

The checks save screenshots, accessibility snapshots and JSON reports. Inspect
the screenshots alongside the assertions before accepting a navigation change.

## Check code examples

The framework repository runs the examples from this site and from its package
READMEs as an isolated consumer of the packed packages. With the framework,
documentation, and examples repositories checked out side by side, run from the
framework root after `pnpm build`:

```bash
pnpm docs:check --docs ../docs --examples ../examples
```

The check needs network access, installs its consumer projects at run time, and
is not part of CI.

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
│   ├── packages/        # Compatibility routes into canonical Guides
│   ├── api/             # Auto-generated API Reference (TypeDoc)
│   ├── reference/       # Compatibility routes into Guides and generated API
│   ├── migration/       # Migration & changelog
│   └── contributing/    # Contributor guides and ADRs
├── public/              # Static assets (assets/, CNAME, robots.txt)
└── package.json         # VitePress dependency
```

## Links

- [Main Repository](https://github.com/Connectum-Framework/connectum) -- Framework source code
- [Examples](https://github.com/Connectum-Framework/examples) -- Usage examples
