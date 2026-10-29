import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build, version } from 'esbuild';

const root = new URL('../', import.meta.url);
const authRoot = new URL('../../', import.meta.resolve('@connectum/auth/proto'));
const source = new URL('src/proto/reader.ts', authRoot);
const authVersion = JSON.parse(readFileSync(new URL('package.json', authRoot), 'utf8')).version;
const output = new URL('.vitepress/openapi/generated/auth-reader.mjs', root);
mkdirSync(new URL('./', output), { recursive: true });
await build({
    entryPoints: [fileURLToPath(source)],
    outfile: fileURLToPath(output),
    absWorkingDir: fileURLToPath(root),
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    external: ['@bufbuild/protobuf', '@bufbuild/protobuf/*'],
    banner: { js: `// Generated from @connectum/auth@${authVersion} src/proto/reader.ts; do not edit.\n// SPDX-License-Identifier: Apache-2.0` },
});
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const provenance = {
    authVersion,
    esbuildVersion: version,
    sourceSha256: sha256(readFileSync(source)),
    schemaSha256: sha256(readFileSync(new URL('gen/connectum/auth/v1/options_pb.js', authRoot))),
    bundleSha256: sha256(readFileSync(output)),
};
writeFileSync(new URL('./provenance.json', output), `${JSON.stringify(provenance, null, 2)}\n`);
