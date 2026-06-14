[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / protoSyncCommand

# Variable: protoSyncCommand

> `const` **protoSyncCommand**: `CommandDef`\<\{ `dry-run`: \{ `default`: `false`; `description`: `"Show what would be synced without generating code"`; `type`: `"boolean"`; \}; `from`: \{ `description`: `"Server address (e.g., localhost:5000 or http://localhost:5000)"`; `required`: `true`; `type`: `"string"`; \}; `out`: \{ `description`: `"Output directory for generated types"`; `required`: `true`; `type`: `"string"`; \}; `template`: \{ `description`: `"Path to custom buf.gen.yaml template"`; `type`: `"string"`; \}; \}\>

Defined in: [commands/proto-sync.ts:113](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/cli/src/commands/proto-sync.ts#L113)

citty command definition for `connectum proto sync`.
