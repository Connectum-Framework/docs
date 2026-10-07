[Connectum API Reference](../../../../index.md) / [@connectum/cli](../../index.md) / utils/reflection

# utils/reflection

Reflection client utilities

A gRPC Server Reflection Protocol client for CLI commands. It speaks v1 and
falls back to v1alpha for servers that only implement the older version.

## Interfaces

- [ReflectionOptions](interfaces/ReflectionOptions.md)
- [ReflectionResult](interfaces/ReflectionResult.md)

## Variables

- [DEFAULT\_REFLECTION\_TIMEOUT\_MS](variables/DEFAULT_REFLECTION_TIMEOUT_MS.md)
- [MAX\_REFLECTION\_TIMEOUT\_MS](variables/MAX_REFLECTION_TIMEOUT_MS.md)

## Functions

- [fetchFileDescriptorSetBinary](functions/fetchFileDescriptorSetBinary.md)
- [fetchReflectionData](functions/fetchReflectionData.md)
- [isValidReflectionTimeout](functions/isValidReflectionTimeout.md)
