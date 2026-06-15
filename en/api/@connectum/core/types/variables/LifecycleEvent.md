[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / LifecycleEvent

# Variable: LifecycleEvent

> `const` **LifecycleEvent**: `object`

Defined in: [packages/core/src/types.ts:166](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/types.ts#L166)

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
