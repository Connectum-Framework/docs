import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { enConfig } from '../../.vitepress/config/en.ts';
import { publicModules } from '../../.vitepress/data/modules.ts';
import { canonicalDocumentationLink, documentationRedirects, findRedirect, redirectTarget } from '../../.vitepress/data/redirects.ts';
import { movedInterceptorSections } from '../../.vitepress/guide/interceptor-sections.ts';
import { guideSections, guideSidebar, sectionForRoute } from '../../.vitepress/guide/navigation.ts';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const fileFor = (route) => `${route.split('#')[0].slice(1)}${route.split('#')[0].endsWith('/') ? 'index' : ''}.md`;
const flatten = (items) => items.flatMap((item) => [item, ...flatten(item.items ?? [])]);

test('header routes directly to About, Builder, section entries and generated API', () => {
    const nav = enConfig.themeConfig.nav;
    assert.deepEqual(
        nav.map((item) => item.text),
        ['Get started', 'Guides', 'API', 'Builder'],
    );
    assert.equal(nav[0].link, '/en/guide/about');
    assert.equal(nav[2].link, '/en/api/');
    assert.equal(nav[3].link, '/en/builder');
    const gettingStarted = guideSections.find(({ id }) => id === 'get-started');
    assert.ok(gettingStarted);
    assert.ok(!flatten(gettingStarted.items).some((item) => item.link === '/en/builder'));
    assert.deepEqual(
        nav[1].items,
        guideSections.filter(({ id }) => id !== 'get-started').map(({ text, link }) => ({ text, link })),
    );
    assert.equal(guideSections.length, 8);
    assert.equal(new Set(guideSections.map((section) => section.link)).size, guideSections.length);
    assert.ok(!('/en/packages/' in enConfig.themeConfig.sidebar));
    assert.ok(!('/en/reference/' in enConfig.themeConfig.sidebar));
});

test('each header/sidebar tree links each page once, including section headings', () => {
    const uniquePages = (items, menu) => {
        const seen = new Map();
        for (const item of flatten(items)) {
            if (!item.link) continue;
            const page = new URL(item.link, 'https://connectum.dev').pathname.replace(/\.(?:md|html)$/, '').replace(/\/$/, '');
            assert.ok(!seen.has(page), `${menu}: ${item.text} duplicates ${seen.get(page)} at ${page}`);
            seen.set(page, item.text);
        }
    };
    uniquePages(enConfig.themeConfig.nav, 'Header');
    for (const [route, items] of Object.entries(enConfig.themeConfig.sidebar)) uniquePages(items, route);
    assert.equal(flatten(guideSidebar).filter((item) => item.link === '/en/guide/about').length, 1);
    assert.equal(flatten(guideSidebar).filter((item) => item.link === '/en/guide/testing').length, 1);
    assert.match(read('en/guide/about.md'), /# Get started \{#what-is-connectum\}/);
});

test('each section has a real landing page and every topic maps back to its section', () => {
    for (const section of guideSections) {
        const source = read(fileFor(section.link));
        assert.ok(source.includes(`# ${section.text}`) || ['get-started', 'testing'].includes(section.id));
        if (!['get-started', 'testing'].includes(section.id)) {
            assert.match(source, /docType: section/);
            assert.ok(source.includes(`<GuideSection section="${section.id}" />`));
        }
        assert.equal(sectionForRoute(`${section.link}.html`)?.id, section.id);
        for (const item of flatten(section.items)) {
            assert.ok(existsSync(new URL(fileFor(item.link), root)), item.link);
            assert.equal(findRedirect(item.link), undefined, item.link);
            assert.equal(sectionForRoute(item.link)?.id, section.id, item.link);
        }
    }
});

test('Testing is independent and local/network transports belong to Communication, not Advanced', () => {
    const testing = guideSidebar.find((section) => section.text === 'Testing');
    assert.ok(testing);
    for (const leaf of ['unit', 'integration', 'e2e', 'runn', 'scenarigo']) assert.ok(flatten(testing.items).some((item) => item.link === `/en/guide/testing/${leaf}`));
    const advanced = guideSidebar.find((section) => section.text === 'Advanced');
    assert.equal(Object.hasOwn(advanced, 'collapsed'), false);
    for (const route of ['/en/guide/production/in-process-transport', '/en/guide/production/transport-matrix']) {
        assert.equal(sectionForRoute(route)?.id, 'communication');
        assert.ok(!flatten(advanced.items).some((item) => item.link === route));
    }
    assert.ok(!flatten(guideSidebar.find((section) => section.text === 'Build a service').items).some((item) => item.link === '/en/guide/testing'));
});

test('interceptors expose focused guides while preserving custom, filtering and canonical validation', () => {
    const routes = flatten(guideSidebar).map((item) => item.link);
    for (const name of ['built-in', 'error-handling', 'timeout', 'bulkhead', 'circuit-breaker', 'retry', 'fallback', 'serialization', 'logging', 'custom', 'method-filtering']) {
        assert.ok(routes.includes(`/en/guide/interceptors/${name}`));
    }
    assert.equal(routes.filter((route) => route === '/en/guide/validation').length, 1);
    assert.match(read('en/guide/interceptors/fallback.md'), /PermissionDenied/);
    assert.match(read('en/guide/interceptors/fallback.md'), /only message is the fallback/);
    assert.doesNotMatch(read('en/guide/interceptors/fallback.md'), /known defect|Internal\(13\)/);
    assert.match(read('en/guide/interceptors/timeout.md'), /not subsequent iteration/);
    assert.match(read('en/guide/interceptors/retry.md'), /cannot restart an iterator/);
    assert.match(read('en/guide/interceptors/logging.md'), /no request or response body/);
    for (const move of movedInterceptorSections) assert.ok(existsSync(new URL(fileFor(move.to), root)), move.to);
});

test('compatibility routes have captured fragments, no duplicate prose and no redirect chains', () => {
    assert.equal(documentationRedirects.length, 20);
    for (const entry of documentationRedirects) {
        const source = read(fileFor(entry.from));
        assert.match(source, /docType: compatibility/);
        assert.match(source, /search: false/);
        assert.ok(source.includes(`<CompatibilityRedirect from="${entry.from}" />`));
        assert.ok(source.length < 400);
        assert.equal(findRedirect(`${entry.from.replace(/\/$/, '')}.html`), entry);
        assert.ok(Object.keys(entry.fragments).length > 0);
        for (const hash of ['#unrecognized-old-fragment', '#toString', '#constructor', '#__proto__', '#%E0%A4%A']) {
            assert.equal(redirectTarget(entry, hash), entry.to);
        }
        for (const [fragment, target] of Object.entries(entry.fragments)) {
            assert.equal(redirectTarget(entry, `#${encodeURIComponent(fragment)}`), target);
            assert.ok(existsSync(new URL(fileFor(target), root)), target);
            assert.equal(findRedirect(target.split('#')[0]), undefined, target);
            assert.equal(canonicalDocumentationLink(`${entry.from}#${fragment}`), target);
        }
    }
    const catalog = findRedirect('/en/reference/service-catalog');
    assert.equal(redirectTarget(catalog, '#unary-calls'), '/en/guide/service-communication/catalog-configuration#unary-calls');
});

test('unique fixture/Redis behavior is owned by Guides and module cards have no secondary overview destination', () => {
    assert.match(read('en/guide/testing/unit.md'), /JSON\.stringify.*TypeError/);
    assert.match(read('en/guide/testing/unit.md'), /https:\/\/in-memory/);
    assert.match(read('en/guide/events/adapters.md'), /replyMapping: 'resp3'/);
    assert.match(read('en/guide/events/adapters.md'), /before opening any connection/);
    assert.match(read('en/guide/testing/integration.md'), /normal process entry|same.*buildServer|same `buildServer/);
    assert.match(read('en/guide/testing/integration.md'), /real gRPC listener/);
    assert.match(read('en/guide/testing/integration.md'), /stop\(\).*requires `running`/);
    assert.match(read('en/guide/scaffolding.md'), /npx @connectum\/cli init my-service --yes/);
    assert.ok(read('en/guide/scaffolding.md').split(/\s+/).length < 280);
    for (const module of publicModules) {
        assert.equal(Object.hasOwn(module, 'hub'), false);
        assert.ok(existsSync(new URL(fileFor(module.guide), root)), module.guide);
    }
    assert.doesNotMatch(read('.vitepress/theme/components/ModuleGrid.vue'), /module\.hub|>Overview</);
});

test('authored documentation links no longer route through the old package/reference trees', () => {
    function walk(directory) {
        for (const entry of readdirSync(new URL(directory, root), { withFileTypes: true })) {
            if (entry.isDirectory()) {
                if (!['api', 'packages', 'reference'].includes(entry.name)) walk(`${directory}/${entry.name}`);
            } else if (entry.name.endsWith('.md')) {
                assert.doesNotMatch(read(`${directory}/${entry.name}`), /\]\(\/en\/(?:packages|reference)\//, `${directory}/${entry.name}`);
            }
        }
    }
    walk('en');
});

test('navigation changes preserve the exact accepted showcase implementations', () => {
    const hashes = JSON.parse(read('tests/guide/accepted-showcases.json'));
    assert.equal(Object.keys(hashes).length, 12);
    for (const [path, sha256] of Object.entries(hashes)) assert.equal(createHash('sha256').update(read(path)).digest('hex'), sha256, path);
});

test('keyboard dismissal closes the real dropdown and restores its trigger, with lifecycle cleanup', () => {
    const hook = read('.vitepress/theme/useNavigationKeyboard.ts');
    assert.match(hook, /event.key !== 'Escape'/);
    assert.match(hook, /trigger.click\(\)/);
    assert.match(hook, /trigger.focus\(\)/);
    assert.match(hook, /onBeforeUnmount.*removeEventListener/);
    assert.ok(read('.vitepress/theme/Layout.vue').includes('useNavigationKeyboard()'));
    assert.match(read('.vitepress/theme/styles/navigation.css'), /aria-expanded=["']false["']/);
});
