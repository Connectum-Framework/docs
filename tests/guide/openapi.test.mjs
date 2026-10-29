import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createFileRegistry, fromBinary } from '@bufbuild/protobuf';
import { FileDescriptorSetSchema } from '@bufbuild/protobuf/wkt';
import { resolveMethodAuth } from '@connectum/auth/proto';
import { resolveMethodAuth as browserReader } from '../../.vitepress/openapi/generated/auth-reader.mjs';
import { renderOutput } from '../../.vitepress/openapi/highlight.ts';
import { overlayMethod, securityFragment } from '../../.vitepress/openapi/overlay.ts';
import { methodDescriptor, runOverlay } from '../../.vitepress/openapi/runtime.ts';
import { annotations, initialSettings, methods, protoSource } from '../../.vitepress/openapi/settings.ts';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const base = JSON.parse(read('.vitepress/openapi/base/shop/v1/inventory.openapi.json'));
const path = '/shop.v1.InventoryService/CheckStock';
const streamPath = '/shop.v1.InventoryService/WatchStock';
const run = (annotation) => runOverlay({ method: 'CheckStock', annotation });

test('OpenAPI starts with a successful public operation, not a missing or rejected operation', () => {
    assert.equal(annotations[0].id, 'public');
    assert.equal(methods[0].id, 'CheckStock');
    assert.deepEqual(initialSettings, { annotation: 'public', method: 'CheckStock' });
    const result = runOverlay(initialSettings);
    assert.equal(result.kind, 'patched');
    assert.deepEqual(result.document.paths[path].post.security, []);
    assert.equal(result.document.paths[path].post['x-connectum-public'], true);
    assert.deepEqual(result.document.components.securitySchemes, {});
    assert.equal(base.openapi, '3.1.0');
    assert.equal(base.paths[path].post.operationId, 'shop.v1.InventoryService.CheckStock');
});

test('changing a real proto option writes Bearer credentials and role/scope metadata into the document', () => {
    const user = run('user');
    assert.equal(user.kind, 'patched');
    assert.equal(user.auth.public, false);
    assert.deepEqual(user.document.paths[path].post.security, [{ bearerAuth: [] }]);
    assert.deepEqual(user.document.components.securitySchemes.bearerAuth, { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' });
    const roles = run('roles');
    assert.equal(roles.kind, 'patched');
    const operation = roles.document.paths[path].post;
    assert.deepEqual(operation['x-connectum-required-roles'], ['warehouse']);
    assert.deepEqual(operation['x-connectum-required-scopes'], ['stock:read']);
    assert.deepEqual(operation.security, [{ bearerAuth: [] }]);
    assert.equal(operation['x-connectum-public'], undefined);
});

test('internal credentials are a separate header scheme and cannot leak into a later public result', () => {
    const internal = run('internal');
    assert.equal(internal.kind, 'patched');
    assert.equal(internal.auth.internal, true);
    assert.deepEqual(internal.document.paths[path].post.security, [{ internalToken: [] }]);
    assert.equal(internal.document.paths[path].post['x-connectum-internal'], true);
    assert.deepEqual(internal.document.components.securitySchemes.internalToken, { type: 'apiKey', in: 'header', name: 'x-internal-token' });
    assert.deepEqual(internal.document.paths[path].post['x-connectum-required-roles'], ['orders']);
    assert.equal(internal.document.components.securitySchemes.bearerAuth, undefined);
    const publicAgain = run('public');
    assert.equal(publicAgain.kind, 'patched');
    assert.equal(publicAgain.document.paths[path].post['x-connectum-internal'], undefined);
    assert.deepEqual(publicAgain.document.components.securitySchemes, {});
});

test('a deny policy remains a deny from the actual reader even though credential security still says Bearer', () => {
    const result = run('deny');
    assert.equal(result.kind, 'patched');
    assert.equal(result.auth.policy, 'deny');
    assert.deepEqual(result.document.paths[path].post.security, [{ bearerAuth: [] }]);
    assert.equal(result.document.paths[path].post['x-connectum-policy'], undefined);
    assert.match(read('.vitepress/theme/components/OpenapiShowcase.vue'), /result\.value\.auth\.policy === 'deny'/);
});

test('the example explicitly refuses contradictory public/internal credentials instead of displaying a stale successful spec', () => {
    const result = run('conflict');
    assert.equal(result.kind, 'rejected');
    assert.match(result.message, /cannot be both public and internal/);
    assert.match(result.message, /example overlay rejects/);
    assert.equal(result.document, undefined);
    assert.equal(result.output, undefined);
    assert.equal(run('public').kind, 'patched');
});

test('a missing streaming POST is skipped before any auth overlay and is never invented', () => {
    assert.deepEqual(base.paths[streamPath], {});
    for (const annotation of annotations) {
        const result = runOverlay({ method: 'WatchStock', annotation: annotation.id });
        assert.equal(result.kind, 'skipped');
        assert.deepEqual(result.document, base);
        assert.equal(result.auth, undefined);
        assert.deepEqual(JSON.parse(result.output), { paths: { [streamPath]: {} } });
    }
});

test('fresh descriptors defeat reader caching across repeat edits without mutating the committed generator output', () => {
    const original = JSON.stringify(base);
    const a = methodDescriptor(initialSettings);
    const b = methodDescriptor(initialSettings);
    assert.notEqual(a, b);
    for (let repeat = 0; repeat < 3; repeat++) {
        for (const annotation of [...annotations].reverse()) {
            const settings = { method: 'CheckStock', annotation: annotation.id };
            const one = runOverlay(settings);
            const two = runOverlay(settings);
            assert.deepEqual(one, two);
        }
    }
    assert.equal(JSON.stringify(base), original);
    assert.deepEqual(JSON.parse(read('.vitepress/openapi/base/shop/v1/inventory.openapi.json')), base);
});

test('the security fragment is derived from the patched document while generated schemas and framing are retained', () => {
    const result = run('roles');
    assert.equal(result.kind, 'patched');
    const operation = result.document.paths[path].post;
    const { security, 'x-connectum-required-roles': roles, 'x-connectum-required-scopes': scopes, ...untouched } = operation;
    assert.deepEqual(untouched, base.paths[path].post);
    assert.deepEqual(result.document.components.schemas, base.components.schemas);
    assert.deepEqual(JSON.parse(result.fullOutput), result.document);
    assert.deepEqual(JSON.parse(result.output), securityFragment(result.document, result.path));
    assert.deepEqual(JSON.parse(result.output).paths[path].post, { security, 'x-connectum-required-roles': roles, 'x-connectum-required-scopes': scopes });
});

test('unknown selections and malformed base documents fail rather than silently showing the default public operation', () => {
    assert.throws(() => runOverlay({ method: 'UnknownMethod', annotation: 'public' }), /Unknown method/);
    assert.throws(() => run('unknown'), /Unknown annotation/);
    assert.throws(() => overlayMethod({}, methodDescriptor(initialSettings)), /no paths object/);
});

test('the vendored authorization schema is exactly the pinned published package input', () => {
    const installed = new URL('../../proto/connectum/auth/v1/options.proto', import.meta.resolve('@connectum/auth/proto'));
    assert.equal(read('.vitepress/openapi/example/proto/connectum/auth/v1/options.proto'), readFileSync(installed, 'utf8'));
});

test('the generated base and its inputs match recorded hashes and include the required fixture API version', () => {
    const provenance = JSON.parse(read('.vitepress/openapi/provenance.json'));
    const hash = (source) => createHash('sha256').update(source).digest('hex');
    assert.equal(provenance.generator, 'buf.build/community/sudorandom-connect-openapi:v0.25.7');
    assert.equal(provenance.authVersion, '1.2.0');
    assert.equal(base.info.version, provenance.fixtureVersion);
    assert.equal(base.info.version, '1.0.0');
    assert.equal(hash(read('.vitepress/openapi/base/shop/v1/inventory.openapi.json')), provenance.artifactSha256);
    for (const [path, expected] of Object.entries(provenance.inputs)) assert.equal(hash(read(path)), expected, path);
});

test('the browser bundle is the unchanged published reader and matches the public Node API for every method and annotation', () => {
    const provenance = JSON.parse(read('.vitepress/openapi/generated/provenance.json'));
    const installed = new URL('../../', import.meta.resolve('@connectum/auth/proto'));
    const hash = (source) => createHash('sha256').update(source).digest('hex');
    assert.equal(provenance.authVersion, '1.2.0');
    assert.equal(hash(readFileSync(new URL('src/proto/reader.ts', installed))), provenance.sourceSha256);
    assert.equal(hash(readFileSync(new URL('gen/connectum/auth/v1/options_pb.js', installed))), provenance.schemaSha256);
    assert.equal(hash(read('.vitepress/openapi/generated/auth-reader.mjs')), provenance.bundleSha256);
    assert.doesNotMatch(read('.vitepress/openapi/generated/auth-reader.mjs'), /node:|AsyncLocalStorage/);
    for (const method of methods)
        for (const annotation of annotations) {
            const descriptor = methodDescriptor({ method: method.id, annotation: annotation.id });
            assert.deepEqual(browserReader(descriptor), resolveMethodAuth(descriptor));
        }
});

test('the Node inspection command executes every non-default annotation and streaming selection with the same result', () => {
    for (const method of methods)
        for (const annotation of annotations) {
            const result = runOverlay({ method: method.id, annotation: annotation.id });
            const cli = spawnSync(process.execPath, ['scripts/inspect-openapi-overlay.mjs', '--method', method.id, '--annotation', annotation.id], { cwd: root, encoding: 'utf8' });
            if (result.kind === 'rejected') {
                assert.equal(cli.status, 1);
                assert.match(cli.stderr, /example overlay rejects/);
                assert.equal(cli.stdout, '');
            } else {
                assert.equal(cli.status, 0, cli.stderr);
                assert.deepEqual(JSON.parse(cli.stdout), result.document);
            }
        }
});

test('live JSON uses the VitePress dual-theme token contract and escapes content rather than forcing a light background', async () => {
    const html = await renderOutput(JSON.stringify({ note: '<img src=x onerror=alert(1)>' }, null, 2));
    assert.match(html, /<pre class="[^"]*vp-code/);
    assert.match(html, /--shiki-dark:/);
    assert.match(html, /--shiki-light:/);
    assert.doesNotMatch(html, /style="background-color:/);
    assert.doesNotMatch(html, /<img/);
    assert.match(html, /(?:&lt;|&#x3C;)img/);
    assert.match(html, /<button title="Copy Code" class="copy"><\/button><span class="lang">json<\/span><pre/);
});

test('explanations name packages without repeating pinned versions and identify the contradictory options', () => {
    const component = read('.vitepress/theme/components/OpenapiShowcase.vue');
    assert.match(component, /<code>@connectum\/auth<\/code>/);
    assert.match(component, /<code>protoc-gen-connect-openapi<\/code>/);
    assert.match(component, /Public and internal conflict/);
    assert.doesNotMatch(component, /\b\d+\.\d+\.\d+\b|older readers|Overlay refused the options/);
    assert.doesNotMatch(read('.vitepress/openapi/example/README.md'), /\b\d+\.\d+\.\d+\b/);
    assert.match(read('en/contributing/documentation-style.md'), /Keep package and tool versions out of explanatory prose and demo labels/);
    assert.equal(run('public').document.info.version, base.info.version);
});

test('every displayed proto snippet compiles to the same effective options as the edited runtime descriptor', () => {
    mkdirSync(new URL('.tmp/', root), { recursive: true });
    const directory = mkdtempSync(fileURLToPath(new URL('.tmp/openapi-proto-', root)));
    const schema = '.vitepress/openapi/example/proto/connectum/auth/v1/options.proto';
    mkdirSync(`${directory}/connectum/auth/v1`, { recursive: true });
    copyFileSync(new URL(schema, root), `${directory}/connectum/auth/v1/options.proto`);
    writeFileSync(`${directory}/buf.yaml`, 'version: v2\nmodules:\n  - path: .\n');
    try {
        for (const method of methods)
            for (const annotation of annotations) {
                const settings = { method: method.id, annotation: annotation.id };
                const proto = `syntax = "proto3";\npackage shop.v1;\nimport "connectum/auth/v1/options.proto";\nservice InventoryService {\n${protoSource(settings)}\n}\nmessage CheckStockRequest { string sku = 1; }\nmessage CheckStockResponse { int32 units = 1; }\n`;
                writeFileSync(`${directory}/inventory.proto`, proto);
                const bytes = execFileSync(fileURLToPath(new URL('node_modules/.bin/buf', root)), ['build', '.', '--as-file-descriptor-set', '-o', '-'], { cwd: directory });
                const registry = createFileRegistry(fromBinary(FileDescriptorSetSchema, bytes));
                const compiled = registry.getService('shop.v1.InventoryService').methods[0];
                const edited = methodDescriptor(settings);
                assert.deepEqual(resolveMethodAuth(compiled), resolveMethodAuth(edited), `${method.id}/${annotation.id}`);
            }
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});

test('the live UI uses executed output and native code blocks while preserving the old section-wide diagram', () => {
    const component = read('.vitepress/theme/components/OpenapiShowcase.vue');
    const composable = read('.vitepress/openapi/useOpenapiDemo.ts');
    assert.match(component, /v-html="output"/);
    assert.match(component, /:disabled="!enabled"/);
    assert.match(component, /aria-live="polite"/);
    assert.match(component, /without JavaScript/);
    assert.match(composable, /runtime\.runOverlay\(settings\)/);
    assert.match(composable, /highlight\.renderOutput\(next\.output\)/);
    assert.match(composable, /current !== generation/);
    assert.match(composable, /onBeforeUnmount/);
    assert.doesNotMatch(composable, /data\.examples|setInterval|setTimeout/);
    const page = read('en/guide/openapi.md');
    assert.match(page, /<OpenapiShowcase\s*\/>/);
    assert.match(page, /data-guide-overview="openapi"/);
    assert.match(page, /## One shared policy reader/);
    assert.match(page, /## Go deeper/);
    assert.match(page, /<GuideSections route="\/en\/guide\/openapi"/);
});
