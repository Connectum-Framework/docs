[Connectum API Reference](../../../index.md) / [@connectum/reflection](../index.md) / collectFileProtos

# Function: collectFileProtos()

> **collectFileProtos**(`files`): `FileDescriptorProto`[]

Defined in: [utils.ts:19](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/reflection/src/utils.ts#L19)

Recursively collect FileDescriptorProto objects from DescFile entries,
including transitive dependencies.

Dependencies are visited depth-first before the file itself,
and duplicates are eliminated by file name.

## Parameters

### files

readonly `DescFile`[]

Array of DescFile entries to collect protos from

## Returns

`FileDescriptorProto`[]

Deduplicated array of FileDescriptorProto objects
