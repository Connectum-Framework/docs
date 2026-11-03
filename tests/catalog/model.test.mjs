import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { catalogCall, explainRoute, inventoryTypeName, ordersTypeName, scenes } from '../../.vitepress/catalog/model.ts';

test('each scene changes the actual route explanation, configuration and trace', () => {
    const local = explainRoute('local');
    const remote = explainRoute('remote');
    const unavailable = explainRoute('unroutable');
    assert.deepEqual(
        scenes.map((scene) => scene.id),
        ['local', 'remote', 'unroutable'],
    );
    assert.equal(local.kind, 'local');
    assert.equal(remote.kind, 'remote');
    assert.equal(unavailable.kind, 'unavailable');
    assert.match(local.configuration, /services: \[orders, inventory\]/);
    assert.match(remote.configuration, /services: \[orders\]/);
    assert.match(remote.configuration, /inventoryTransport/);
    assert.match(unavailable.configuration, /mapResolver\(\{\}\)/);
    assert.equal(local.result, remote.result);
    assert.equal(unavailable.result, 'Code.Unavailable');
    assert.match(unavailable.steps.at(-1), /No handler runs/);
    for (const scene of [local, remote, unavailable]) assert.equal(scene.steps.length, 3);
    assert.throws(() => explainRoute('unknown'));
});

test('the unchanged call and identities match the complete runnable source', () => {
    const normalize = (text) => text.replace(/\s+/g, '').replace(/,\)/g, ')');
    const server = readFileSync(new URL('../../.vitepress/catalog/example/src/server.ts', import.meta.url), 'utf8');
    const proto = readFileSync(new URL('../../.vitepress/catalog/example/proto/shop/v1/catalog.proto', import.meta.url), 'utf8');
    assert.ok(normalize(server).includes(normalize(catalogCall)));
    assert.equal(ordersTypeName, 'shop.v1.OrdersService');
    assert.equal(inventoryTypeName, 'shop.v1.InventoryService');
    assert.match(proto, /package shop\.v1;/);
    assert.match(proto, /service OrdersService/);
    assert.match(proto, /service InventoryService/);
    assert.match(server, /req\.sku === 'A-1' \? 7 : 0/);
});

test('the compact lesson keeps code before the diagram and details behind a disclosure', () => {
    const component = readFileSync(new URL('../../.vitepress/theme/components/ResolverWalkthrough.vue', import.meta.url), 'utf8');
    const styles = readFileSync(new URL('../../.vitepress/theme/styles/catalog-lesson.css', import.meta.url), 'utf8');
    const picker = component.indexOf('<fieldset');
    const code = component.indexOf('<div class="catalog-call-block">');
    const diagram = component.indexOf('<figure');
    const details = component.indexOf('<details');
    assert.ok(picker < code && code < diagram && diagram < details);
    assert.ok(component.indexOf('aria-label="Call path"') > details);
    assert.ok(component.indexOf('aria-label="Configuration for the selected scene"') > details);
    assert.ok(!component.includes('@click="trace"'), 'The illustration must not require a start button');
    assert.match(styles, /animation: catalog-trace-hop [\d.]+s ease-in-out infinite/);
    assert.match(styles, /prefers-reduced-motion: reduce/);
    assert.match(component, /v-model="paused"/);
    assert.match(component, /'Inventory → Orders'/);
    assert.match(component, /'Inventory was not called'/);
});

test('the complete reference retains all technical topics and the version boundaries', () => {
    const reference = readFileSync(new URL('../../en/reference/service-catalog.md', import.meta.url), 'utf8');
    for (const topic of [
        'Defining services',
        'Configuring the catalog',
        'Generating the catalog',
        'Unary calls',
        'Streaming calls',
        'Cascade behaviour',
        'Header propagation',
        'Outgoing interceptors',
        'Single-image, multiple roles',
        'Calling from outside a handler',
        'Error model',
    ]) {
        assert.ok(reference.includes(topic), `missing full reference topic: ${topic}`);
    }
    for (const boundary of ['Upcoming in 1.3.0', 'client-streaming', 'cause']) assert.ok(reference.includes(boundary), `missing boundary: ${boundary}`);
    assert.ok(reference.includes('is **not** AND-linked'));
    const resolver = readFileSync(new URL('../../en/guide/service-communication/resolvers.md', import.meta.url), 'utf8');
    const example = readFileSync(new URL('../../en/guide/service-communication/routing-example.md', import.meta.url), 'utf8');
    assert.ok(resolver.includes(`\`\`\`ts\n${catalogCall}\n\`\`\``), 'The highlighted call must match the runtime model and the runnable source');
    assert.ok(!example.includes('::: code-group'), 'Concurrent terminal commands must remain visible without JavaScript');
    assert.ok(!/^#{4,6} /m.test(example), 'Example file headings must not skip a level below the main sections');
    for (const path of ['package.json', 'buf.yaml', 'buf.gen.yaml', 'tsconfig.json', 'proto/shop/v1/catalog.proto', 'src/server.ts'])
        assert.ok(example.includes(`example/${path}`));
});

test('catalog formation and request routing have separate learning owners', () => {
    const catalog = readFileSync(new URL('../../en/guide/service-communication/service-catalog.md', import.meta.url), 'utf8');
    const resolver = readFileSync(new URL('../../en/guide/service-communication/resolvers.md', import.meta.url), 'utf8');
    assert.ok(!catalog.includes('ResolverWalkthrough'));
    assert.ok(resolver.includes('<ResolverWalkthrough>'));
    for (const phrase of ['.proto', 'catalog.gen.ts', 'serviceCatalog', 'TypeScript', 'no deployment addresses']) assert.ok(catalog.includes(phrase));
    assert.match(catalog, /not by scanning the network/);
    assert.match(catalog, /does not install|neither starts/);
    assert.ok(catalog.includes(`\`\`\`ts\n${catalogCall}\n\`\`\``));
    assert.match(resolver, /routing-example/);
    assert.match(resolver, /resolver-configuration/);
});
