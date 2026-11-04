import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildProject, provenance } from '../../.vitepress/builder/model.ts';
import { clients, credentials, requestSources } from '../../.vitepress/quickstart/additions/requests/variants.ts';
import { additions, buildQuickstartProject, initCommand, quickstartSelection, scaffoldFileTree } from '../../.vitepress/quickstart/project.ts';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));
const sha256 = (source) => createHash('sha256').update(source).digest('hex');
const prefix = '.vitepress/quickstart/';

test('only the shown edits and verification helpers differ from the actual CLI scaffold', () => {
    const base = buildProject(quickstartSelection);
    const files = buildQuickstartProject();
    assert.deepEqual(
        Object.keys(files)
            .filter((path) => !Object.hasOwn(base, path))
            .sort(),
        [...additions].sort(),
    );
    assert.deepEqual(
        Object.keys(base)
            .filter((path) => base[path] !== files[path])
            .sort(),
        ['package.json', 'src/server.ts'],
    );
    assert.match(initCommand, new RegExp(`@connectum/cli@${provenance.cliVersion} init private-page --auth --otel --yes`));
    assert.match(files['src/server.ts'], /services: \[greeterService, pageService\]/);
    assert.equal(files['src/auth.ts'], base['src/auth.ts'], 'The released CLI already opens its enabled protocol probes.');
    assert.match(files['src/auth.ts'], /methods: protocolMethods, effect: AuthzEffect.ALLOW/);
    for (const method of ['grpc.health.v1.Health/*', 'grpc.reflection.v1.ServerReflection/*', 'grpc.reflection.v1alpha.ServerReflection/*']) {
        assert.ok(files['src/auth.ts'].includes(method));
    }
    assert.match(files['proto/page/v1/page.proto'], /method_auth\) = \{ requires: \{\} \}/);
    assert.doesNotMatch(files['proto/page/v1/page.proto'], /public: true/);
    assert.match(files['src/services/pageService.ts'], /defineService\(PageService/);
    assert.match(files['requests/get-page.sh'], /--http2-prior-knowledge/);
    assert.match(files['requests/get-page.sh'], /Connect-Protocol-Version: 1/);
    assert.match(files['src/index.ts'], /initProvider/);
});

test('project provenance covers every generated source and the target CLI revision', () => {
    const recorded = json(`${prefix}project-provenance.json`);
    assert.equal(recorded.command, initCommand);
    assert.equal(recorded.cliSourceCommit, provenance.sourceCommit);
    assert.equal(recorded.baseRef, provenance.baseRef);
    assert.deepEqual(recorded.sourceHashes, Object.fromEntries(Object.entries(buildQuickstartProject()).map(([path, source]) => [path, sha256(source)])));
});

test('recorded runtime and OpenAPI artifacts cannot drift from their inputs', () => {
    const runtime = json(`${prefix}runtime-provenance.json`);
    assert.equal(runtime.frameworkCommit, provenance.sourceCommit);
    for (const [path, hash] of Object.entries(runtime.artifacts)) assert.equal(sha256(read(prefix + path)), hash, path);
    assert.deepEqual(Object.keys(runtime.artifacts).sort(), ['generated/page_pb.ts', 'project-provenance.json', 'recording.json']);
    const openapi = json(`${prefix}openapi-provenance.json`);
    assert.equal(openapi.generator, 'buf.build/community/sudorandom-connect-openapi:v0.25.7');
    for (const [path, hash] of Object.entries(openapi.inputs)) assert.equal(sha256(read(path)), hash, path);
    assert.equal(openapi.artifactSha256, sha256(read(`${prefix}openapi.json`)));
});

test('recordings contain the exact private-page response, denied cases and observed capabilities', () => {
    const recording = json(`${prefix}recording.json`);
    assert.deepEqual(recording.successful, {
        code: 'OK',
        response: { title: 'Your private page', body: 'This content requires a verified JWT.' },
        protocols: ['Connect HTTP/2', 'gRPC'],
        curl: true,
    });
    assert.deepEqual(recording.missing, { code: 'Unauthenticated', message: 'Missing credentials' });
    assert.deepEqual(recording.invalid, { code: 'Unauthenticated', message: 'Authentication failed' });
    for (const credential of credentials) {
        const curl = recording.wire.curl[credential.id];
        const grpc = recording.wire.grpc[credential.id];
        assert.equal(curl.status, credential.id === 'successful' ? 200 : 401);
        assert.equal(grpc.code, credential.id === 'successful' ? 'OK' : 'Unauthenticated');
        if (credential.id === 'successful') {
            assert.deepEqual(curl.body, recording.successful.response);
            assert.deepEqual(grpc.body, recording.successful.response);
        } else {
            assert.equal(curl.body.code, 'unauthenticated');
            assert.equal(grpc.body.code, 'Unauthenticated');
            assert.equal(curl.body.message, recording[credential.id].message);
            assert.equal(grpc.body.message, recording[credential.id].message);
        }
    }
    assert.deepEqual(recording.health, { status: 'SERVING' });
    assert.ok(recording.reflection.services.includes('page.v1.PageService'));
    assert.deepEqual(recording.otel, { exporter: 'console', spans: ['page.v1.PageService/GetPage'] });
    assert.doesNotMatch(read(`${prefix}recording.json`), /privateKey|Bearer ey|BEGIN.*KEY/);
    const document = json(`${prefix}openapi.json`);
    assert.equal(document.openapi, '3.1.0');
    assert.deepEqual(document.paths['/page.v1.PageService/GetPage'].post.security, [{ bearerAuth: [] }]);
    assert.deepEqual(document.components.securitySchemes.bearerAuth, { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' });
    assert.deepEqual(Object.keys(document.components.schemas['page.v1.GetPageResponse'].properties).sort(), ['body', 'title']);
});

test('the example clearly separates recorded results, handwritten code and setup', () => {
    const component = read('.vitepress/theme/components/QuickstartShowcase.vue');
    const loader = read(`${prefix}showcase.data.ts`);
    assert.match(component, /client = ref<RequestClient>\('curl'\)/);
    assert.match(component, /credential = ref<RequestCredential>\('successful'\)/);
    assert.match(component, /response = shallowRef<[^\n]+>\(null\)/);
    assert.match(component, /response.value = null/);
    assert.match(component, /step.id === 'inspect' && active === 'inspect'/);
    assert.match(component, /response.value = selectedRequest.value/);
    assert.match(component, /watch\(animation.part/);
    assert.match(component, /Send request/);
    assert.doesNotMatch(component, /<aside|quickstart-page/);
    assert.match(component, /does not run a shell, compiler or server/);
    assert.match(component, /init does not create a login service/);
    assert.match(component, /Protocol registration alone does not grant authorization/);
    assert.match(component, /v-html="data\.requests\[0\]\.command"/);
    assert.match(component, /Read every step without JavaScript/);
    assert.match(loader, /handwritten/);
    assert.match(loader, /pnpm start/);
    assert.equal((component.match(/quickstart-registration"[^>]*v-html="data.server"/g) ?? []).length, 2);
    assert.doesNotMatch(component, /step.registration/);
    assert.doesNotMatch(loader, /const registration|id: 'call'|label: 'Call'/);
    assert.equal((loader.match(/label: '(?:Init|Contract|Generate|Handler|Inspect)'/g) ?? []).length, 5);
    assert.doesNotMatch(component, /setInterval|requestAnimationFrame|fetch\(/);
    assert.match(read('en/guide/quickstart.md'), /<QuickstartShowcase \/>/);
    assert.match(read('en/guide/quickstart.md'), /\/en\/guide\/quickstart-manual/);
    assert.match(read('.gitignore'), /\.vitepress\/quickstart\/example\//);
    assert.match(read('.gitignore'), /\.vitepress\/quickstart\/openapi-base\//);
});

test('each emulated client and credential choice produces its own runnable request syntax', () => {
    const source = buildQuickstartProject()['requests/get-page.sh'];
    assert.doesNotMatch(source, /set -eu|BASE_URL|TOKEN:\?/);
    const requests = requestSources(source);
    assert.deepEqual(
        clients.map((client) => client.id),
        ['curl', 'grpcurl'],
    );
    for (const client of clients) {
        for (const credential of credentials) {
            const command = requests[client.id][credential.id];
            assert.match(command, /page\.v1\.PageService\/GetPage/);
            assert.match(command, client.id === 'curl' ? /curl --http2-prior-knowledge/ : /grpcurl -plaintext/);
            if (credential.id === 'missing') assert.doesNotMatch(command, /Authorization|\$TOKEN/);
            else assert.ok(command.includes(credential.id === 'invalid' ? 'Bearer invalid' : 'Bearer $TOKEN'));
        }
    }
    assert.equal(requests.curl.successful, source.trimEnd());
    const otherAddress = requestSources(source, '127.0.0.1:43210');
    assert.match(otherAddress.curl.successful, /http:\/\/127\.0\.0\.1:43210\//);
    assert.match(otherAddress.grpcurl.successful, /127\.0\.0\.1:43210/);
    assert.throws(() => requestSources('curl with missing auth input'), /Review the curl request/);
});

test('native code panes have one scroll owner for code and line numbers', () => {
    const css = read('.vitepress/theme/styles/quickstart-showcase.css');
    assert.match(css, /\.quickstart-code div\[class\*="language-"\][^{]*\{[^}]*max-height: 520px;[^}]*overflow: auto;/);
    assert.match(css, /\.quickstart-code pre[^}]*max-height: none;[^}]*overflow: visible;/);
});

test('each manually selected step animates native code with the landing-page timing helpers', () => {
    const component = read('.vitepress/theme/components/QuickstartShowcase.vue');
    const animation = read(`${prefix}useCodeAnimation.ts`);
    assert.match(component, /animation.finish\(\);\s*active.value = id/);
    assert.match(component, /await nextTick\(\);\s*animation.replay\(\)/);
    assert.match(component, /Play animation/);
    assert.match(component, /Pause animation/);
    assert.match(component, /Replay animation/);
    assert.match(animation, /homepage\/motion.mjs/);
    assert.match(animation, /homepage\/player.mjs/);
    assert.match(animation, /cancelAnimationFrame/);
    assert.match(animation, /IntersectionObserver/);
    assert.match(animation, /prefers-reduced-motion: reduce/);
    assert.match(animation, /visibilitychange/);
    assert.match(animation, /line.element.innerHTML = line.html/);
    assert.doesNotMatch(animation, /setInterval|fetch\(/);
});

test('animation outcomes come from the real init scaffold and generated source, not placeholder terminal output', () => {
    const tree = scaffoldFileTree();
    assert.ok(tree.startsWith('private-page/\n'));
    for (const name of ['package.json', 'auth.ts', 'server.ts', 'greeterService.ts', 'greeter.proto']) assert.ok(tree.includes(name), name);
    assert.doesNotMatch(tree, /pageService\.ts|page_pb\.ts|capture\.ts|node_modules/);
    const component = read('.vitepress/theme/components/QuickstartShowcase.vue');
    assert.match(component, /quickstart-created-files" data-animation-part="1"/);
    assert.match(component, /quickstart-generated" data-animation-part="1"/);
    assert.match(component, /quickstart-startup" data-animation-part="2"/);
    assert.match(component, /part === 1 && active.value === 'inspect' && animation.playing.value\) receive\(\)/);
});
