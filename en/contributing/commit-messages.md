---
title: Commit Messages
description: The Conventional Commits format used in the Connectum repositories, the scopes in use, and how to mark a breaking change.
docType: contributor-guide
---

# Commit Messages

The Connectum repositories follow [Conventional Commits](https://www.conventionalcommits.org/).
This is the project convention that reviewers expect; it is not enforced by a tool
(see [What is and is not enforced](#what-is-and-is-not-enforced)).

## Format

```text
<type>(<scope>): <description>

[optional body]
```

- `<description>` is a short imperative or descriptive phrase that says what changes for
  the user of the code, not which files moved.
- The body explains why, and what a reviewer cannot read off the diff.
- The pull request title follows the same format, because pull requests are
  squash-merged and the title becomes the subject of the commit on `main`. The merge
  appends the pull request number, as in
  `fix(interceptors): answer a streaming call with a streaming response in the fallback (#466)`.

## Types

The types that appear in the history of the framework repository are:

| Type | Use for |
|---|---|
| `feat` | A new capability |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `test` | Adding or changing tests |
| `ci` | CI workflow and release automation changes |
| `chore` | Maintenance that fits no other type, such as dependency bumps |
| `refactor` | A code change that neither fixes a bug nor adds a capability |
| `build` | Build system changes |
| `style` | Formatting-only changes |

`perf` is also valid in the Conventional Commits vocabulary, although the history of
the framework repository does not contain it yet.

## Scopes

The scope is the directory name of the package the change belongs to:

`core`, `auth`, `interceptors`, `healthcheck`, `reflection`, `otel`, `cli`, `events`,
`events-nats`, `events-kafka`, `events-redis`, `events-amqp`, `protoc-gen-catalog`,
`testing`, `test-fixtures`.

Three scopes are used for changes that belong to no single package: `deps` for
dependency updates, `ci` for workflows, and `docs` for documentation. There is no
restricted list; `commitlint.config.js` only extends `@commitlint/config-conventional`.
Pick the package that the change is about. When a change spans packages, name the main
one, or leave the scope out.

Examples taken from the history:

```text
feat(auth)!: validate auth configuration and reject unsafe identities (#391)
fix(interceptors): answer a streaming call with a streaming response in the fallback (#466)
test(cli): use a port nobody can bind for the "nobody listens" proto sync case (#464)
chore(deps): bump the development group with 2 updates (#474)
```

## Breaking changes

Mark a breaking change with an exclamation mark before the colon, `type(scope)!:`:

```text
feat(interceptors)!: validate the numeric and per-key options of the resilience interceptors (#395)
fix(otel)!: leave the span status unset on success (#390)
```

A breaking change needs two more things in the same pull request:

1. A [changeset](/en/contributing/pull-requests) whose first line is a `type!:`
   subject, that states **BREAKING** and who is affected, and that gives a
   **Migration** note: what to change, or which option restores the previous behavior.
2. An entry in the [migration guide](/en/migration/) when users must act.

A changeset in this format looks like this (abridged from a changeset in the
repository):

````md
---
"@connectum/interceptors": minor
---

feat!: the logger interceptor no longer logs request and response bodies unless `includeBodies: true` is set

**BREAKING.** `createLoggerInterceptor` used to hand the request and response message of
every call to the log sink. Bodies carry credentials, tokens and personal data, so they
are now off by default.

To get the previous output, set the new option:

```typescript
createLoggerInterceptor({ includeBodies: true });
```
````

Note the `minor` level. All `@connectum/*` packages are one fixed version group, and the
changesets in the repository ship breaking changes as `minor` on purpose: a `major`
bump in a fixed group would release every package as the next major version. Write the
**BREAKING** and **Migration** text so that a reader does not need the `major` signal.

## What is and is not enforced

- `commitlint.config.js` extends `@commitlint/config-conventional`, and the package is a
  development dependency, so you can check a message by hand with
  `echo "feat(core): message" | pnpm exec commitlint`.
- The `commit-msg` Git hook that would run commitlint is commented out in
  `.husky/commit-msg`, and no CI job checks messages. A message that does not follow the
  format will be accepted by Git and by CI; a reviewer will ask you to fix the pull
  request title.
- Only the pull request title matters for `main`: the repository squash-merges, so your
  intermediate commit messages are not kept. Write them clearly anyway; they are what a
  reviewer reads commit by commit.

## Related

- [Pull Requests](/en/contributing/pull-requests)
- [Code Style](/en/contributing/code-style)
