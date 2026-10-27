---
title: Pull Requests
description: Fork the framework repository, run the checks, add a changeset, and open a pull request that reviewers can merge.
docType: contributor-guide
---

# Pull Requests

This page describes how a change reaches the `main` branch of the
[connectum](https://github.com/Connectum-Framework/connectum) repository: fork, branch,
local checks, changeset, pull request, review. The commands and checks below belong to
that repository. The [docs](https://github.com/Connectum-Framework/docs) and
[examples](https://github.com/Connectum-Framework/examples) repositories use the same
fork-and-pull-request flow, but they have no changesets and no pull request template,
and their checks differ: the docs repository provides `pnpm docs:validate`,
`pnpm docs:build` and `pnpm docs:validate:built`, and an example brings its own scripts.

Set up the toolchain first with [Development Setup](/en/contributing/development-setup).
Every command here runs from the root of the framework repository.

## Fork and branch

1. Fork `Connectum-Framework/connectum` on GitHub.
2. Clone your fork and add the original repository as `upstream`:

   ```bash
   git clone https://github.com/YOUR_USERNAME/connectum.git
   cd connectum
   git remote add upstream https://github.com/Connectum-Framework/connectum.git
   pnpm install
   ```

3. Create a branch from the current `main`. A short `type/topic` name such as
   `fix/amqp-reconnect` or `docs/auth-guide` is the habit in this repository; no tool
   enforces it.

   ```bash
   git fetch upstream
   git checkout -b fix/my-change upstream/main
   ```

4. Make the change together with its tests, and update the documentation that
   describes it (see [Documentation Style Guide](/en/contributing/documentation-style)).
5. Push the branch to your fork and open a pull request against `main` of the
   upstream repository.

### Keep the fork up to date

Pull requests are squash-merged, so the history of your branch does not survive. Rebase
the branch onto the latest upstream `main` rather than merging `main` into it:

```bash
git fetch upstream
git rebase upstream/main

# After a rebase the branch you already pushed has to be replaced
git push --force-with-lease origin fix/my-change
```

To keep your own `main` current, fast-forward it from `upstream`:

```bash
git checkout main
git merge --ff-only upstream/main
git push origin main
```

## Run the checks before you push

The pull request template asks you to confirm `pnpm build && pnpm typecheck && pnpm test`
and `pnpm lint`. CI covers more than the template: it also runs `pnpm lint:repo`, runs
the unit and integration tests as separate steps, and has separate Bun and esbuild jobs.
Running the commands below locally catches most of what CI would report.

```bash
pnpm build
pnpm typecheck
pnpm test
pnpm lint
pnpm lint:repo
```

- `pnpm build` comes first: in `turbo.json` the `test` tasks (and the per-package
  `typecheck` task) depend on `build`, and CI builds before it type checks. Running
  `pnpm typecheck` on a fresh clone without a build is not the supported order.
- `pnpm test` runs each package's unit and integration suites. Integration suites that
  need a message broker skip themselves when the broker is not configured; see
  [Testing](/en/contributing/testing).
- Linting has two steps. `pnpm lint` runs Biome over each package's `src` directory.
  `pnpm lint:repo` runs Biome over the whole repository (release scripts, fixtures,
  interop helpers) so the same rules bind code that no package owns. CI runs both.
  CI additionally runs `pnpm lint:rules`, which proves that the repository's custom Biome
  rules still fire, and renders the API reference with TypeDoc, where any warning (a
  broken `{@link}`, for instance) fails the job. If you change JSDoc on a public symbol,
  `pnpm docs:api` reproduces that check locally.
- The full command list, including the Bun and esbuild suites (`pnpm test:bun`,
  `pnpm test:esbuild`), is in [CLI Commands](/en/contributing/cli-commands).

### Pre-commit hook

`pnpm install` installs a Git hook through Husky. On every `git commit` it:

1. refuses to continue if a staged file also has unstaged changes (the `MM` status),
2. generates the protobuf sources (`turbo run build:proto`),
3. runs `pnpm run biome`, which is `biome check --write --error-on-warnings .` over the
   whole repository and rewrites formatting and import order in place,
4. re-stages what Biome changed.

Because the hook rewrites files, stage the changes you intend to commit, make sure
`git status` shows no `MM` entries, and review the files Biome rewrote before you push. See [Code Style](/en/contributing/code-style) for what Biome enforces.

## Add a changeset

Versions and changelogs are produced by [Changesets](https://github.com/changesets/changesets),
not edited by hand. Do not edit a package's `CHANGELOG.md`; add a changeset instead:

```bash
pnpm changeset
```

The command asks which packages changed and at which semver level, and writes a file to
`.changeset/`. Commit that file with your change. Add one whenever the change alters what
a published `@connectum/*` package does or exposes: a fix, a feature, or a breaking
change. A change that touches only documentation, CI, or internal tests usually has
nothing to release; if you are unsure, ask in the pull request.

All `@connectum/*` packages belong to one fixed version group (`fixed` in
`.changeset/config.json`), so they are released with the same version number. A breaking
change therefore carries extra weight; the changeset format for it is described in
[Commit Messages](/en/contributing/commit-messages).

## Open the pull request

The repository's
[pull request template](https://github.com/Connectum-Framework/connectum/blob/main/.github/pull_request_template.md)
is filled in automatically when you open the pull request. Its sections are:

| Section | What to write |
|---|---|
| Summary | One to three sentences: what the change does and why. |
| Type of change | Bug fix, new feature, breaking change (with a migration guide entry), or documentation, chore, internal. |
| Test plan | The checks you ran and anything you exercised by hand, such as the affected examples. |
| Parity coverage | Either the `transportParityTest()` scenario you added or extended, or a short justification that the change does not alter observable RPC behavior. |
| Related issues / changes | Links to issues, ADRs, and related pull requests. |

The Parity coverage section is required for any change that touches service-observable RPC
behavior. What that means and which scenarios exist is described in
[Parity Invariant](/en/contributing/parity-invariant) and
[Parity Coverage](/en/contributing/parity-coverage).

Give the pull request a Conventional Commits title. The repository squash-merges, and
the title becomes the commit subject on `main` (see
[Commit Messages](/en/contributing/commit-messages)). Link the issue it resolves with
`Closes #123` in the description.

## Review

Reviewers expect, before a pull request is merged:

- the required CI checks pass;
- at least one maintainer approves;
- every review discussion is resolved, by a change or by an explained decision.

Which checks are required is configured in the repository's GitHub settings and is not
repeated here. Respond to feedback with new commits or a rebase; maintainers merge once
the conditions above are met.

## Related

- [Commit Messages](/en/contributing/commit-messages)
- [Testing](/en/contributing/testing)
- [Code Style](/en/contributing/code-style)
- [CLI Commands](/en/contributing/cli-commands)
