[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / ReflectionResult

# Interface: ReflectionResult

Defined in: [utils/reflection.ts:31](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L31)

Result of fetching proto descriptors from a running server.

## Properties

### fileNames

> **fileNames**: `string`[]

Defined in: [utils/reflection.ts:37](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L37)

Proto file names in the registry

***

### registry

> **registry**: `FileRegistry`

Defined in: [utils/reflection.ts:35](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L35)

FileRegistry containing all discovered file descriptors

***

### services

> **services**: `string`[]

Defined in: [utils/reflection.ts:33](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L33)

List of fully-qualified service names
