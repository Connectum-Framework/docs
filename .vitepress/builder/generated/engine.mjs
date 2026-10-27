// SPDX-License-Identifier: Apache-2.0
// Generated from Connectum CLI f1456162e51a1f225f8f0d8c2fb7653eb1181aca; update with builder:update, not by hand.
var g="node_modules/@connectum/auth/proto",p="proto/greeter/v1/greeter.proto";function f(t){let r=c=>new Error(`connectum init: could not annotate ${p} for the auth module \u2014 ${c} was not found in the fetched base. Re-run without --auth, or open an issue: the base example and the CLI have drifted.`),e=t.split(`
`),n="rpc SayHello(SayHelloRequest) returns (SayHelloResponse) {}",o=e.findIndex(c=>c.trimStart()===n);if(o===-1)throw r("the expected `rpc SayHello` declaration");let s=e[o]??"",i=s.slice(0,s.length-s.trimStart().length);e.splice(o,1,`${i}// Public: skips authentication and authorization, so the sample call works`,`${i}// out of the box. Remove this option to require a JWT (as SayGoodbye does).`,`${i}rpc SayHello(SayHelloRequest) returns (SayHelloResponse) {`,`${i}  option (connectum.auth.v1.method_auth) = { public: true };`,`${i}}`);let a=e.findIndex(c=>c.startsWith("package ")&&c.trimEnd().endsWith(";"));if(a===-1)throw r("the `package` declaration");return e.splice(a+1,0,"",'import "connectum/auth/v1/options.proto";'),e.join(`
`)}function h(){return`/**
 * Authentication (JWT via JWKS) + authorization (driven by proto \`(connectum.auth.v1.*)\`
 * annotations). Configure via env: JWKS_URI, JWT_ISSUER, JWT_AUDIENCE.
 *
 * @module auth
 */

import { createJwtAuthInterceptor } from "@connectum/auth";
import { createProtoAuthzInterceptor, getPublicMethods } from "@connectum/auth/proto";
import type { Interceptor } from "@connectrpc/connect";
import { GreeterService } from "#gen/greeter/v1/greeter_pb.ts";

// Methods annotated \`(connectum.auth.v1.method_auth) = { public: true }\` in your proto
// are read here and skipped by the JWT interceptor. Add your services to this list.
const publicMethods = getPublicMethods([GreeterService]);

/**
 * Build the auth interceptor chain: JWT authentication followed by proto-driven
 * authorization (deny-by-default \u2014 annotate methods/services to allow).
 */
export function buildAuthInterceptors(): Interceptor[] {
    const jwtAuth = createJwtAuthInterceptor({
        jwksUri: process.env.JWKS_URI ?? "http://localhost:8080/.well-known/jwks.json",
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        algorithms: ["RS256"],
        skipMethods: [...publicMethods, "grpc.health.v1.Health/*", "grpc.reflection.v1.ServerReflection/*"],
    });
    const authz = createProtoAuthzInterceptor();
    return [jwtAuth, authz];
}
`}var v={nats:{pkg:"@connectum/events-nats",importName:"NatsAdapter",ctor:()=>'NatsAdapter({ servers: process.env.NATS_SERVERS ?? "nats://localhost:4222" })'},kafka:{pkg:"@connectum/events-kafka",importName:"KafkaAdapter",ctor:t=>`KafkaAdapter({ brokers: (process.env.KAFKA_BROKERS ?? "localhost:9092").split(","), clientId: ${JSON.stringify(t)} })`},redpanda:{pkg:"@connectum/events-kafka",importName:"KafkaAdapter",ctor:t=>`KafkaAdapter({ brokers: (process.env.REDPANDA_BROKERS ?? "localhost:9092").split(","), clientId: ${JSON.stringify(t)} })`},redis:{pkg:"@connectum/events-redis",importName:"RedisAdapter",ctor:()=>'RedisAdapter({ url: process.env.REDIS_URL ?? "redis://localhost:6379" })'},amqp:{pkg:"@connectum/events-amqp",importName:"AmqpAdapter",ctor:t=>`AmqpAdapter({ url: process.env.AMQP_URL ?? "amqp://localhost:5672", exchange: ${JSON.stringify(t)} })`}};function b(t){return v[t].pkg}var S="proto/connectum/events/v1/options.proto";function y(){return`syntax = "proto2";

package connectum.events.v1;

import "google/protobuf/descriptor.proto";

// Method-level topic override for event handlers.
message EventOptions {
  // Custom topic name; defaults to the input message's typeName when unset.
  optional string topic = 1;
}

extend google.protobuf.MethodOptions {
  optional EventOptions event = 50102;
}
`}function E(){return`syntax = "proto3";

package greeter.v1;

import "google/protobuf/empty.proto";
import "connectum/events/v1/options.proto";

// A demo event. Replace with your own event messages.
message GreetingSent {
  string name = 1;
  string message = 2;
}

// Event-handler service: one rpc per subscribed event, each returning Empty.
service GreeterEventHandlers {
  rpc OnGreetingSent(GreetingSent) returns (google.protobuf.Empty) {
    option (connectum.events.v1.event).topic = "greeter.greeting-sent";
  }
}
`}function x(t,r){let e=v[r];return`import { createEventBus } from "@connectum/events";
import { ${e.importName} } from "${e.pkg}";
import { greeterEventRoutes } from "./services/greeterEvents.ts";

export const greeterEventBus = createEventBus({
    adapter: ${e.ctor(t.name)},
    routes: [greeterEventRoutes],
    group: ${JSON.stringify(t.name)},
    middleware: { retry: { maxRetries: 3, backoff: "exponential" } },
});
`}function R(t){return`/**
 * Smoke test for the event wiring: the EventRoute registers on an in-memory bus and
 * the bus start/stop lifecycle works \u2014 no external broker required.
 */

import assert from "node:assert/strict";
${t==="bun"?'import { describe, it } from "bun:test";':'import { describe, it } from "node:test";'}
import { createEventBus, MemoryAdapter } from "@connectum/events";
import { greeterEventRoutes } from "#services/greeterEvents.ts";

describe("greeter events", () => {
    it("registers handlers on an in-memory bus and starts/stops cleanly", async () => {
        const bus = createEventBus({ adapter: MemoryAdapter(), routes: [greeterEventRoutes], group: "test" });
        await bus.start();
        await bus.stop();
        assert.ok(true);
    });
});
`}function k(){return`import type { EventRoute } from "@connectum/events";
import { GreeterEventHandlers } from "#gen/greeter/v1/events_pb.ts";

export const greeterEventRoutes: EventRoute = (events) => {
    events.service(GreeterEventHandlers, {
        async onGreetingSent(_event, ctx) {
            // TODO: handle the GreetingSent event (topic: greeter.greeting-sent).
            // Deliberately no logging of the event body: payloads can carry user data,
            // so add logging with your own redaction policy.
            await ctx.ack();
        },
    });
};
`}function A(t){let r=["  - path: proto"];t.modules.auth&&r.push(`  - path: ${g}`);let e=new Set;t.modules.events&&(e.add("SERVICE_SUFFIX"),e.add("RPC_REQUEST_STANDARD_NAME"),e.add("RPC_RESPONSE_STANDARD_NAME"),e.add("RPC_REQUEST_RESPONSE_UNIQUE"));let n=e.size>0?`
  except:
${[...e].map(o=>`    - ${o}`).join(`
`)}`:"";return`version: v2
modules:
${r.join(`
`)}
lint:
  use:
    - STANDARD${n}
breaking:
  use:
    - FILE
`}function H(t){let r=[];return t.modules.auth&&r.push({protoDir:"connectum/auth/v1/",pkg:"@connectum/auth"}),t.modules.events&&r.push({protoDir:"connectum/events/v1/",pkg:"@connectum/events"}),r}function $(t){let r=t.modules.catalog?`
  - local: protoc-gen-connectum-catalog
    strategy: all
    out: gen
    opt:
      - target=ts
      - import_extension=.ts`:"",e=H(t),o=e.length===0?"":`inputs:
  - directory: proto${t.modules.events?`
    exclude_paths:
      - proto/connectum/events/v1`:""}
`,s=e.map(({protoDir:i,pkg:a})=>`
      - map_imports=${i}:${a}/gen`).join("");return`version: v2
clean: true
${o}plugins:
  - local: protoc-gen-es
    out: gen
    opt:
      - target=ts
      - import_extension=.ts
      - erasable_syntax=true${s}${r}
`}function l(t,r){let e=[];r&&e.push("errorHandler: false");for(let n of t.modules.resilience??[])e.push(`${n}: true`);return e.length>0?`createDefaultInterceptors({ ${e.join(", ")} })`:"createDefaultInterceptors()"}function U(t){let r=t.modules.otel===!0,e=t.modules.auth===!0,n=[],o=[];return r&&(n.push('import { createOtelInterceptor } from "@connectum/otel";'),o.push("createOtelInterceptor({ trustRemote: false })")),e?(n.push('import { createDefaultInterceptors, createErrorHandlerInterceptor } from "@connectum/interceptors";'),n.push('import { buildAuthInterceptors } from "#auth.ts";'),o.push("createErrorHandlerInterceptor()","...buildAuthInterceptors()",`...${l(t,!0)}`),{imports:n,expr:`[${o.join(", ")}]`}):(n.push('import { createDefaultInterceptors } from "@connectum/interceptors";'),o.length>0?(o.push(`...${l(t,!1)}`),{imports:n,expr:`[${o.join(", ")}]`}):{imports:n,expr:l(t,!1)})}function J(t){let r=[],e=[];return t.modules.healthcheck!==!1&&(r.push('import { Healthcheck } from "@connectum/healthcheck";'),e.push("Healthcheck({ httpEnabled: true })")),t.modules.reflection!==!1&&(r.push('import { Reflection } from "@connectum/reflection";'),e.push("Reflection()")),{imports:r,expr:`[${e.join(", ")}]`}}function w(t){let{imports:r,expr:e}=U(t),{imports:n,expr:o}=J(t),s=t.modules.events!==void 0,i=t.modules.catalog===!0,a=t.sample,c=['import { createServer } from "@connectum/core";','import type { Server } from "@connectum/core";',...n,...r,...i?['import { serviceCatalog } from "#gen/catalog.gen.ts";']:[],...s?['import { greeterEventBus } from "#greeterEventBus.ts";']:[],...a?['import { greeterService } from "#services/greeterService.ts";']:[]],j=a?"GreeterService":"the services you register",B=a?"[greeterService]":"[]",F=s?`
        eventBus: greeterEventBus,`:"",G=i?`
        catalog: serviceCatalog,`:"";return`/**
 * Server factory \u2014 services, health, reflection, interceptors, graceful shutdown.
 *
 * @module server
 */

${c.join(`
`)}

/**
 * Build a Connectum server hosting ${j}.
 *
 * @param port - TCP port to bind (0 = random, for tests).
 * @param autoShutdown - install SIGTERM/SIGINT graceful-shutdown handlers.
 */
export function buildServer(port = 5000, autoShutdown = false): Server {
    return createServer({
        services: ${B},${G}${F}
        port,
        host: "0.0.0.0",
        allowHTTP1: false,
        protocols: ${o},
        interceptors: ${e},
        shutdown: { autoShutdown, timeout: 10_000 },
    });
}
`}function O(t){let r=t.modules.otel===!0,e=t.modules.healthcheck!==!1,n=[...e?['import { healthcheckManager, ServingStatus } from "@connectum/healthcheck";']:[],...r?['import { initProvider, shutdownProvider } from "@connectum/otel";']:[],'import { buildServer } from "#server.ts";'],o=r?`
initProvider({ serviceName: ${JSON.stringify(t.name)} });
`:"",s=`${JSON.stringify(`${t.name} ready on `)} + `,i=e?`    healthcheckManager.update(ServingStatus.SERVING);
`:"",a=r?`server.on("stop", async () => {
    await shutdownProvider();
    console.log("stopped");
});`:'server.on("stop", () => console.log("stopped"));';return`/**
 * Start the server.
 *
 * @module index
 */

${n.join(`
`)}
${o}
const server = buildServer(Number(process.env.PORT ?? 5000), true);

server.on("ready", () => {
    const addr = server.address;
${i}    console.log(${s}\`\${addr?.address}:\${addr?.port}\`);
});

${a}
server.on("error", (err) => {
    console.error("server error:", err);
    process.exitCode = 1;
});

await server.start();
`}function P(t){return t==="raw"?">=25.2.0":">=22.13.0"}var _="2.16.0",L=[{section:"dependencies",name:"@bufbuild/protobuf",version:_},{section:"devDependencies",name:"@bufbuild/protoc-gen-es",version:_}];function d(t){let r=/^(\d+)\.(\d+)\.(\d+)$/.exec(t);if(r!==null)return[Number(r[1]),Number(r[2]),Number(r[3])]}function I(t,r){for(let e=0;e<3;e++){let n=(t[e]??0)-(r[e]??0);if(n!==0)return n}return 0}function V(t,r){let e=d(r);if(e===void 0)throw new Error(`versionFloors: "${r}" is not a major.minor.patch version`);let n=t===void 0?void 0:d(t.replace(/^[\^~]/,""));return n!==void 0&&I(n,e)>=0}function m(t,r){let e={...r};for(let n of L)n.section===t&&!V(e[n.name],n.version)&&(e[n.name]=`^${n.version}`);return e}var u={scope:"@connectum/",version:"1.3.0",triggers:["@connectum/auth","@connectum/events"]};function N(t){return u.triggers.some(r=>r in t)}function C(t){let r=d(u.version);if(r===void 0)throw new Error(`versionFloors: "${u.version}" is not a major.minor.patch version`);for(let[e,n]of[...Object.entries(t.dependencies??{}),...Object.entries(t.devDependencies??{})]){if(!e.startsWith(u.scope))continue;let o=d(n.replace(/^[\^~]/,""));o!==void 0&&I(o,r)>0&&(r=o)}return`^${r.join(".")}`}function T(t,r){return Object.fromEntries(Object.entries(t).map(([e,n])=>[e,e.startsWith(u.scope)?r:n]))}function M(t){return Object.fromEntries(Object.entries(t).sort(([r],[e])=>r<e?-1:1))}var W=new Set(["pnpm-workspace.yaml",".pnpmfile.cjs"]),D="tests/e2e/e2e.test.ts";function q(t){let r={"buf:generate":"buf generate","buf:lint":"buf lint","build:proto":"buf generate",typecheck:"buf generate && tsc --noEmit"};if(t.runtime==="bun")return{...r,start:"buf generate && bun src/index.ts",dev:"bun --watch src/index.ts",test:"buf generate && bun test tests/"};let e=t.nodeExec==="tsx"?"buf generate && tsx src/index.ts":"buf generate && node src/index.ts",n=t.nodeExec==="tsx"?"tsx watch src/index.ts":"node --watch src/index.ts",o=t.nodeExec==="tsx"?"buf generate && node --import tsx --test tests/**/*.test.ts":"buf generate && node --test tests/**/*.test.ts";return{...r,start:e,dev:n,test:o}}function K(t,r,e){let n=["@bufbuild/buf","@bufbuild/protoc-gen-es","@types/node","typescript"],o={};for(let s of n)t[s]&&(o[s]=t[s]);return o["@connectum/testing"]=e,r.modules.catalog&&(o["@connectum/protoc-gen-catalog"]=e),r.runtime==="node"&&r.nodeExec==="tsx"&&(o.tsx=t.tsx??"^4.21.0"),r.runtime==="bun"&&(o["@types/bun"]=t["@types/bun"]??"^1.3.6"),M(m("devDependencies",o))}function z(t,r){let e=JSON.parse(t);e.name=r.name,delete e.private,e.description=`A Connectum gRPC/ConnectRPC service (${r.name})`,e.engines=r.runtime==="bun"?{node:">=22.13.0"}:{node:P(r.nodeExec)};let n=e.dependencies?.["@connectum/core"]??"^1.0.0",o={};r.modules.otel&&(o["@connectum/otel"]=n),r.modules.events&&(o["@connectum/events"]=n,o[b(r.modules.events.adapter)]=n),r.modules.auth&&(o["@connectum/auth"]=n);let s={...e.dependencies??{},...o},i=N(s),a=i?C(e):n;return i&&(s=T(s,a)),e.dependencies=M(m("dependencies",s)),e.scripts=q(r),e.devDependencies=K(e.devDependencies??{},r,a),`${JSON.stringify(e,null,2)}
`}function Y(t){let r=t.runtime==="bun"?'import { describe, it } from "bun:test";':'import { describe, it } from "node:test";',e=t.modules.auth===!0?`    it("sayGoodbye requires authentication", async () => {
        await assert.rejects(
            () => client.sayGoodbye({ name: "Ada" }),
            (err: Error) => err.message.includes("unauthenticated"),
        );
    });`:`    it("sayGoodbye returns a farewell", async () => {
        const res = await client.sayGoodbye({ name: "Ada" });
        assert.equal(res.message, "Goodbye, Ada!");
    });`,n=t.modules.auth===!0?"sayHello is public and returns a greeting":"sayHello returns a greeting";return`/**
 * End-to-end test for the sample Greeter service.
 *
 * Exercises the REAL composition root (\`buildServer\`) \u2014 the same services, interceptor
 * chain and protocols the process entry starts \u2014 so a module that breaks the chain fails
 * here instead of shipping. Uses @connectum/testing's in-process \`createLocalClient\`:
 * no socket is opened, so the same test runs identically on Node and Bun.
 */

import assert from "node:assert/strict";
${r}
import { createLocalClient } from "@connectum/testing";
import { GreeterService } from "#gen/greeter/v1/greeter_pb.ts";
import { buildServer } from "#server.ts";

describe("GreeterService", () => {
    // Port 0: never bound \u2014 the in-process client bypasses the network entirely.
    const server = buildServer(0);
    const client = createLocalClient(server, GreeterService);

    it("${n}", async () => {
        const res = await client.sayHello({ name: "Ada" });
        assert.equal(res.message, "Hello, Ada!");
    });

${e}
});
`}var Q="tests/e2e/server.test.ts";function X(t){return t.startsWith("proto/greeter/")||t==="src/services/greeterService.ts"}function Z(t){return`/**
 * Smoke test for the composition root.
 *
 * Builds the real server (\`buildServer\`) with the configured interceptors and
 * protocols and checks it is constructed without being started. Add a test per service
 * once you have generated one with \`connectum generate service <name>\`.
 */

import assert from "node:assert/strict";
${t.runtime==="bun"?'import { describe, it } from "bun:test";':'import { describe, it } from "node:test";'}
import { buildServer } from "#server.ts";

describe("server", () => {
    it("is built from the composition root and not started", () => {
        // Port 0: the server is never started, so nothing is bound.
        const server = buildServer(0);
        assert.equal(server.state, "created");
    });
});
`}function ee(t,r){let e=new Map;for(let[n,o]of t)if(!W.has(n)&&!(!r.sample&&X(n))&&n!=="README.md"&&n!==D&&!(n==="src/server.ts"||n==="src/index.ts")&&!(n==="buf.yaml"||n==="buf.gen.yaml")){if(n==="package.json"){e.set(n,z(o,r));continue}e.set(n,o)}if(e.set("src/server.ts",w(r)),e.set("src/index.ts",O(r)),e.set("buf.yaml",A(r)),e.set("buf.gen.yaml",$(r)),r.sample?e.set(D,Y(r)):e.set(Q,Z(r)),e.set("README.md",re(r)),r.modules.auth){e.set("src/auth.ts",h());let n=e.get(p);if(n===void 0)throw new Error(`connectum init: the fetched base does not contain ${p}, which the auth module needs to annotate.`);e.set(p,f(n))}return r.modules.events&&(e.set(S,y()),e.set("proto/greeter/v1/events.proto",E()),e.set("src/greeterEventBus.ts",x(r,r.modules.events.adapter)),e.set("src/services/greeterEvents.ts",k()),e.set("tests/e2e/events.test.ts",R(r.runtime))),r.packageManager==="pnpm"&&e.set("pnpm-workspace.yaml",te),e}var te=`allowBuilds:
  '@bufbuild/buf': true
  esbuild: true
  protobufjs: false
`;function re(t){let r=t.packageManager,e=i=>`${r} run ${i}`,n=t.runtime==="bun"?"Runs on **Bun**.":t.nodeExec==="tsx"?"Runs on **Node.js >= 22.13.0** via `tsx`.":"Runs on **Node.js >= 25.2.0** (native TypeScript execution).",o=t.sample?`${r} install
${e("start")}`:`${r} install
npx @connectum/cli generate service <name>   # buf needs at least one proto file
${e("start")}`,s=t.sample?"Replace the sample `Greeter` service under `proto/` and `src/services/` with your\nown contract, then run `buf generate`.\n\nA service added with `connectum generate service <name>` starts as a stub: its handler throws\n`Unimplemented` until you replace the `throw` with your logic.":"This project has no service yet. Run `connectum generate service <name>` to create\nthe proto contract and the handler module, then register the service in\n`src/server.ts` as the command prints.\n\nThe generated handler is a stub: it throws `Unimplemented` until you replace the `throw`\nwith your logic.";return`# ${t.name}

A Connectum gRPC/ConnectRPC service scaffolded with \`connectum init\`.

${n}

## Getting started

\`\`\`bash
${o}
\`\`\`

\`buf generate\` runs automatically before \`start\`, \`test\`, and \`typecheck\`, so the
generated code under \`gen/\` is always up to date.

## Commands

- \`${e("start")}\` \u2014 start the server
- \`${e("dev")}\` \u2014 start in watch mode
- \`${e("test")}\` \u2014 run tests
- \`${e("typecheck")}\` \u2014 type-check
- \`${e("buf:lint")}\` \u2014 lint proto files

## Next steps

${s}
`}export{ee as transformBase};
