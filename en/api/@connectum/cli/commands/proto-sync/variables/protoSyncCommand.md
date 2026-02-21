[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / protoSyncCommand

# Variable: protoSyncCommand

> `const` **protoSyncCommand**: `CommandDef`\<\{ `dry-run`: \{ `default`: `false`; `description`: `"Show what would be synced without generating code"`; `type`: `"boolean"`; \}; `from`: \{ `description`: `"Server address (e.g., localhost:5000 or http://localhost:5000)"`; `required`: `true`; `type`: `"string"`; \}; `out`: \{ `description`: `"Output directory for generated types"`; `required`: `true`; `type`: `"string"`; \}; `template`: \{ `description`: `"Path to custom buf.gen.yaml template"`; `type`: `"string"`; \}; \}\>

Defined in: [commands/proto-sync.ts:111](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/cli/src/commands/proto-sync.ts#L111)

citty command definition for `connectum proto sync`.
