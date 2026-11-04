import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { documentationRedirects, redirectTarget } from '../.vitepress/data/redirects.ts';
import { movedInterceptorSections } from '../.vitepress/guide/interceptor-sections.ts';
import { guideSections } from '../.vitepress/guide/navigation.ts';
import { movedTestingSections } from '../.vitepress/guide/testing-sections.ts';

const movedSections = [
    ...movedInterceptorSections.map((entry) => ({ ...entry, from: '/en/guide/interceptors/built-in' })),
    ...movedTestingSections.map((entry) => ({ ...entry, from: '/en/guide/testing' })),
];

const args = process.argv.slice(2);
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const base = option('--url', 'http://127.0.0.1:4185');
const output = resolve(option('--output', '.tmp/navigation-browser'));
assert.ok(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to the installed Playwright module.');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const result = {
    completed: false,
    header: [],
    sections: [],
    pages: [],
    redirects: [],
    fallbackFragments: [],
    fragments: [],
    layouts: [],
    keyboard: [],
    search: [],
    static: [],
    errors: [],
};
const deadline = setTimeout(() => {
    console.error('Navigation browser exceeded its five-minute bound.');
    process.exit(1);
}, 300_000);

async function ready(page) {
    await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
}
async function visit(page, route) {
    await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await ready(page);
}
async function at(page, route) {
    const expected = new URL(route, base);
    await page.waitForURL((url) => url.pathname === expected.pathname && url.hash === expected.hash);
    await page.locator('main h1').waitFor();
}
async function openGuides(page) {
    const flyout = page.locator('.VPNavBarMenuGroup').filter({ has: page.getByRole('button', { name: 'Guides', exact: true }) });
    const button = flyout.getByRole('button', { name: 'Guides', exact: true });
    await page.mouse.move(0, 0);
    await button.focus();
    if ((await button.getAttribute('aria-expanded')) !== 'true') await button.press('Enter');
    await flyout.getByRole('link', { name: 'Testing', exact: true }).waitFor({ state: 'visible' });
    return flyout;
}
async function advancedIsOpen(page) {
    const group = page.locator('.VPSidebarItem.level-0').filter({ has: page.getByRole('heading', { name: 'Advanced', exact: true }) });
    assert.equal(await group.count(), 1);
    assert.equal(await group.locator(':scope > .item .caret').count(), 0);
    assert.equal(await group.evaluate((node) => node.classList.contains('collapsed')), false);
    assert.ok(await group.locator(':scope > .items').isVisible());
}

async function uniquePageLinks(menu) {
    const pages = await menu.locator('a[href]').evaluateAll((links) => links.map((link) => new URL(link.href).pathname.replace(/\.(?:md|html)$/, '').replace(/\/$/, '')));
    assert.equal(new Set(pages).size, pages.length, `Duplicate page links in ${await menu.getAttribute('class')}`);
}

async function builderOutline(link) {
    const style = await link.locator(':scope > span').evaluate((span) => ({
        border: getComputedStyle(span).borderTopStyle,
        width: getComputedStyle(span).borderTopWidth,
        height: span.getBoundingClientRect().height,
    }));
    assert.ok(style.border === 'solid' && style.width === '1px' && style.height >= 32, JSON.stringify(style));
}

try {
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({
            colorScheme: theme,
            reducedMotion: 'reduce',
            permissions: ['clipboard-read', 'clipboard-write'],
            viewport: { width: 1440, height: 1000 },
        });
        context.setDefaultTimeout(12_000);
        const page = await context.newPage();
        page.on('pageerror', (error) => result.errors.push(error.message));
        try {
            await visit(page, '/en/guide/about');
            const nav = page.getByRole('navigation', { name: 'Main Navigation', exact: true });
            assert.deepEqual(await nav.locator(':scope > .VPNavBarMenuLink, :scope > .VPNavBarMenuGroup > button').allTextContents(), ['Get started', 'Guides', 'API', 'Builder']);
            await uniquePageLinks(nav);
            await builderOutline(nav.getByRole('link', { name: 'Builder', exact: true }));
            result.header.push({ theme, order: ['Get started', 'Guides', 'API', 'Builder'], outlinedBuilder: true, uniquePages: true });
            for (const [label, route] of [
                ['Get started', '/en/guide/about'],
                ['Builder', '/en/builder'],
                ['API', '/en/api/'],
            ]) {
                await nav.getByRole('link', { name: label, exact: true }).click();
                await at(page, route);
                assert.equal(await nav.getByRole('link', { name: 'GitHub', exact: true }).count(), 0);
                assert.equal(await nav.getByRole('link', { name: 'Packages', exact: true }).count(), 0);
            }
            for (const section of guideSections) {
                if (section.id === 'get-started') await nav.getByRole('link', { name: 'Get started', exact: true }).click();
                else {
                    const flyout = await openGuides(page);
                    assert.deepEqual(
                        await flyout.locator('.menu a').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href'))),
                        guideSections.filter(({ id }) => id !== 'get-started').map((entry) => entry.link),
                    );
                    await flyout.getByRole('link', { name: section.text, exact: true }).click();
                }
                await at(page, section.link);
                await page.waitForFunction((text) => document.querySelector('main h1')?.textContent.includes(text), section.text);
                await advancedIsOpen(page);
                await uniquePageLinks(page.locator('.VPSidebar'));
                assert.ok((await page.locator('.page-context').innerText()).includes(section.text));
                const footer = page.locator('footer.VPFooter');
                assert.ok(await footer.isVisible());
                for (const label of ['Migration', 'Contributing', 'Examples']) assert.ok(await footer.getByRole('link', { name: label, exact: true }).isVisible());
                result.sections.push({ theme, section: section.id, path: new URL(page.url()).pathname, advancedOpen: true, resourceFooter: true });
            }
            await visit(page, '/en/guide/about');
            let flyout = await openGuides(page);
            await page.keyboard.press('Tab');
            assert.ok(await flyout.evaluate((node) => node.contains(document.activeElement)));
            assert.ok(await page.evaluate(() => document.activeElement.matches(':focus-visible')));
            await page.keyboard.press('Escape');
            await page.waitForFunction(() => document.querySelector('.VPNavBarMenuGroup button')?.getAttribute('aria-expanded') === 'false');
            await flyout.getByRole('link', { name: 'Testing', exact: true }).waitFor({ state: 'hidden' });
            assert.equal(await flyout.getByRole('link', { name: 'Testing', exact: true }).isVisible(), false);
            assert.ok(await flyout.getByRole('button', { name: 'Guides', exact: true }).evaluate((node) => node === document.activeElement));
            flyout = await openGuides(page);
            await page.getByRole('link', { name: 'Skip to content', exact: true }).focus();
            await page.waitForFunction(() => document.querySelector('.VPNavBarMenuGroup button')?.getAttribute('aria-expanded') === 'false');
            result.keyboard.push({ theme, enterOpens: true, tabEntersMenu: true, visibleFocus: true, escapeClosesAndRestoresFocus: true, focusOutCloses: true });
            await writeFile(resolve(output, `${theme}-navigation.yml`), await nav.ariaSnapshot());

            const focused = [
                ...['error-handling', 'timeout', 'bulkhead', 'circuit-breaker', 'retry', 'fallback', 'serialization', 'logging'].map((name) => `/en/guide/interceptors/${name}`),
                '/en/guide/testing/unit',
                '/en/guide/testing/integration',
                '/en/guide/testing/e2e',
                '/en/guide/scaffolding-commands',
            ];
            for (const route of focused) {
                await visit(page, route);
                const block = page.locator('main div[class*="language-"]:visible').first();
                if (await block.count()) {
                    assert.ok((await block.locator('code span[style]').count()) > 1, `${route}: native syntax tokens`);
                    const source = await block.locator('code').textContent();
                    await block.getByRole('button', { name: 'Copy Code', exact: true }).click();
                    assert.equal((await page.evaluate(() => navigator.clipboard.readText())).trimEnd(), source.trimEnd());
                }
                assert.equal(await page.locator('main a[href^="/en/packages/"], main a[href^="/en/reference/"]').count(), 0);
                result.pages.push({ theme, route, heading: await page.locator('main h1').innerText(), nativeCodeCopy: !!(await block.count()) });
            }
            for (const entry of documentationRedirects) {
                const hash = entry.from.endsWith('test-fixtures')
                    ? '#descriptor-fidelity'
                    : entry.from.endsWith('events-redis')
                      ? '#redis-protocol'
                      : entry.from.endsWith('service-catalog')
                        ? '#unary-calls'
                        : '';
                await visit(page, `${entry.from}?pm=bun${hash}`);
                const target = redirectTarget(entry, hash);
                await at(page, target);
                assert.equal(new URL(page.url()).searchParams.get('pm'), 'bun');
                if (target.includes('#')) assert.ok((await page.locator(`[id="${target.split('#')[1]}"]`).count()) > 0, target);
                const canonicalLink = page.locator('link[rel="canonical"]');
                const canonical = (await canonicalLink.count()) ? await canonicalLink.getAttribute('href') : null;
                assert.ok(!canonical || !/\/(?:packages|reference)\//.test(canonical));
                result.redirects.push({ theme, from: `${entry.from}${hash}`, to: target, queryPreserved: true });
            }
            for (const hash of ['#unknown-section', '#toString', '#constructor', '#__proto__', '#%E0%A4%A']) {
                const entry = documentationRedirects.find((entry) => entry.from === '/en/packages/core');
                await visit(page, `${entry.from}${hash}`);
                await at(page, entry.to);
                result.fallbackFragments.push({ theme, hash, to: entry.to });
            }
            for (const move of movedSections) {
                await visit(page, `${move.from}?pm=bun#${move.id}`);
                await at(page, move.to);
                assert.equal(new URL(page.url()).searchParams.get('pm'), 'bun');
                result.fragments.push({ theme, from: `${move.from}#${move.id}`, to: move.to, queryPreserved: true });
            }
            await visit(page, '/en/guide/testing');
            await page.evaluate(() => {
                location.hash = 'mock-context';
            });
            await at(page, '/en/guide/testing/integration#mock-context');
            await visit(page, '/en/guide/about');
            const searchStarted = Date.now();
            await page.getByRole('button', { name: 'Search', exact: true }).click();
            await page.locator('#localsearch-input').fill('descriptor mocks');
            const target = page.locator('#localsearch-list a[href*="/en/guide/testing/unit"]').first();
            await target.waitFor({ timeout: 30_000 });
            assert.equal(await page.locator('#localsearch-list a[href*="/en/packages/"], #localsearch-list a[href*="/en/reference/"]').count(), 0);
            await target.click();
            await page.waitForURL('**/en/guide/testing/unit**');
            result.search.push({ theme, canonicalFixtureResult: true, duplicateTreesAbsent: true, milliseconds: Date.now() - searchStarted });

            for (const width of [1440, 1024, 768, 390, 320]) {
                await page.setViewportSize({ width, height: 1000 });
                await visit(page, '/en/guide/about');
                const dimensions = await page.evaluate(() => ({
                    width: innerWidth,
                    document: document.documentElement.scrollWidth,
                    header: document.querySelector('.VPNavBar').scrollWidth,
                }));
                assert.ok(dimensions.document <= width + 1, `Navigation/document overflow: ${JSON.stringify(dimensions)}`);
                if (width >= 768) {
                    flyout = await openGuides(page);
                    assert.ok(await flyout.getByRole('link', { name: 'Advanced', exact: true }).isVisible());
                    await builderOutline(nav.getByRole('link', { name: 'Builder', exact: true }));
                } else {
                    const hamburger = page.getByRole('button', { name: 'mobile navigation', exact: true });
                    await hamburger.click();
                    const screen = page.locator('#VPNavScreen');
                    assert.deepEqual(await screen.locator('.VPNavScreenMenu > .VPNavScreenMenuLink, .VPNavScreenMenu > .VPNavScreenMenuGroup > button').allTextContents(), [
                        'Get started',
                        'Guides',
                        'API',
                        'Builder',
                    ]);
                    await builderOutline(screen.getByRole('link', { name: 'Builder', exact: true }));
                    await screen.getByRole('button', { name: 'Guides', exact: true }).click();
                    assert.equal(await screen.locator('#NavScreenGroup-guides a[href="/en/guide/about"]').count(), 0);
                    await uniquePageLinks(screen.locator('.VPNavScreenMenu'));
                    await page.screenshot({ path: resolve(output, `${theme}-${width}-mobile-menu.png`) });
                    await screen.getByRole('link', { name: 'Testing', exact: true }).click();
                    await at(page, '/en/guide/testing');
                    assert.equal(await hamburger.getAttribute('aria-expanded'), 'false');
                }
                await page.locator('header.VPNav').screenshot({ path: resolve(output, `${theme}-${width}-header.png`) });
                await writeFile(resolve(output, `${theme}-${width}-header.yml`), await page.locator('header.VPNav').ariaSnapshot());
                result.layouts.push({ theme, ...dimensions, menuReachable: true });
            }
            await page.setViewportSize({ width: 1440, height: 1000 });
            await visit(page, '/en/guide/testing');
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: resolve(output, `${theme}-testing.png`) });
            await visit(page, '/en/guide/communication');
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: resolve(output, `${theme}-communication.png`) });
        } catch (error) {
            await writeFile(resolve(output, `${theme}-failure.yml`), await page.locator('body').ariaSnapshot());
            await page.screenshot({ path: resolve(output, `${theme}-failure.png`) });
            throw error;
        } finally {
            await context.close();
        }
    }
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
    try {
        const page = await context.newPage();
        for (const entry of documentationRedirects) {
            await page.goto(`${base}${entry.from}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
            const fallback = page.locator('.compatibility-route');
            assert.ok(await fallback.isVisible());
            assert.equal(await fallback.locator('p a').getAttribute('href'), entry.to);
            assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,follow');
            assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://connectum.dev${entry.to.split('#')[0]}`);
            result.static.push({ from: entry.from, fallback: entry.to, noindex: true });
        }
        await page.goto(`${base}/en/guide/testing`, { waitUntil: 'domcontentloaded' });
        assert.ok((await page.locator('main').innerText()).includes('Unit tests and fixtures'));
        await advancedIsOpen(page);
        await writeFile(resolve(output, 'no-js-testing.yml'), await page.locator('main').ariaSnapshot());
        for (const from of new Set(movedSections.map((entry) => entry.from))) {
            await page.goto(`${base}${from}`, { waitUntil: 'domcontentloaded' });
            const details = page.locator('.moved-guide-sections');
            await details.locator('summary').click();
            for (const entry of movedSections.filter((entry) => entry.from === from)) {
                const link = details.locator(`[id="${entry.id}"] a`);
                assert.ok(await link.isVisible());
                assert.equal(await link.getAttribute('href'), entry.to);
            }
        }
    } finally {
        await context.close();
    }
    assert.deepEqual(result.errors, []);
    result.completed = true;
} catch (error) {
    result.errors.push(error.stack ?? String(error));
    throw error;
} finally {
    clearTimeout(deadline);
    await writeFile(resolve(output, 'report.json'), `${JSON.stringify(result, null, 2)}\n`);
    await browser.close();
}
console.log(
    `Navigation browser: ${result.sections.length} section visits, ${result.pages.length} focused pages, ${result.redirects.length} redirects, ${result.fragments.length} moved fragments, ${result.layouts.length} layouts, ${result.static.length} no-JS routes.`,
);
