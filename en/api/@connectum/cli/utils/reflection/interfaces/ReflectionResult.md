[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / ReflectionResult

# Interface: ReflectionResult

Defined in: [utils/reflection.ts:34](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L34)

Result of fetching proto descriptors from a running server.

## Properties

### fileNames

> **fileNames**: `string`[]

Defined in: [utils/reflection.ts:40](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L40)

Proto file names in the registry

***

### registry

> **registry**: `FileRegistry`

Defined in: [utils/reflection.ts:38](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L38)

FileRegistry containing all discovered file descriptors

***

### services

> **services**: `string`[]

Defined in: [utils/reflection.ts:36](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L36)

List of fully-qualified service names
