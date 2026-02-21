[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerState

# Variable: ServerState

> `const` **ServerState**: `object`

Defined in: [packages/core/src/types.ts:125](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L125)

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
