[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / ReflectionResult

# Interface: ReflectionResult

Defined in: [utils/reflection.ts:35](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L35)

Result of fetching proto descriptors from a running server.

## Properties

### fileNames

> **fileNames**: `string`[]

Defined in: [utils/reflection.ts:41](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L41)

Proto file names in the registry

***

### registry

> **registry**: `FileRegistry`

Defined in: [utils/reflection.ts:39](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L39)

FileRegistry containing all discovered file descriptors

***

### services

> **services**: `string`[]

Defined in: [utils/reflection.ts:37](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L37)

List of fully-qualified service names
