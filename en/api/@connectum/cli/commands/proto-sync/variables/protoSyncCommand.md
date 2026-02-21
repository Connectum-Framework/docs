[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / protoSyncCommand

# Variable: protoSyncCommand

> `const` **protoSyncCommand**: `CommandDef`\<\{ `dry-run`: \{ `default`: `false`; `description`: `"Show what would be synced without generating code"`; `type`: `"boolean"`; \}; `from`: \{ `description`: `"Server address (e.g., localhost:5000 or http://localhost:5000)"`; `required`: `true`; `type`: `"string"`; \}; `out`: \{ `description`: `"Output directory for generated types"`; `required`: `true`; `type`: `"string"`; \}; `template`: \{ `description`: `"Path to custom buf.gen.yaml template"`; `type`: `"string"`; \}; \}\>

Defined in: [commands/proto-sync.ts:111](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/cli/src/commands/proto-sync.ts#L111)

citty command definition for `connectum proto sync`.
