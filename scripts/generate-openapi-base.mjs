import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const artifact = '.vitepress/openapi/base/shop/v1/inventory.openapi.json';
const inputs = [
    '.vitepress/openapi/example/proto/shop/v1/inventory.proto',
    '.vitepress/openapi/example/proto/connectum/auth/v1/options.proto',
    '.vitepress/openapi/buf.gen.openapi.yaml',
];

execFileSync(fileURLToPath(new URL('node_modules/.bin/buf', root)), ['generate', '.vitepress/openapi/example', '--template', '.vitepress/openapi/buf.gen.openapi.yaml'], {
    cwd: root,
    stdio: 'inherit',
});
const generated = read(artifact);
const document = JSON.parse(generated);
assert.equal(document.openapi, '3.1.0');
assert.ok(document.paths['/shop.v1.InventoryService/CheckStock'].post);
assert.deepEqual(document.paths['/shop.v1.InventoryService/WatchStock'], {});
// this plugin leaves the required info.version unset; supply the fixture's API version.
document.info.version = '1.0.0';
const output = `${JSON.stringify(document, null, 2)}\n`;
writeFileSync(new URL(artifact, root), output);
const provenance = {
    generator: 'buf.build/community/sudorandom-connect-openapi:v0.25.7',
    authVersion: JSON.parse(read('node_modules/@connectum/auth/package.json')).version,
    fixtureVersion: document.info.version,
    normalization: 'Set the required info.version to the fixture API version; paths and schemas are unchanged.',
    inputs: Object.fromEntries(inputs.map((path) => [path, sha256(read(path))])),
    generatedSha256: sha256(generated),
    artifactSha256: sha256(output),
};
writeFileSync(new URL('.vitepress/openapi/provenance.json', root), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(`Generated ${artifact}; supplied info.version ${document.info.version}.`);
