// Generated from @connectum/auth@1.2.0 src/proto/reader.ts; do not edit.
// SPDX-License-Identifier: Apache-2.0

// node_modules/.pnpm/@connectum+auth@1.2.0/node_modules/@connectum/auth/src/proto/reader.ts
import { getOption, hasOption, isFieldSet } from "@bufbuild/protobuf";

// node_modules/.pnpm/@connectum+auth@1.2.0/node_modules/@connectum/auth/gen/connectum/auth/v1/options_pb.js
import { extDesc, fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv2";
import { file_google_protobuf_descriptor } from "@bufbuild/protobuf/wkt";
var file_connectum_auth_v1_options = /* @__PURE__ */ fileDesc("Ch9jb25uZWN0dW0vYXV0aC92MS9vcHRpb25zLnByb3RvEhFjb25uZWN0dW0uYXV0aC52MSIxChBBdXRoUmVxdWlyZW1lbnRzEg0KBXJvbGVzGAEgAygJEg4KBnNjb3BlcxgCIAMoCSJ1CgpNZXRob2RBdXRoEg4KBnB1YmxpYxgBIAEoCBI1CghyZXF1aXJlcxgCIAEoCzIjLmNvbm5lY3R1bS5hdXRoLnYxLkF1dGhSZXF1aXJlbWVudHMSDgoGcG9saWN5GAMgASgJEhAKCGludGVybmFsGAQgASgIIoYBCgtTZXJ2aWNlQXV0aBIWCg5kZWZhdWx0X3BvbGljeRgBIAEoCRI9ChBkZWZhdWx0X3JlcXVpcmVzGAIgASgLMiMuY29ubmVjdHVtLmF1dGgudjEuQXV0aFJlcXVpcmVtZW50cxIOCgZwdWJsaWMYAyABKAgSEAoIaW50ZXJuYWwYBCABKAg6YAoLbWV0aG9kX2F1dGgSHi5nb29nbGUucHJvdG9idWYuTWV0aG9kT3B0aW9ucxi0hwMgASgLMh0uY29ubmVjdHVtLmF1dGgudjEuTWV0aG9kQXV0aFIKbWV0aG9kQXV0aDpkCgxzZXJ2aWNlX2F1dGgSHy5nb29nbGUucHJvdG9idWYuU2VydmljZU9wdGlvbnMYtYcDIAEoCzIeLmNvbm5lY3R1bS5hdXRoLnYxLlNlcnZpY2VBdXRoUgtzZXJ2aWNlQXV0aA", [file_google_protobuf_descriptor]);
var MethodAuthSchema = /* @__PURE__ */ messageDesc(file_connectum_auth_v1_options, 1);
var ServiceAuthSchema = /* @__PURE__ */ messageDesc(file_connectum_auth_v1_options, 2);
var method_auth = /* @__PURE__ */ extDesc(file_connectum_auth_v1_options, 0);
var service_auth = /* @__PURE__ */ extDesc(file_connectum_auth_v1_options, 1);

// node_modules/.pnpm/@connectum+auth@1.2.0/node_modules/@connectum/auth/src/proto/reader.ts
var resolvedCache = /* @__PURE__ */ new WeakMap();
var DEFAULT_RESOLVED = {
  public: false,
  internal: false,
  policy: void 0,
  requires: void 0
};
function resolveMethodAuth(method) {
  const cached = resolvedCache.get(method);
  if (cached !== void 0) {
    return cached;
  }
  const result = computeMethodAuth(method);
  resolvedCache.set(method, result);
  return result;
}
function computeMethodAuth(method) {
  const service = method.parent;
  const hasServiceAuth = hasOption(service, service_auth);
  const svcAuth = hasServiceAuth ? getOption(service, service_auth) : void 0;
  const hasMethodAuth = hasOption(method, method_auth);
  const mtdAuth = hasMethodAuth ? getOption(method, method_auth) : void 0;
  if (svcAuth === void 0 && mtdAuth === void 0) {
    return DEFAULT_RESOLVED;
  }
  const methodPublicSet = mtdAuth !== void 0 && isFieldSet(mtdAuth, MethodAuthSchema.field.public);
  const servicePublicSet = svcAuth !== void 0 && isFieldSet(svcAuth, ServiceAuthSchema.field.public);
  const isPublic = methodPublicSet ? mtdAuth?.public === true : servicePublicSet ? svcAuth?.public === true : false;
  const methodInternalSet = mtdAuth !== void 0 && isFieldSet(mtdAuth, MethodAuthSchema.field.internal);
  const serviceInternalSet = svcAuth !== void 0 && isFieldSet(svcAuth, ServiceAuthSchema.field.internal);
  const isInternal = methodInternalSet ? mtdAuth?.internal === true : serviceInternalSet ? svcAuth?.internal === true : false;
  let requires;
  if (mtdAuth !== void 0 && mtdAuth.requires !== void 0) {
    requires = {
      roles: mtdAuth.requires.roles,
      scopes: mtdAuth.requires.scopes
    };
  } else if (svcAuth !== void 0 && svcAuth.defaultRequires !== void 0) {
    requires = {
      roles: svcAuth.defaultRequires.roles,
      scopes: svcAuth.defaultRequires.scopes
    };
  }
  let policy;
  if (mtdAuth !== void 0 && mtdAuth.policy !== "") {
    policy = normalizePolicy(mtdAuth.policy);
  } else if (svcAuth !== void 0 && svcAuth.defaultPolicy !== "") {
    policy = normalizePolicy(svcAuth.defaultPolicy);
  }
  return { public: isPublic, internal: isInternal, policy, requires };
}
function normalizePolicy(value) {
  if (value === "allow") return "allow";
  if (value === "deny") return "deny";
  return void 0;
}
function getPublicMethods(services) {
  const patterns = [];
  for (const service of services) {
    for (const method of service.methods) {
      const resolved = resolveMethodAuth(method);
      if (resolved.public) {
        patterns.push(`${service.typeName}/${method.name}`);
      }
    }
  }
  return patterns;
}
function getInternalMethods(services) {
  const patterns = [];
  for (const service of services) {
    for (const method of service.methods) {
      const resolved = resolveMethodAuth(method);
      if (resolved.internal) {
        patterns.push(`${service.typeName}/${method.name}`);
      }
    }
  }
  return patterns;
}
export {
  getInternalMethods,
  getPublicMethods,
  resolveMethodAuth
};
