import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const preserved = JSON.parse(read('tests/guide/preserved-sections.json'));
const sections = JSON.parse(read('.vitepress/guide/sections.json'));

const config = read('.vitepress/config/en.ts');
const declaration = config.slice(config.indexOf('const guideSidebar:'), config.indexOf('const packagesSidebar:'));
const groups = runInNewContext(`${stripTypeScriptTypes(declaration)}\nguideSidebar;`, {}, { timeout: 1000 });
const entryRoutes = [
    ...groups.flatMap((group) => group.items.map((item) => item.link)).filter((route) => route !== '/en/builder'),
    '/en/guide/service-communication/service-catalog',
    '/en/guide/service-communication/resolvers',
];

function withoutDisclosures(markdown) {
    return markdown.replace(/::: details[^\n]*\n[\s\S]*?^:::\s*$/gm, '').replace(/<GuideSections[^>]*\/>/g, '');
}

test('every Guide entry teaches a compact visual model before the detailed path', () => {
    assert.equal(new Set(entryRoutes).size, entryRoutes.length);
    for (const route of entryRoutes) {
        const source = read(`${route.slice(1)}.md`);
        const initial = withoutDisclosures(source);
        assert.match(source, /docType: concept/, route);
        assert.match(initial, /<figure class="technical-diagram(?:\s|")|<ResolverWalkthrough>|<CatalogAssembly \/>/, `${route}: missing readable model`);
        assert.ok(initial.split(/\s+/).length < 650, `${route}: the first reading path has grown into a reference`);
        const maxCodeBlocks = route.endsWith('/service-catalog') ? 4 : 3;
        assert.ok((initial.match(/^```/gm) ?? []).length <= maxCodeBlocks * 2, `${route}: too many initial code blocks`);
        assert.ok((initial.match(/^\|/gm) ?? []).length === 0, `${route}: a dense table is on the initial reading path`);
        assert.match(initial, /\]\(\/en\//, `${route}: no route to the next learning step`);
    }
});

test('moving detailed material preserves the complete source, not just its headings', () => {
    assert.equal(preserved.length, 17);
    for (const page of preserved) {
        const detail = read(`${page.detail.slice(1)}.md`);
        const original = detail.replace(`\n[Overview](${page.route})\n`, '');
        assert.equal(createHash('sha256').update(original).digest('hex'), page.sha256, `${page.detail}: original technical content changed`);
        assert.ok(read(`${page.route.slice(1)}.md`).includes(page.detail), `${page.route}: detailed page is not reachable`);
    }
});

test('compatibility data retains every earlier section and points to its complete owner', () => {
    assert.deepEqual(
        sections,
        preserved.map(({ route, detail, anchors }) => ({ route, detail, anchors })),
    );
    assert.equal(
        sections.reduce((count, page) => count + page.anchors.length, 0),
        243,
    );
    for (const page of sections) {
        assert.ok(read(`${page.route.slice(1)}.md`).includes(`<GuideSections route="${page.route}" />`));
    }
});

test('all detailed destinations remain in the sidebar below an overview', () => {
    const links = [];
    function walk(items, parents = []) {
        for (const item of items) {
            if (item.link) links.push({ route: item.link, parents });
            if (item.items) walk(item.items, item.link ? [...parents, item.link] : parents);
        }
    }
    walk(groups);
    for (const page of sections)
        assert.ok(
            links.some((link) => link.route === page.detail && link.parents.includes(page.route)),
            page.detail,
        );
});

test('the event publication excerpt constructs the full protobuf message required by publish', () => {
    const events = read('en/guide/events.md');
    assert.match(events, /create\(OrderCreatedSchema, \{ orderId: 'order-42' \}\)/);
    assert.ok(!events.includes('await eventBus.publish(OrderCreatedSchema, {'));
});
