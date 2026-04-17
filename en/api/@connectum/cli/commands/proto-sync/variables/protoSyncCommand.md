[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / protoSyncCommand

# Variable: protoSyncCommand

> `const` **protoSyncCommand**: `CommandDef`\<\{ `dry-run`: \{ `default`: `false`; `description`: `"Show what would be synced without generating code"`; `type`: `"boolean"`; \}; `from`: \{ `description`: `"Server address (e.g., localhost:5000 or http://localhost:5000)"`; `required`: `true`; `type`: `"string"`; \}; `out`: \{ `description`: `"Output directory for generated types"`; `required`: `true`; `type`: `"string"`; \}; `template`: \{ `description`: `"Path to custom buf.gen.yaml template"`; `type`: `"string"`; \}; \}\>

Defined in: [commands/proto-sync.ts:113](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/cli/src/commands/proto-sync.ts#L113)

citty command definition for `connectum proto sync`.
