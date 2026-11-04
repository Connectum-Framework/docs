import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { findRedirect, redirectTarget } from '../../.vitepress/data/redirects.ts';
import { guideSidebar } from '../../.vitepress/guide/navigation.ts';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const source = read('en/guide/production/architecture.md');

test('the homepage primary CTA starts learning and its secondary CTA opens the complete architecture', () => {
    const home = read('.vitepress/theme/components/HomePage.vue');
    assert.match(home, /class="home-button home-button--primary" href="\/en\/guide\/about">Get started<\/a>/);
    assert.match(home, /class="home-button home-button--secondary" href="\/en\/guide\/production\/architecture">Explore architecture<\/a>/);
});

test('all three architecture diagrams stay embedded and their implementations remain byte-identical', () => {
    const hashes = JSON.parse(read('tests/guide/architecture-diagrams.json'));
    assert.equal(Object.keys(hashes).length, 6);
    for (const [path, expected] of Object.entries(hashes)) assert.equal(createHash('sha256').update(read(path)).digest('hex'), expected, path);
    assert.equal((source.match(/<GuideOverview :source="overview" \/>/g) ?? []).length, 1);
    assert.equal((source.match(/<RuntimeCompositionDiagram \/>/g) ?? []).length, 1);
    assert.equal((source.match(/<CatalogRoutingDiagram \/>/g) ?? []).length, 1);
    assert.match(source, /assets\/diagrams\/guide\/architecture\.html\?raw/);
});

test('the merged narrative preserves runtime guarantees and follows inputs, execution, calls and deployment', () => {
    assert.equal((source.match(/^# /gm) ?? []).length, 1);
    const order = [
        'Boundary and ownership',
        'Build-time inputs',
        'Runtime composition',
        'Network and in-process parity',
        'Catalog call routing',
        'Extension seams',
        'Deployment boundary',
        'Related',
    ];
    let previous = -1;
    for (const heading of order) {
        const index = source.indexOf(` ${heading}\n`);
        assert.ok(index > previous, heading);
        previous = index;
    }
    for (const fact of [
        'TransportManager',
        'buildRoutes()',
        'createRouterTransport(routes)',
        'serverInterceptors',
        'Client-side interceptors',
        'remoteResolver',
        'allow-listed headers',
        'clamped to the remaining incoming deadline',
        'cannot extend it',
        'outside the RPC interceptor chain',
        'None for Memory',
        'console exporter',
    ])
        assert.ok(source.includes(fact), fact);
    assert.doesNotMatch(source, /architecture-details|<GuideSections|## Go deeper|\[Overview\]/);
    assert.ok(source.includes('id="inside-and-outside"'));
    assert.ok(source.includes('id="go-deeper"'));
    const sidebar = JSON.stringify(guideSidebar);
    assert.ok(!sidebar.includes('architecture-details'));
    assert.equal((sidebar.match(/"link":"\/en\/guide\/production\/architecture"/g) ?? []).length, 1);
});

test('the former detail page redirects every existing section to its canonical heading', () => {
    const entry = findRedirect('/en/guide/production/architecture-details');
    assert.equal(entry.to, '/en/guide/production/architecture');
    assert.equal(Object.keys(entry.fragments).length, 9);
    for (const [id, destination] of Object.entries(entry.fragments)) {
        assert.equal(destination, `${entry.to}#${id}`);
        assert.equal(redirectTarget(entry, `#${id}`), destination);
    }
    assert.match(read('en/guide/production/architecture-details.md'), /docType: compatibility/);
    assert.ok(!JSON.parse(read('.vitepress/guide/sections.json')).some((section) => section.route === entry.to));
    assert.ok(!JSON.parse(read('tests/guide/preserved-sections.json')).some((section) => section.route === entry.to));
});
