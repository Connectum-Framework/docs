import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { projectArchive } from '../../.vitepress/builder/archive.ts';
import {
    buildProject,
    changedFiles,
    compactDiff,
    defaultSelection,
    diffLines,
    nameError,
    PROTO_PATH,
    packageManagers,
    previewFiles,
    runCommands,
    scaffoldCommand,
    visiblePreviewFiles,
} from '../../.vitepress/builder/model.ts';

test('base project has real scripts, a handler, default validation and no optional modules', () => {
    const selection = defaultSelection();
    const files = buildProject(selection);
    const pkg = JSON.parse(files['package.json']);
    assert.equal(pkg.name, 'my-service');
    assert.equal(Object.hasOwn(pkg, 'author'), false);
    assert.equal(pkg.scripts.start, 'buf generate && node src/index.ts');
    assert.match(files['src/server.ts'], /createDefaultInterceptors\(\)/);
    assert.match(files['src/services/greeterService.ts'], /Hello/);
    assert.equal(files['src/auth.ts'], undefined);
    assert.match(scaffoldCommand(selection), /@connectum\/cli@1\.3\.0 init my-service/);
    assert.equal(runCommands(selection), 'cd my-service\npnpm install\npnpm run start');
});

test('Bun uses bun; Node.js only offers npm and pnpm', () => {
    assert.deepEqual(packageManagers('bun'), ['bun']);
    assert.deepEqual(packageManagers('node'), ['pnpm', 'npm']);
    for (const runtime of ['node', 'bun'])
        for (const packageManager of ['pnpm', 'npm', 'bun'])
            for (const nodeExec of ['raw', 'tsx']) {
                const selection = { ...defaultSelection(), runtime, packageManager, nodeExec };
                if (!packageManagers(runtime).includes(packageManager)) {
                    assert.throws(() => buildProject(selection));
                    assert.throws(() => scaffoldCommand(selection));
                    assert.throws(() => runCommands(selection));
                    continue;
                }
                const files = buildProject(selection);
                const pkg = JSON.parse(files['package.json']);
                assert.equal(pkg.scripts.start, `buf generate && ${runtime === 'bun' ? 'bun' : nodeExec === 'tsx' ? 'tsx' : 'node'} src/index.ts`);
                assert.equal(Boolean(files['pnpm-workspace.yaml']), packageManager === 'pnpm');
                assert.match(scaffoldCommand(selection), new RegExp(`--runtime ${runtime}`));
                assert.match(scaffoldCommand(selection), new RegExp(`--package-manager ${packageManager}`));
                assert.equal(scaffoldCommand(selection).includes('--node-exec'), runtime === 'node');
                assert.ok(runCommands(selection).endsWith(`${packageManager} run start`));
            }
});

test('each capability changes wiring, dependencies and real project files', () => {
    const plain = buildProject(defaultSelection());
    for (const module of ['auth', 'otel', 'catalog', 'events']) {
        const selection = { ...defaultSelection(), [module]: true };
        const files = buildProject(selection);
        const pkg = JSON.parse(files['package.json']);
        assert.notDeepEqual(files, plain);
        assert.ok(changedFiles(plain, files).includes('src/server.ts'));
        if (module === 'auth') {
            assert.match(files['src/auth.ts'], /createJwtAuthInterceptor/);
            assert.match(files[PROTO_PATH], /public: true/);
            assert.equal(pkg.dependencies['@connectum/auth'], '^1.3.0');
        } else if (module === 'otel') {
            assert.match(files['src/index.ts'], /initProvider/);
            assert.match(files['src/server.ts'], /createOtelInterceptor/);
        } else if (module === 'catalog') {
            assert.match(files['buf.gen.yaml'], /protoc-gen-connectum-catalog/);
            assert.ok(pkg.devDependencies['@connectum/protoc-gen-catalog']);
        } else {
            assert.match(files['src/greeterEventBus.ts'], /NatsAdapter/);
            assert.ok(files['tests/e2e/events.test.ts']);
        }
    }
});

test('every event adapter is wired and every resilience choice reaches the generated chain', () => {
    for (const [adapter, symbol] of [
        ['nats', 'NatsAdapter'],
        ['kafka', 'KafkaAdapter'],
        ['redpanda', 'KafkaAdapter'],
        ['redis', 'RedisAdapter'],
        ['amqp', 'AmqpAdapter'],
    ]) {
        const selection = { ...defaultSelection(), events: true, adapter, resilience: ['timeout', 'retry', 'circuitBreaker', 'bulkhead'] };
        const files = buildProject(selection);
        assert.match(files['src/greeterEventBus.ts'], new RegExp(symbol));
        for (const name of selection.resilience) assert.ok(files['src/server.ts'].includes(`${name}: true`));
        assert.ok(scaffoldCommand(selection).includes(`--events ${adapter}`));
        assert.ok(scaffoldCommand(selection).includes('--resilience timeout,retry,circuitBreaker,bulkhead'));
    }
});

test('protecting SayHello changes the proto and its test, not an invented CLI flag', () => {
    const publicSelection = { ...defaultSelection(), auth: true };
    const publicFiles = buildProject(publicSelection);
    const privateFiles = buildProject({ ...publicSelection, publicHello: false });
    assert.doesNotMatch(privateFiles[PROTO_PATH], /public: true/);
    assert.match(privateFiles[PROTO_PATH], /method_auth\) = \{ requires: \{\} \}/);
    assert.match(privateFiles['tests/e2e/e2e.test.ts'], /sayHello requires authentication/);
    assert.doesNotMatch(privateFiles['tests/e2e/e2e.test.ts'], /sayHello is public/);
    assert.match(privateFiles['README.md'], /SayHello uses `requires: \{\}`/);
    assert.match(privateFiles['README.md'], /SayGoodbye keeps the scaffold's default-deny policy/);
    assert.match(privateFiles['tests/e2e/authenticated.test.ts'], /startTestJwksServer/);
    assert.match(privateFiles['tests/e2e/authenticated.test.ts'], /Code.PermissionDenied/);
    const manifest = JSON.parse(privateFiles['package.json']);
    assert.equal(manifest.devDependencies['@connectrpc/connect-node'], manifest.dependencies['@connectrpc/connect']);
    assert.equal(scaffoldCommand(publicSelection), scaffoldCommand({ ...publicSelection, publicHello: false }));
    assert.deepEqual(changedFiles(publicFiles, privateFiles).sort(), ['README.md', 'package.json', PROTO_PATH, 'tests/e2e/e2e.test.ts', 'tests/e2e/authenticated.test.ts'].sort());
});

test('unsafe, reserved and incomplete names cannot reach command output or project files', () => {
    for (const name of ['', '../escape', '-bad', 'MyService', 'hello world', 'service;echo x', '$(whoami)', 'fs', 'node_modules', 'x'.repeat(101)]) {
        assert.ok(nameError(name), name);
        assert.throws(() => buildProject({ ...defaultSelection(), name }));
        assert.throws(() => scaffoldCommand({ ...defaultSelection(), name }));
    }
    assert.equal(nameError('payments-api'), null);
});

test('diffs preserve both versions, including duplicate blank lines and removed files', () => {
    for (const [before, after] of [
        ['a\n\nb\n', 'a\nnew\n\nb\n'],
        ['a\nb\n', 'a\n'],
        ['', 'new\n'],
        ['gone\n', ''],
    ]) {
        const rows = diffLines(before, after);
        assert.equal(
            rows
                .filter((row) => row.kind !== 'added')
                .map((row) => row.text)
                .join('\n'),
            before.trimEnd(),
        );
        assert.equal(
            rows
                .filter((row) => row.kind !== 'removed')
                .map((row) => row.text)
                .join('\n'),
            after.trimEnd(),
        );
    }
});

test('modification list contains only changed application/configuration files, not framework or support files', () => {
    const baseline = buildProject(defaultSelection());
    const files = buildProject({ ...defaultSelection(), auth: true, events: true, catalog: true, otel: true });
    const paths = previewFiles(baseline, files);
    assert.equal(paths[0], 'src/server.ts');
    assert.ok(paths.includes('package.json'));
    assert.ok(paths.includes('src/auth.ts'));
    assert.ok(paths.includes(PROTO_PATH));
    assert.ok(paths.every((path) => !/Docker|ignore|README|tests\/|proto\/connectum\//.test(path)));
    assert.ok(files['proto/connectum/events/v1/options.proto']);
    assert.ok(files['tests/e2e/events.test.ts']);
    assert.deepEqual(previewFiles(baseline, baseline), []);
});

test('base application files stay visible after runtime, package manager, name and capability changes', () => {
    const baseline = buildProject(defaultSelection());
    const corePaths = ['src/server.ts', 'src/index.ts', 'src/services/greeterService.ts', PROTO_PATH];
    for (const changes of [
        {},
        { runtime: 'bun', packageManager: 'bun' },
        { packageManager: 'npm' },
        { name: 'my-service1' },
        { auth: true },
        { otel: true },
        { events: true, adapter: 'kafka' },
        { catalog: true },
    ]) {
        const files = buildProject({ ...defaultSelection(), ...changes });
        const visible = visiblePreviewFiles(files);
        for (const path of corePaths) assert.ok(visible.includes(path), `${path} hidden for ${JSON.stringify(changes)}`);
        assert.ok(visible.every((path) => !/Docker|ignore|README|tests\/|proto\/connectum\//.test(path)));
        const modified = previewFiles(baseline, files);
        assert.ok(visible.length > modified.length);
        for (const path of corePaths) {
            const rows = compactDiff(baseline[path], files[path]);
            assert.ok(rows.length > 0, `${path} has no code`);
            if (baseline[path] === files[path]) {
                assert.ok(rows.every((row) => row.kind === 'same'));
                assert.equal(rows.map((row) => row.text).join('\n'), files[path].trimEnd());
            }
        }
    }
    assert.ok(!previewFiles(baseline, buildProject({ ...defaultSelection(), runtime: 'bun', packageManager: 'bun' })).includes('src/server.ts'));
});

test('transport changes stay additions relative to the original service, never replacements of the previous transport', () => {
    const baseline = buildProject(defaultSelection());
    const path = 'src/greeterEventBus.ts';
    for (const adapter of ['nats', 'kafka', 'redpanda', 'redis', 'amqp', 'nats']) {
        const files = buildProject({ ...defaultSelection(), events: true, adapter });
        const rows = compactDiff(baseline[path] ?? '', files[path]);
        assert.ok(rows.every((row) => row.kind === 'added'));
        assert.ok(rows.some((row) => row.text.includes('Adapter')));
    }
    const files = buildProject({ ...defaultSelection(), auth: true, otel: true });
    const rows = compactDiff(baseline['src/server.ts'], files['src/server.ts']);
    assert.ok(rows.some((row) => row.kind === 'added' && row.text.includes('buildAuthInterceptors')));
    assert.ok(rows.some((row) => row.kind === 'added' && row.text.includes('createOtelInterceptor')));
});

test('compact diffs retain changes and nearby context without a wall of unchanged lines', () => {
    const before = Array.from({ length: 80 }, (_, index) => `line ${index}`).join('\n');
    const after = before.replace('line 40', 'changed');
    const rows = compactDiff(before, after);
    assert.ok(rows.length < 15);
    assert.equal(rows.filter((line) => line.kind === 'gap').length, 2);
    assert.ok(rows.some((line) => line.kind === 'added' && line.text === 'changed'));
    assert.ok(rows.some((line) => line.kind === 'removed' && line.text === 'line 40'));
});

test('the download is a valid ZIP containing every configured file byte-for-byte', async () => {
    const selection = { ...defaultSelection(), auth: true, otel: true, events: true, catalog: true, publicHello: false };
    const files = buildProject(selection);
    const bytes = projectArchive(selection.name, files);
    const directory = await mkdtemp(join(tmpdir(), 'connectum-builder-'));
    try {
        const { writeFile } = await import('node:fs/promises');
        const archive = join(directory, 'project.zip');
        await writeFile(archive, bytes);
        execFileSync('unzip', ['-t', archive]);
        execFileSync('unzip', ['-q', archive, '-d', directory]);
        for (const [path, content] of Object.entries(files)) assert.equal(await readFile(join(directory, selection.name, path), 'utf8'), content, path);
        assert.throws(() => projectArchive('test', { '../outside': 'no' }));
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});
