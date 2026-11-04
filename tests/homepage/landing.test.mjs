import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { publicModules } from '../../.vitepress/data/modules.ts';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const home = read('.vitepress/theme/components/HomePage.vue');

test('the landing introduces the stack, code and deployment before goals, lifecycle and the unchanged module grid', () => {
    const template = home.slice(home.indexOf('<template>'));
    const markers = ['home-hero', 'home-ecosystem', 'home-example', '<HomeDeployments', 'home-intents', 'home-lifecycle', 'home-modules', 'home-resources'];
    let previous = -1;
    for (const marker of markers) {
        const index = template.indexOf(marker);
        assert.ok(index > previous, `${marker} is missing or out of order`);
        previous = index;
    }
    for (const component of ['EcosystemRail', 'HomeCodeWalkthrough', 'HomeDeployments', 'ModuleGrid']) {
        assert.equal((template.match(new RegExp(`<${component}(?:\\s|>)`, 'g')) ?? []).length, 1, component);
    }
    assert.match(template, /<slot name="server-example"\s*\/>/);
});

test('landing copy explains the added lifecycle and optional policies without changing the approved hero', () => {
    assert.match(home, />Microservices framework</);
    assert.match(home, />Proto is the single source of truth</);
    assert.match(home, /Connectum provides a TypeScript service runtime for proto contracts, request middleware, security, observability, and operations\./);
    assert.match(home, /ConnectRPC supplies the RPC layer/);
    assert.match(home, /shared server lifecycle and optional modules/);
    assert.match(home, /handlers as ordinary functions/);
    assert.match(home, /Configured validation, auth and resilience/);
    assert.match(home, /ConnectRPC alone may be enough/);
    assert.match(home, /Your application keeps its database, business logic and\s+dependency wiring/);
    const deployment = read('.vitepress/homepage/deployment-markup.mjs');
    assert.match(deployment, /generated catalog supplies the types/);
    assert.match(deployment, /Local registration and configured remote resolvers/);
    assert.match(deployment, /illustrate routing; endpoints, credentials and process deployment remain your configuration/);
});

test('landing transitions match the task promised by their labels', () => {
    const goals = [...home.matchAll(/title: '([^']+)',\s+description: '[^']+',\s+link: '([^']+)'/g)].map((match) => match.slice(1));
    assert.deepEqual(goals, [
        ['Build a protected RPC', '/en/guide/quickstart'],
        ['Choose how services communicate', '/en/guide/communication'],
        ['Choose a deployment setup', '/en/guide/deploy'],
        ['Find an exact option', '/en/api/'],
    ]);
    assert.match(home, /href="\/en\/guide\/quickstart-manual">Build a service step by step/);
    assert.match(home, /href="\/en\/guide\/runtime-compatibility-details#compatibility-matrix">Runtime matrix/);
    assert.match(home, /href="\/en\/guide\/production\/architecture#extension-seams">Understand module boundaries/);
    assert.match(read('.vitepress/homepage/deployment-markup.mjs'), /href="\/en\/guide\/service-communication\/resolver-configuration">Configure remote routes/);
});

test('module metadata uses precise adapter sections, the published catalog binary and current example paths', () => {
    for (const [slug, fragment] of [
        ['events-nats', 'nats-jetstream-adapter'],
        ['events-kafka', 'kafka-adapter'],
        ['events-redis', 'redis-streams-adapter'],
        ['events-amqp', 'amqp--rabbitmq-adapter'],
    ])
        assert.equal(publicModules.find((module) => module.slug === slug).guide, `/en/guide/events/adapters#${fragment}`);
    assert.deepEqual(publicModules.find((module) => module.slug === 'protoc-gen-catalog').entryPoints, ['protoc-gen-connectum-catalog']);
    assert.equal(publicModules.find((module) => module.slug === 'reflection').summary, 'gRPC Server Reflection for schema inspection and client tooling.');
    for (const [slug, example] of [
        ['auth', 'car-sharing'],
        ['events-nats', 'with-events-dlq'],
    ]) {
        assert.equal(publicModules.find((module) => module.slug === slug).example, `https://github.com/Connectum-Framework/examples/tree/main/${example}`);
    }
    assert.equal(
        Object.hasOwn(
            publicModules.find((module) => module.slug === 'testing'),
            'example',
        ),
        false,
    );
});

test('documentation validation accepts real module fragments and rejects missing pages and fragments', () => {
    for (const [guide, expected] of [
        ['/en/guide/events/adapters#nats-jetstream-adapter', null],
        ['/en/guide/events/adapters#missing-adapter-section', 'missing guide fragment'],
        ['/en/guide/missing-adapter-page#nats-jetstream-adapter', 'missing guide destination'],
    ]) {
        const result = spawnSync(
            process.execPath,
            [
                '--input-type=module',
                '-e',
                `
            import { publicModules } from './.vitepress/data/modules.ts';
            publicModules.find((module) => module.slug === 'events-nats').guide = ${JSON.stringify(guide)};
            await import('./scripts/docs-validate.mjs');
        `,
            ],
            { cwd: root, encoding: 'utf8' },
        );
        assert.equal(result.status, expected ? 1 : 0, result.stderr);
        if (expected) assert.ok(result.stderr.includes(`@connectum/events-nats: ${expected} ${guide}`), result.stderr);
    }
});
