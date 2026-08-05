[Connectum API Reference](../../index.md) / @connectum/protoc-gen-catalog

# @connectum/protoc-gen-catalog

protoc-gen-connectum-catalog — executable entry point.

Buf/protoc invoke this binary, passing a `CodeGeneratorRequest` on stdin and
reading a `CodeGeneratorResponse` from stdout. The plugin itself is exported
from `./plugin.ts` for programmatic use and testing.
