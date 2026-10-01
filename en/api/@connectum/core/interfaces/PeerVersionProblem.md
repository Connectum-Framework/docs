[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / PeerVersionProblem

# Interface: PeerVersionProblem

Defined in: [packages/core/src/peerVersions.ts:52](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/peerVersions.ts#L52)

One loaded library that does not match what a package requires of it.

`kind: "range"` — the loaded version is outside `requiredRange`, declared by
`requiredBy` (`@connectum/core`, or `@connectrpc/connect-node` for its own `connect`).
`kind: "split"` — `@connectrpc/connect-node` loads a different `@connectrpc/connect`
copy (`loadedFrom`) than `@connectum/core` does (`otherCopy`).

## Properties

### kind

> `readonly` **kind**: `"split"` \| `"range"`

Defined in: [packages/core/src/peerVersions.ts:53](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/peerVersions.ts#L53)

***

### loadedFrom

> `readonly` **loadedFrom**: `string`

Defined in: [packages/core/src/peerVersions.ts:63](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/peerVersions.ts#L63)

Directory of the loaded copy, so the reader can see which copy it was.

***

### loadedVersion

> `readonly` **loadedVersion**: `string`

Defined in: [packages/core/src/peerVersions.ts:57](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/peerVersions.ts#L57)

Version of the copy that was loaded.

***

### otherCopy?

> `readonly` `optional` **otherCopy?**: `string`

Defined in: [packages/core/src/peerVersions.ts:65](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/peerVersions.ts#L65)

`kind: "split"` only: directory of the copy `@connectum/core` loads.

***

### packageName

> `readonly` **packageName**: `string`

Defined in: [packages/core/src/peerVersions.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/peerVersions.ts#L55)

Package name, e.g. `@bufbuild/protobuf`.

***

### requiredBy

> `readonly` **requiredBy**: `string`

Defined in: [packages/core/src/peerVersions.ts:61](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/peerVersions.ts#L61)

The package whose requirement is not met, with its version when known.

***

### requiredRange

> `readonly` **requiredRange**: `string`

Defined in: [packages/core/src/peerVersions.ts:59](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/peerVersions.ts#L59)

Range the requiring package declares, e.g. `^2.16.0`, or `2.2.0` for connect-node's exact peer.
