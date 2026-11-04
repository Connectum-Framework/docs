import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root));
const hash = (value) => createHash('sha256').update(value).digest('hex');
execFileSync(fileURLToPath(new URL('node_modules/.bin/buf', root)), ['generate', '.vitepress/quickstart/example', '--template', '.vitepress/quickstart/buf.gen.openapi.yaml'], {
    cwd: root,
    stdio: 'inherit',
});
const base = new URL('.vitepress/quickstart/openapi-base/page/v1/page.openapi.json', root);
const generated = readFileSync(base);
const document = JSON.parse(generated);
const require = createRequire(new URL('.vitepress/quickstart/example/package.json', root));
const { resolveMethodAuth } = await import(pathToFileURL(require.resolve('@connectum/auth/proto')).href);
const { PageService } = await import(new URL('.vitepress/quickstart/example/gen/page/v1/page_pb.ts', root).href);
const auth = resolveMethodAuth(PageService.method.getPage);
assert.ok(auth.requires && !auth.public);
assert.equal(document.openapi, '3.1.0');
const operation = document.paths['/page.v1.PageService/GetPage'].post;
assert.ok(operation);
document.info.version = '1.0.0';
document.components ??= {};
document.components.securitySchemes = { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } };
operation.security = [{ bearerAuth: [] }];
const output = `${JSON.stringify(document, null, 2)}\n`;
writeFileSync(new URL('.vitepress/quickstart/openapi.json', root), output);
const inputs = [
    '.vitepress/quickstart/additions/proto/page/v1/page.proto',
    '.vitepress/quickstart/buf.gen.openapi.yaml',
    '.vitepress/quickstart/generated/page_pb.ts',
    '.vitepress/quickstart/runtime-provenance.json',
    'scripts/generate-quickstart-openapi.mjs',
];
writeFileSync(
    new URL('.vitepress/quickstart/openapi-provenance.json', root),
    `${JSON.stringify(
        {
            generator: 'buf.build/community/sudorandom-connect-openapi:v0.25.7',
            inputs: Object.fromEntries(inputs.map((path) => [path, hash(read(path))])),
            generatedSha256: hash(generated),
            artifactSha256: hash(output),
        },
        null,
        2,
    )}\n`,
);
console.log('Generated Page OpenAPI and applied the method authorization reader.');
