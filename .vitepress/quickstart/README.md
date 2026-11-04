# Quickstart example

`project.ts` applies the checked-in CLI transform to its pinned base, then adds
the Page contract, handwritten handler and registration.
It leaves the original Greeter service intact. `init` does not generate these
additions, a login service or OpenAPI.

The final step emulates a request/response exchange. It never executes a shell
or sends RPCs from the browser. Selecting curl/grpcurl or different credentials
clears the response. Playback types the selected command, sends the emulated
request and reveals the captured protocol result; Send request can run it
immediately. Reduced motion keeps the manual Send request action.
Steps 1–4 show no response panel. The final Inspect step owns all calls. The
Handler step displays the complete server setup rather than isolated registration
lines. The gRPC captures use the native protocol client;
the grpcurl command is the equivalent reflection-based request syntax.

The five steps have Play/Pause/Replay controls. A user-selected step animates
its code using the landing player's timing helpers; it never advances to the
next step by itself. Terminal text is typed and source lines are revealed in
groups. Init ends with a source tree derived from the actual CLI scaffold, before
the handwritten Page files. Generate opens and reveals the generated descriptor;
Handler opens and types the issuer/start configuration after its source files.
Native highlighting, full-text copying and the no-JS source remain
intact. Motion pauses outside the viewport or in a hidden tab, stops on unmount,
and is disabled for prefers-reduced-motion.

## Reproduce

Use Node.js 26 and a built framework checkout at the commit in
`../builder/generated/provenance.json`. From this repository:

```bash
pnpm quickstart:generate
CONNECTUM_FRAMEWORK_ROOT=/path/to/connectum pnpm quickstart:verify
pnpm quickstart:openapi
pnpm quickstart:test
pnpm quickstart:typecheck
```

The verifier checks the framework commit and tracked package changes, refuses
stale dependency links, runs Buf and TypeScript, and starts the real generated
process entry. Temporary RSA keys and a loopback JWKS endpoint belong to the
verification helper. They are never embedded in the page or recording.

The capture checks an exact successful response through Connect HTTP/2, gRPC and
the displayed curl script; missing and invalid JWTs on both wire protocols; gRPC health; reflection;
and a console-exported RPC span. It stops the application and JWKS server before
returning. Raw process output stays in the ignored `example/verification.log`.

`runtime-provenance.json` binds the recording and generated Page descriptor to
the project sources and framework commit. OpenAPI uses the pinned remote Buf
plugin plus that checkout's authorization reader, with its own input and output
hashes. `info.version` names this example API, independently of the framework.

## Authentication boundary

The Page proto uses `requires: {}`. Its handler returns content after the auth
chain accepts the caller. The released CLI already opens enabled health and
reflection protocols in both JWT authentication and proto authorization,
including reflection v1 and v1alpha. Quickstart preserves that generated auth
file unchanged; the complete setup disclosure shows the allow rule. Application
methods still need their own annotations and credentials.

For a manual run, configure your issuer and provide its JWT as `TOKEN`. The
console exporter avoids requiring a telemetry backend. OpenAPI generation is
separate from `init`; see the [OpenAPI guide](/en/guide/openapi) for the full
generation and authorization-overlay workflow.

Generated application and intermediate OpenAPI directories are ignored in
`.gitignore`. A clean checkout can build the site using the tracked recordings,
descriptors and OpenAPI document; verification first generates the application.

## Browser checks

With the built site already served, use an installed Playwright module and Chrome:

```bash
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/check-quickstart-browser.mjs \
  --url http://127.0.0.1:4185 --output .playwright-cli/quickstart
```

The check starts no server. It records the accessibility tree, screenshots,
explicit sends for all client/credential combinations, response resets, native
clipboard results, keyboard activation, single code-scroll ownership, no-JS
disclosures and SPA remount behavior. The 768px viewport retains the site's
existing 895px document-width baseline; other widths must fit the viewport.
