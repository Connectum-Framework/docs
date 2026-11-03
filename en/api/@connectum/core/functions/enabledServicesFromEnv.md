[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / enabledServicesFromEnv

# Function: enabledServicesFromEnv()

> **enabledServicesFromEnv**(`value`): `string`[] \| `undefined`

Defined in: [packages/core/src/enabledServices.ts:64](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/enabledServices.ts#L64)

Read `enabledServices` from a comma-separated env value, in one line.

| value | result | what `createServer` does |
|---|---|---|
| unset, `null`, `""`, whitespace or only commas | `undefined` | mounts every supplied service (the default) |
| `"a.v1.S"` or `" a.v1.S , b.v1.S "` | the named `typeName`s, trimmed | mounts only those |

To mount none of the supplied services, pass `enabledServices: []` directly; an env
value cannot ask for that. Use full proto `typeName`s, as for [parseServicesEnv](parseServicesEnv.md).

## Parameters

### value

`string` \| `null` \| `undefined`

## Returns

`string`[] \| `undefined`

## Example

```ts
import { createServer, enabledServicesFromEnv } from "@connectum/core";
import { greeterService } from "./services/greeterService.ts";

const server = createServer({
  services: [greeterService],
  enabledServices: enabledServicesFromEnv(process.env.CONNECTUM_SERVICES),
});
```
