[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerState

# Variable: ServerState

> `const` **ServerState**: `object`

Defined in: [packages/core/src/types.ts:147](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/core/src/types.ts#L147)

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
