---
title: Authorize access to individual resources
description: Require permission on the objects named in an RPC request, and connect the check to your authorization engine.
docType: how-to
outline: deep
---

# Authorize access to individual resources

A caller may have permission to invoke `MoveDocument` and still lack permission to move a particular document into a particular folder. The method-level `authorize` callback receives the caller and the RPC's service and method names. To decide using IDs in the decoded request, declare `resources` on the RPC and give `createProtoAuthzInterceptor` an authorizer that checks those objects.

::: warning Server compatibility
Use `@connectum/auth` 1.4.0 or later on every server that serves this contract. A 1.3 server skips the object check. Its other authorization rules still decide whether to allow or deny the call. A server using only `createAuthzInterceptor` also skips proto resource rules.
:::

## Declare the resource rules

The first rule below checks whether the caller may move the document. The second checks whether the caller may add it to the destination, which can be a folder or a workspace.

```protobuf
syntax = "proto3";
package documents.v1;

import "connectum/auth/v1/options.proto";
import "google/protobuf/empty.proto";

message Destination {
  string kind = 1;
  string id = 2;
}

message MoveDocumentRequest {
  string document_id = 1;
  Destination destination = 2;
}

service DocumentService {
  rpc MoveDocument(MoveDocumentRequest) returns (google.protobuf.Empty) {
    option (connectum.auth.v1.method_auth) = {
      resources: { action: "move" id_field: "document_id" type: "document" }
      resources: {
        action: "add"
        id_field: "destination.id"
        type_field: "destination.kind"
        types: ["folder", "workspace"]
      }
    };
  }
}
```

Each entry in `MethodAuth.resources` is a `ResourceRequirement`. Choose a non-empty `action` from your engine's policy vocabulary. Use exactly one type form. A fixed `type` applies to every request and takes no `types` list. A `type_field` reads the type from the request and requires a non-empty list of allowed `types`, each a non-empty string.

Write `id_field` and `type_field` as dot paths using the field names from the proto file. A path can traverse singular messages and select a `oneof` member. It must end at a singular string and cannot cross a repeated field or a map.

## Connect the authorizer

Generate the service descriptor from the annotated proto. Here `authenticate` is your configured authentication interceptor, `documentRoutes` registers the handler, and `createOpaAuthorizer` comes from the [OPA example](#opa) below.

```typescript
import { createProtoAuthzInterceptor } from '@connectum/auth';
import { createServer } from '@connectum/core';
import { createErrorHandlerInterceptor } from '@connectum/interceptors';
import { DocumentService } from './gen/documents/v1/documents_pb.js';
import { createOpaAuthorizer } from './opa.js';

const resourceAuthorizer = createOpaAuthorizer({
  baseUrl: 'http://localhost:8181',
  policyPath: 'documents/authz/allow',
  fetch,
});

const authz = createProtoAuthzInterceptor({
  defaultPolicy: 'deny',
  services: [DocumentService],
  resourceAuthorizer,
});

const server = createServer({
  services: [documentRoutes],
  interceptors: [createErrorHandlerInterceptor(), authenticate, authz],
});
await server.start();
```

Pass generated service descriptors in the interceptor's `services` option to validate every method in those services when the interceptor is created. For example, a typo in `destination.id` then fails startup. Without `services`, the interceptor resolves rules on demand. An unusable resource rule then produces `Internal` on the call and logs the reason on the server.

The authorizer implements `check({ subject, action, resource, context })`. It receives the caller's `AuthContext`, the action, a `{ type, id }` pair, and the RPC's `{ service, method, message }`. It may return a decision synchronously or asynchronously. Only the literal string `"allow"` grants access. The handler receives the same decoded message the authorizer saw. Treat it as read-only and put proto authorization last before the handler so intervening code cannot change the checked object.

## When the object check runs

| Method-level outcome | What happens on a method with resource rules |
|---|---|
| The method is public, directly or through a service default | Invalid contract. A public method cannot declare resource rules. |
| A trusted internal caller passes the internal check, or the caller satisfies the effective `requires` | Check the objects. An internal method with `requires` uses the roles and scopes check. |
| The effective proto policy allows, a matching programmatic rule allows, or `authorize` returns exactly `true` | Check the objects. The caller must be authenticated even if the method-level allow needed no identity. |
| The policy check finds an inherited `service_auth.default_policy: "deny"` | Evaluate programmatic rules, then `authorize` if no rule matches. A denial stops the call. Otherwise, check the objects. |
| The caller fails the internal or requirements check, the policy check finds the method's own `policy: "deny"`, a matching rule denies, or `authorize` refuses | Stop before checking any object. |
| No earlier method-level decision applies | Check the objects under either interceptor `defaultPolicy`, including `"deny"`. |

`MoveDocument` declares only `resources`. Even if the service sets `default_policy: "deny"`, those resource rules replace the inherited deny. The caller still needs permission on both the document and the destination. See the [full decision order](/en/guide/auth/proto-authz#decision-flow).

Once the caller and authorizer are available, the interceptor reads **all** references before the first call to `check`. It then checks each rule in declaration order and stops on the first refusal. Only a caller who passes every rule reaches the handler.

## Hide an object's existence

Use a visibility action when even confirming that an object exists would reveal information. For example, the default visibility action can be `read`, while a workspace uses `is_member`.

```typescript
const authz = createProtoAuthzInterceptor({
  services: [DocumentService],
  resourceAuthorizer,
  hideExistence: { action: 'read', byType: { workspace: 'is_member' } },
});
```

After an object check returns a denial, the interceptor asks about the same caller and object once more, using the action in `byType` for that type or the default `action`. If the caller passes the visibility check, the original refusal is `PermissionDenied`. If visibility is also denied, the caller gets `NotFound`. Successful checks, method-level refusals and thrown errors do not trigger a visibility check.

## Error codes

| What happens | Result |
|---|---|
| The object check has no authenticated caller | `Unauthenticated` |
| An authenticated call reaches a resource rule without a configured authorizer | `PermissionDenied`. The interceptor logs a warning once per method. |
| An ID or dynamic type is empty, a parent or selected `oneof` member is unset, or a type is outside `types` | `InvalidArgument`. No object is checked. |
| The engine denies the action | `PermissionDenied`, or `NotFound` if the visibility check also denies. |
| Either call to `check` throws a `ConnectError` | The error keeps its code. An adapter can signal an engine outage with `Unavailable`. |
| Either call to `check` throws another error | `Internal`. The server logs the cause and the caller gets a generic message. |
| An invalid resource rule is first resolved during a call | `Internal`. Pass service descriptors at startup to catch the contract error earlier. |

Set `logger` on the interceptor to supply your own `warn` and `error` methods. The default is `console`. A method-level `authorize` callback has its own error behavior and propagates exceptions it throws.

## Streaming

Unary and server-streaming RPCs both name the object in one request message. For server streaming, the interceptor reads the first message and forwards it to the handler if the object checks pass. If a reference is invalid or the authorizer denies access or throws, the interceptor closes the request stream before returning the error. An empty request stream gives `InvalidArgument`. Resource rules on client-streaming and bidirectional-streaming methods fail contract validation.

## Gateway and service authorization

Use Envoy's `ext_authz` filter or an Istio `CUSTOM` policy to ask an external authorizer whether the request may reach the service, for example by RPC path and headers. Inside the service, authenticate the caller or establish their identity from a trusted gateway. Proto authorization can then check the document ID and destination in the decoded message before `MoveDocument` runs. [Envoy external authorization](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/ext_authz_filter) · [Istio external authorization](https://istio.io/latest/docs/tasks/security/authorization/authz-custom/) · [Trust gateway authentication](/en/guide/auth/gateway)

## Verify the rule

Give a test caller `move` on one document and `add` on one folder. Call `MoveDocument` for that pair and verify that the handler runs. Repeat with the same caller and document but a folder where the caller lacks `add`. With existence hiding off, expect `PermissionDenied` and no handler call. Send an empty destination ID and verify that the RPC returns `InvalidArgument` before the engine receives even the document check.

## Engine adapters

Copy the adapter for your engine into your application. These examples implement the exported `ResourceAuthorizer` interface. The package ships no adapter factories. The four HTTP examples share the following `http.ts` helper and take a base URL without a trailing slash.

A failed connection, HTTP 429 or a server error becomes `Unavailable`. Other unsuccessful responses and invalid JSON surface as `Internal` through the interceptor. The helper leaves the engine's response body out of HTTP error messages.

```typescript
import { Code, ConnectError } from "@connectrpc/connect";

export type FetchLike = (
    url: string,
    init: { method: "POST"; headers: Record<string, string>; body: string },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export async function postJson(fetchLike: FetchLike, url: string, body: unknown, headers: Record<string, string> = {}): Promise<unknown> {
    let reply: Awaited<ReturnType<FetchLike>>;
    try {
        reply = await fetchLike(url, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
    } catch (cause) {
        throw new ConnectError("Authorization engine is unreachable", Code.Unavailable, undefined, undefined, cause);
    }
    if (!reply.ok) {
        if (reply.status >= 500 || reply.status === 429) {
            throw new ConnectError(`Authorization engine answered ${reply.status}`, Code.Unavailable);
        }
        throw new Error(`Authorization engine rejected the request with ${reply.status}`);
    }
    return await reply.json();
}
```

### OpenFGA

Use the rule’s action as the OpenFGA relation. The tuple identifies the caller as `user:<subject>` by default and the object as `<type>:<id>`. Supply `authorizationModelId` to pin the model and `authorization` if the store requires a credential. Only a boolean `allowed: true` allows the call. [OpenFGA Check API](https://openfga.dev/api/service#/Relationship%20Queries/Check)

```typescript
import type { ResourceAuthorizer } from "@connectum/auth";
import { type FetchLike, postJson } from "./http.js";

export interface OpenFgaRecipeOptions {
    readonly apiUrl: string;
    readonly storeId: string;
    readonly authorizationModelId?: string;
    readonly userType?: string;
    readonly fetch: FetchLike;
    readonly authorization?: string;
}

export function createOpenFgaAuthorizer(options: OpenFgaRecipeOptions): ResourceAuthorizer {
    const { apiUrl, storeId, authorizationModelId, userType = "user", authorization } = options;
    return {
        check: async ({ subject, action, resource }) => {
            const reply = (await postJson(
                options.fetch,
                `${apiUrl}/stores/${encodeURIComponent(storeId)}/check`,
                {
                    tuple_key: { user: `${userType}:${subject.subject}`, relation: action, object: `${resource.type}:${resource.id}` },
                    ...(authorizationModelId !== undefined && { authorization_model_id: authorizationModelId }),
                },
                authorization === undefined ? {} : { authorization },
            )) as { allowed?: unknown };
            return reply.allowed === true ? "allow" : "deny";
        },
    };
}
```

### SpiceDB

Send a `CheckPermission` request to the SpiceDB HTTP endpoint with the preshared key. A conditional permission counts as a denial because the response has not established that the caller meets the condition. [SpiceDB PermissionsService.CheckPermission](https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.PermissionsService.CheckPermission)

This adapter uses `minimizeLatency`, so a cached result can still grant access just after revocation. To have the next check see a committed revocation, use `fullyConsistent` at the cost of higher latency (on CockroachDB, use `atLeastAsFresh` with the revocation's ZedToken). [SpiceDB consistency](https://authzed.com/docs/spicedb/concepts/consistency)

```typescript
import type { ResourceAuthorizer } from "@connectum/auth";
import { type FetchLike, postJson } from "./http.js";

export interface SpiceDbRecipeOptions {
    readonly endpoint: string;
    readonly presharedKey: string;
    readonly subjectType?: string;
    readonly fetch: FetchLike;
}

export function createSpiceDbAuthorizer(options: SpiceDbRecipeOptions): ResourceAuthorizer {
    const { endpoint, presharedKey, subjectType = "user" } = options;
    return {
        check: async ({ subject, action, resource }) => {
            const reply = (await postJson(
                options.fetch,
                `${endpoint}/v1/permissions/check`,
                {
                    consistency: { minimizeLatency: true },
                    resource: { objectType: resource.type, objectId: resource.id },
                    permission: action,
                    subject: { object: { objectType: subjectType, objectId: subject.subject } },
                },
                { authorization: `Bearer ${presharedKey}` },
            )) as { permissionship?: unknown };
            return reply.permissionship === "PERMISSIONSHIP_HAS_PERMISSION" ? "allow" : "deny";
        },
    };
}
```

### OPA

Point `policyPath` at a boolean rule, such as `documents/authz/allow`. The policy receives the caller’s ID, roles and scopes, the action and resource, and the RPC service and method. An undefined rule produces no `result` and denies the request. [OPA Data API](https://www.openpolicyagent.org/docs/rest-api#get-a-document-with-input)

```typescript
import type { ResourceAuthorizer } from "@connectum/auth";
import { type FetchLike, postJson } from "./http.js";

export interface OpaRecipeOptions {
    readonly baseUrl: string;
    readonly policyPath: string;
    readonly fetch: FetchLike;
}

export function createOpaAuthorizer(options: OpaRecipeOptions): ResourceAuthorizer {
    const { baseUrl, policyPath } = options;
    return {
        check: async ({ subject, action, resource, context }) => {
            const reply = (await postJson(options.fetch, `${baseUrl}/v1/data/${policyPath}`, {
                input: {
                    subject: { id: subject.subject, roles: subject.roles, scopes: subject.scopes },
                    action,
                    resource: { type: resource.type, id: resource.id },
                    context: { service: context.service, method: context.method },
                },
            })) as { result?: unknown };
            return reply.result === true ? "allow" : "deny";
        },
    };
}
```

### Cedar via Amazon Verified Permissions

Supply an `isAuthorized` function backed by your AWS SDK client or signed request. Set the principal and action types to match your Cedar schema. Use `entityTypes` when the contract and the schema use different names for a resource type. Only `ALLOW` grants access. [Amazon Verified Permissions IsAuthorized](https://docs.aws.amazon.com/verifiedpermissions/latest/apireference/API_IsAuthorized.html)

```typescript
import type { ResourceAuthorizer } from "@connectum/auth";

export interface IsAuthorizedInput {
    readonly policyStoreId: string;
    readonly principal: { readonly entityType: string; readonly entityId: string };
    readonly action: { readonly actionType: string; readonly actionId: string };
    readonly resource: { readonly entityType: string; readonly entityId: string };
}

export interface CedarRecipeOptions {
    readonly policyStoreId: string;
    readonly principalType: string;
    readonly actionType?: string;
    readonly entityTypes?: Readonly<Record<string, string>>;
    readonly isAuthorized: (input: IsAuthorizedInput) => Promise<{ decision?: unknown }>;
}

export function createCedarAuthorizer(options: CedarRecipeOptions): ResourceAuthorizer {
    const { policyStoreId, principalType, actionType = "Action", entityTypes = {} } = options;
    return {
        check: async ({ subject, action, resource }) => {
            const reply = await options.isAuthorized({
                policyStoreId,
                principal: { entityType: principalType, entityId: subject.subject },
                action: { actionType, actionId: action },
                resource: { entityType: Object.hasOwn(entityTypes, resource.type) ? (entityTypes[resource.type] as string) : resource.type, entityId: resource.id },
            });
            return reply.decision === "ALLOW" ? "allow" : "deny";
        },
    };
}
```

### Cerbos

Send one resource and its requested action to `CheckResources`. Cerbos requires a role. A caller with no roles is denied locally unless you configure `roleForCallerWithoutRoles`. The adapter looks up the decision for the requested action in the first result. [Cerbos CheckResources API](https://docs.cerbos.dev/cerbos/latest/api/index.html)

```typescript
import type { ResourceAuthorizer } from "@connectum/auth";
import { type FetchLike, postJson } from "./http.js";

export interface CerbosRecipeOptions {
    readonly baseUrl: string;
    readonly roleForCallerWithoutRoles?: string;
    readonly fetch: FetchLike;
}

export function createCerbosAuthorizer(options: CerbosRecipeOptions): ResourceAuthorizer {
    return {
        check: async ({ subject, action, resource }) => {
            const roles = subject.roles.length > 0 ? [...subject.roles] : options.roleForCallerWithoutRoles === undefined ? [] : [options.roleForCallerWithoutRoles];
            if (roles.length === 0) {
                return "deny";
            }
            const reply = (await postJson(options.fetch, `${options.baseUrl}/api/check/resources`, {
                principal: { id: subject.subject, roles, attr: { scopes: [...subject.scopes] } },
                resources: [{ resource: { kind: resource.type, id: resource.id }, actions: [action] }],
            })) as { results?: Array<{ actions?: Record<string, unknown> }> };
            return reply.results?.[0]?.actions?.[action] === "EFFECT_ALLOW" ? "allow" : "deny";
        },
    };
}
```

## Learn / Configure / API reference

- [Configure the method-level decision](/en/guide/auth/proto-authz#decision-flow)
- [Set up authentication](/en/guide/auth)
- [`createProtoAuthzInterceptor` API reference](/en/api/@connectum/auth/functions/createProtoAuthzInterceptor)
