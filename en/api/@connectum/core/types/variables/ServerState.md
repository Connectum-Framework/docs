[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerState

# Variable: ServerState

> `const` **ServerState**: `object`

Defined in: [packages/core/src/types.ts:125](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/core/src/types.ts#L125)

Server state constants

Note: Using const object instead of enum for native TypeScript compatibility

## Type Declaration

### CREATED

> `readonly` **CREATED**: `"created"` = `"created"`

Server created but not started

### RUNNING

> `readonly` **RUNNING**: `"running"` = `"running"`

Server is running and accepting connections

### STARTING

> `readonly` **STARTING**: `"starting"` = `"starting"`

Server is starting

### STOPPED

> `readonly` **STOPPED**: `"stopped"` = `"stopped"`

Server has stopped

### STOPPING

> `readonly` **STOPPING**: `"stopping"` = `"stopping"`

Server is stopping
