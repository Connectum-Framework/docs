[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / ReflectionResult

# Interface: ReflectionResult

Defined in: [utils/reflection.ts:19](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/cli/src/utils/reflection.ts#L19)

Result of fetching proto descriptors from a running server.

## Properties

### fileNames

> **fileNames**: `string`[]

Defined in: [utils/reflection.ts:25](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/cli/src/utils/reflection.ts#L25)

Proto file names in the registry

***

### registry

> **registry**: `FileRegistry`

Defined in: [utils/reflection.ts:23](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/cli/src/utils/reflection.ts#L23)

FileRegistry containing all discovered file descriptors

***

### services

> **services**: `string`[]

Defined in: [utils/reflection.ts:21](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/cli/src/utils/reflection.ts#L21)

List of fully-qualified service names
