# Homepage walkthroughs

The native code player illustrates a previously executed Greeter example. It
does not run a terminal, protobuf compiler or service in the browser. The
deployment panel illustrates the same handlers grouped into different processes;
it does not redeploy anything.

Vue owns mounting and disposal. Player modules operate only inside their passed
element, with no response injection or separate preview asset server. The
homepage retains its highlighted server example without JavaScript, and the
deployment block server-renders a diagram from the same layout model.

`native.json` keeps code, token colors, timings and captured results together.
Regenerate it with `pnpm homepage:generate`; its sources and request commands
live in `example/`, while `evidence.json` retains the original protocol captures.
`pnpm homepage:test` checks the model, transcript and generation consistency.

To exercise the real HTTP/2 fixture:

```sh
pnpm --dir .vitepress/homepage/example install --frozen-lockfile
pnpm --dir .vitepress/homepage/example generate
pnpm --dir .vitepress/homepage/example typecheck
pnpm --dir .vitepress/homepage/example test
```

The fixture tests Connect, native gRPC and curl against an ephemeral loopback
listener. Package and generator pins stay in manifests and provenance, not in
the homepage's explanatory labels.
