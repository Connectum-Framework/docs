[Connectum API Reference](../../../index.md) / [@connectum/reflection](../index.md) / collectFileProtos

# Function: collectFileProtos()

> **collectFileProtos**(`files`): `FileDescriptorProto`[]

Defined in: [utils.ts:19](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/reflection/src/utils.ts#L19)

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
