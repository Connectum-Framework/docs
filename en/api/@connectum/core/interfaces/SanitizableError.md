[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / SanitizableError

# Interface: SanitizableError

Defined in: [packages/core/src/errors.ts:17](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/core/src/errors.ts#L17)

Sanitizable error interface.

Errors implementing this protocol carry rich server-side details
but expose only a safe message to clients.

## Properties

### clientMessage

> `readonly` **clientMessage**: `string`

Defined in: [packages/core/src/errors.ts:18](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/core/src/errors.ts#L18)

***

### serverDetails

> `readonly` **serverDetails**: `Readonly`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/core/src/errors.ts:19](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/core/src/errors.ts#L19)
