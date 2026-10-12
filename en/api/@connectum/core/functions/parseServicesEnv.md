[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / parseServicesEnv

# Function: parseServicesEnv()

> **parseServicesEnv**(`value`): `string`[]

Defined in: [packages/core/src/enabledServices.ts:29](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/enabledServices.ts#L29)

Parse a comma-separated env value into a list of proto `typeName`s, trimming
whitespace and dropping empty entries. Returns `[]` for an empty/undefined value.

## Parameters

### value

`string` \| `null` \| `undefined`

## Returns

`string`[]

## Example

```ts
import { createServer, parseServicesEnv } from "@connectum/core";
import { greeterService } from "./services/greeterService.ts";

const server = createServer({
  services: [greeterService],
  enabledServices: parseServicesEnv(
    process.env.CONNECTUM_SERVICES ?? greeterService.descriptor.typeName,
  ),
});
```
