[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / resolveMethodAuth

# Function: resolveMethodAuth()

> **resolveMethodAuth**(`method`): [`ResolvedMethodAuth`](../interfaces/ResolvedMethodAuth.md)

Defined in: [packages/auth/src/proto/reader.ts:65](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/proto/reader.ts#L65)

Resolve the effective authorization configuration for an RPC method.

Merges service-level defaults (`service_auth`) with method-level overrides
(`method_auth`). Method-level settings take priority over service-level ones.

Results are cached in a `WeakMap` keyed by `DescMethod` (singleton per method,
so 100% cache hit after the first call for each method).

Priority (method overrides service):
```
method.public       -> service.public        -> false
method.requires     -> service.default_requires -> undefined
method.policy       -> service.default_policy    -> undefined
```

## Parameters

### method

`DescMethod`

The protobuf method descriptor

## Returns

[`ResolvedMethodAuth`](../interfaces/ResolvedMethodAuth.md)

Resolved authorization configuration
