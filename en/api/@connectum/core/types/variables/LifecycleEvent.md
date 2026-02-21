[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / LifecycleEvent

# Variable: LifecycleEvent

> `const` **LifecycleEvent**: `object`

Defined in: [packages/core/src/types.ts:143](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L143)

Lifecycle event names

## Type Declaration

### ERROR

> `readonly` **ERROR**: `"error"` = `"error"`

Emitted on error

### READY

> `readonly` **READY**: `"ready"` = `"ready"`

Emitted when server is ready to accept connections

### START

> `readonly` **START**: `"start"` = `"start"`

Emitted when server starts (before ready)

### STOP

> `readonly` **STOP**: `"stop"` = `"stop"`

Emitted when server stops

### STOPPING

> `readonly` **STOPPING**: `"stopping"` = `"stopping"`

Emitted when server begins graceful shutdown
