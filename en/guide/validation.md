---
title: Validation
description: Proto-first input validation with protovalidate in Connectum services.
outline: deep
---

# Validation

Connectum uses `@connectrpc/validate` (backed by `@bufbuild/protovalidate`) for schema-based input validation. Constraints are defined directly in `.proto` files and enforced automatically by the validation interceptor.

## Overview

The validation approach is **proto-first**: validation rules live alongside message definitions in `.proto` files. This ensures the proto schema is the single source of truth for both data structure and constraints.

```
Client → errorHandler → ... → validation → serializer → Handler
                                   ↓
                          Invalid: INVALID_ARGUMENT
```

Validation runs as the 7th interceptor in the default chain (before serializer, after resilience interceptors). Invalid requests are rejected with `INVALID_ARGUMENT` before reaching the handler.

## Setup

Install the required packages:

```bash
# Validation runtime
pnpm add @bufbuild/protovalidate @connectrpc/validate

# Proto dependency (buf.yaml)
# Add buf.build/bufbuild/protovalidate to deps
```

Declare the dependency in `buf.yaml`:

```yaml
version: v2
deps:
  - buf.build/bufbuild/protovalidate
```

Fetch dependencies:

```bash
npx buf dep update
```

## Proto Constraints

Import `buf/validate/validate.proto` and annotate fields with constraints:

```protobuf
syntax = "proto3";
import "buf/validate/validate.proto";

message CreateOrderRequest {
  // String constraints
  string customer_id = 1 [(buf.validate.field).string.min_len = 1];
  string currency = 2 [(buf.validate.field).string = {min_len: 3, max_len: 3}];
  string email = 3 [(buf.validate.field).string.email = true];

  // Numeric constraints
  int32 quantity = 4 [(buf.validate.field).int32.gt = 0];
  int32 page_size = 5 [(buf.validate.field).int32 = {gte: 1, lte: 100}];

  // Repeated constraints
  repeated OrderItem items = 6 [(buf.validate.field).repeated.min_items = 1];

  // Required message
  ShippingAddress address = 7 [(buf.validate.field).required = true];
}

message GetOrderRequest {
  string order_id = 1 [(buf.validate.field).string.uuid = true];
}
```

### Available Constraints

| Type | Constraints |
|------|------------|
| **String** | `min_len`, `max_len`, `pattern` (regex), `email`, `uri`, `uuid`, `ip`, `hostname` |
| **Numeric** | `lt`, `lte`, `gt`, `gte`, `in`, `not_in`, `const` |
| **Repeated** | `min_items`, `max_items`, `unique` |
| **Message** | `required`, `skip` |
| **Enum** | `defined_only` |
| **Map** | `min_pairs`, `max_pairs`, key/value constraints |

## Validation Interceptor

Validation is enabled by default in `createDefaultInterceptors()`:

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  interceptors: createDefaultInterceptors(), // validation enabled
});
```

### Disabling Validation

```typescript
const interceptors = createDefaultInterceptors({
  validation: false,
});
```

### Standalone Usage

For custom configuration, use `createValidateInterceptor()` directly:

```typescript
import { createValidateInterceptor } from '@connectrpc/validate';

const server = createServer({
  services: [routes],
  interceptors: [
    createValidateInterceptor(),
    // ... other interceptors
  ],
});
```

## Error Messages

When validation fails, the interceptor throws a `ConnectError` with code `INVALID_ARGUMENT`:

```
Code: INVALID_ARGUMENT
Message: "customer_id: value length must be at least 1 characters [string.min_len]"
```

Error messages include the field path, the violated constraint, and the constraint identifier. This makes it straightforward for clients to display meaningful validation errors.

## Custom Validation

Proto constraints cover structural validation (format, range, presence). For business-level validation (e.g., "email must be unique", "order total must not exceed credit limit"), validate in the service handler:

```typescript
import { ConnectError, Code } from '@connectrpc/connect';

async sayHello(request: SayHelloRequest) {
  // Business validation (beyond proto constraints)
  const exists = await db.findByEmail(request.email);
  if (exists) {
    throw new ConnectError('Email already registered', Code.AlreadyExists);
  }
  // ...
}
```

## Related

- [Interceptors](/en/guide/interceptors) -- the validation interceptor in the chain
- [@connectum/interceptors](/en/packages/interceptors) -- Package Guide
- [ADR-005: Input Validation Strategy](/en/contributing/adr/005-input-validation-strategy) -- design rationale and alternatives
- [protovalidate documentation](https://github.com/bufbuild/protovalidate) -- full constraint reference
- [@connectrpc/validate](https://www.npmjs.com/package/@connectrpc/validate) -- official ConnectRPC validation package
