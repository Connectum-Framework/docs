[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / config

# config

Configuration module

Provides type-safe environment configuration validation
using Zod schemas. Follows 12-Factor App principles.

## Example

```typescript
import { parseEnvConfig, type ConnectumEnv } from '@connectum/core/config';

// Parse environment with defaults
const config = parseEnvConfig();

// Use validated config
console.log(`Starting server on port ${config.PORT}`);
console.log(`Log level: ${config.LOG_LEVEL}`);
console.log(`HTTP health enabled: ${config.HTTP_HEALTH_ENABLED}`);
```

## References

### BooleanFromStringSchema

Re-exports [BooleanFromStringSchema](../variables/BooleanFromStringSchema.md)

***

### ConnectumEnv

Re-exports [ConnectumEnv](../type-aliases/ConnectumEnv.md)

***

### ConnectumEnvSchema

Re-exports [ConnectumEnvSchema](../variables/ConnectumEnvSchema.md)

***

### LogFormatSchema

Re-exports [LogFormatSchema](../variables/LogFormatSchema.md)

***

### LoggerBackendSchema

Re-exports [LoggerBackendSchema](../variables/LoggerBackendSchema.md)

***

### LogLevelSchema

Re-exports [LogLevelSchema](../variables/LogLevelSchema.md)

***

### NodeEnvSchema

Re-exports [NodeEnvSchema](../variables/NodeEnvSchema.md)

***

### parseEnvConfig

Re-exports [parseEnvConfig](../functions/parseEnvConfig.md)

***

### safeParseEnvConfig

Re-exports [safeParseEnvConfig](../functions/safeParseEnvConfig.md)
