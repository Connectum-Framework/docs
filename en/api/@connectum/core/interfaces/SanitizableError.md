[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / SanitizableError

# Interface: SanitizableError

Defined in: [packages/core/src/errors.ts:17](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/errors.ts#L17)

Sanitizable error interface.

Errors implementing this protocol carry rich server-side details
but expose only a safe message to clients.

## Properties

### clientMessage

> `readonly` **clientMessage**: `string`

Defined in: [packages/core/src/errors.ts:18](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/errors.ts#L18)

***

### serverDetails

> `readonly` **serverDetails**: `Readonly`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/core/src/errors.ts:19](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/errors.ts#L19)
