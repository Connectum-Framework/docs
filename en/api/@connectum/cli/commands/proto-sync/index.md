[Connectum API Reference](../../../../index.md) / [@connectum/cli](../../index.md) / commands/proto-sync

# commands/proto-sync

Proto sync command

Syncs proto types from a running Connectum server via gRPC Reflection.

Pipeline:
1. Connect to server via ServerReflectionClient
2. Discover services and build FileRegistry
3. Serialize as FileDescriptorSet binary (.binpb)
4. Run `buf generate` with .binpb input

## Interfaces

- [ProtoSyncOptions](interfaces/ProtoSyncOptions.md)

## Variables

- [protoSyncCommand](variables/protoSyncCommand.md)

## Functions

- [executeProtoSync](functions/executeProtoSync.md)
