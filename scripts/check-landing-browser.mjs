import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { publicModules } from '../.vitepress/data/modules.ts';
import { findRedirect } from '../.vitepress/data/redirects.ts';
import { checkHttpLink } from './lib/package-readme-links.mjs';

const { values } = parseArgs({ options: { url: { type: 'string', default: 'http://127.0.0.1:4185' }, output: { type: 'string', default: '.tmp/landing-browser' } } });
assert.ok(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs. This check starts no server.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href);
const base = new URL(values.url);
const output = resolve(values.output);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = { completed: false, site: base.href, layouts: [], clicks: [], keyboard: [], static: [], links: [], errors: [] };
const deadline = setTimeout(() => void browser.close(), 300_000);
const sectionOrder = ['home-hero', 'home-ecosystem', 'home-example', 'home-deployments', 'home-intents', 'home-lifecycle', 'home-modules', 'home-resources'];
const pages = new Map();
const links = new Set();

async function fetchPage(url) {
    const key = new URL(url);
    key.hash = '';
    if (!pages.has(key.href)) {
        pages.set(
            key.href,
            (async () => {
                const response = await fetch(key, { signal: AbortSignal.timeout(20_000), headers: { 'user-agent': 'Connectum-documentation-link-check' } });
                return { status: response.status, html: await response.text(), finalUrl: response.url };
            })(),
        );
    }
    return pages.get(key.href);
}

async function visit(page) {
    await page.goto(new URL('/en/', base).href, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
    await page.locator('.home-code[data-phase="ready"]').waitFor();
    await page.locator('.home-deployments[data-phase="ready"]').waitFor();
    assert.ok((await page.locator('.home-code button').count()) >= 5);
    assert.ok((await page.locator('.deployment-controls button').count()) >= 3);
}

async function checkOrder(page) {
    const sections = await page.locator('.connectum-home > section').evaluateAll((nodes) =>
        nodes.map((node) => ({
            name: [...node.classList].find((name) => name !== 'home-section' && name.startsWith('home-')),
            top: node.getBoundingClientRect().top + scrollY,
            bottom: node.getBoundingClientRect().bottom + scrollY,
            labelled: Boolean(document.getElementById(node.getAttribute('aria-labelledby'))?.textContent.trim()),
        })),
    );
    assert.deepEqual(
        sections.map((section) => section.name),
        sectionOrder,
    );
    for (const [index, section] of sections.entries()) {
        assert.ok(section.labelled, `${section.name} has no accessible heading`);
        if (index) assert.ok(section.top >= sections[index - 1].bottom - 1, `${section.name} overlaps the previous section`);
    }
    return sections;
}

try {
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
        context.setDefaultTimeout(20_000);
        const page = await context.newPage();
        page.on('pageerror', (error) => report.errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') report.errors.push(message.text());
        });
        try {
            await visit(page);
            assert.equal(await page.locator('html').evaluate((node) => node.classList.contains('dark')), theme === 'dark');
            for (const href of await page.locator('.connectum-home a[href], .VPNav a[href], footer a[href]').evaluateAll((nodes) => nodes.map((node) => node.href)))
                links.add(href);
            assert.equal(await page.locator('.module-card').count(), 15);
            const ecosystem = await page.locator('.home-ecosystem').innerText();
            assert.ok(ecosystem.includes('ConnectRPC supplies the RPC layer.'));
            assert.ok(ecosystem.includes('optional modules'));
            assert.ok((await page.locator('.home-lifecycle').innerText()).includes('ConnectRPC alone may be enough.'));
            for (const width of [1440, 768, 390, 320]) {
                await page.setViewportSize({ width, height: 1000 });
                const sections = await checkOrder(page);
                const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
                assert.ok(documentWidth <= width + 1, `${theme}/${width}: horizontal overflow ${documentWidth}`);
                await writeFile(resolve(output, `${theme}-${width}.yml`), await page.locator('.connectum-home').ariaSnapshot());
                for (const name of ['home-ecosystem', 'home-example', 'home-deployments', 'home-intents', 'home-lifecycle']) {
                    await page.locator(`.${name}`).screenshot({ path: resolve(output, `${theme}-${width}-${name}.png`) });
                }
                report.layouts.push({ theme, width, documentWidth, sections });
            }
            await page.setViewportSize({ width: 1440, height: 1000 });
            const goalLinks = page.locator('.home-goal-grid a');
            await goalLinks.first().focus();
            for (let index = 0; index < 4; index++) {
                assert.ok(await goalLinks.nth(index).evaluate((node) => document.activeElement === node));
                const focus = await goalLinks.nth(index).evaluate((node) => ({
                    visible: node.matches(':focus-visible'),
                    outline: getComputedStyle(node).outlineStyle,
                    outlineWidth: getComputedStyle(node).outlineWidth,
                    width: node.getBoundingClientRect().width,
                    height: node.getBoundingClientRect().height,
                }));
                assert.ok(focus.visible && focus.outline !== 'none' && Number.parseFloat(focus.outlineWidth) > 0, JSON.stringify(focus));
                assert.ok(focus.width >= 24 && focus.height >= 24);
                report.keyboard.push({ theme, index, ...focus });
                await page.keyboard.press('Tab');
            }
            assert.ok(await page.locator('.home-lifecycle a').evaluate((node) => document.activeElement === node));
            for (const [selector, destination] of [
                ['.home-goal-card:nth-child(1)', '/en/guide/quickstart'],
                ['.home-goal-card:nth-child(2)', '/en/guide/communication'],
                ['.home-goal-card:nth-child(3)', '/en/guide/deploy'],
                ['.home-goal-card:nth-child(4)', '/en/api/'],
                ['.home-example a:first-child', '/en/guide/quickstart-manual'],
                ['.home-support a', '/en/guide/runtime-compatibility-details#compatibility-matrix'],
                ['.deployment-copy a:last-child', '/en/guide/service-communication/resolver-configuration'],
                ['.home-modules > .home-section__more a', '/en/guide/production/architecture#extension-seams'],
                ['.module-card a[href$="#nats-jetstream-adapter"]', '/en/guide/events/adapters#nats-jetstream-adapter'],
                ['.module-card a[href$="#kafka-adapter"]', '/en/guide/events/adapters#kafka-adapter'],
                ['.module-card a[href$="#redis-streams-adapter"]', '/en/guide/events/adapters#redis-streams-adapter'],
                ['.module-card a[href$="#amqp--rabbitmq-adapter"]', '/en/guide/events/adapters#amqp--rabbitmq-adapter'],
            ]) {
                await visit(page);
                await page.locator(selector).first().click();
                const expected = new URL(destination, base);
                await page.waitForURL((url) => url.pathname === expected.pathname && url.hash === expected.hash);
                await page.locator('.connectum-home').waitFor({ state: 'detached' });
                await page.locator('main h1').waitFor();
                if (expected.hash) await page.locator(`[id="${expected.hash.slice(1)}"]`).waitFor({ state: 'visible' });
                report.clicks.push({ theme, destination, title: await page.locator('main h1').innerText() });
            }
        } catch (error) {
            await page.screenshot({ path: resolve(output, `${theme}-failure.png`) });
            throw error;
        } finally {
            await context.close();
        }
        const staticContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: theme, viewport: { width: 390, height: 950 } });
        try {
            const staticPage = await staticContext.newPage();
            await staticPage.goto(new URL('/en/', base).href);
            const renderedTheme = await staticPage.locator('html').evaluate((node) => (node.classList.contains('dark') ? 'dark' : 'light'));
            await checkOrder(staticPage);
            assert.equal(await staticPage.locator('.module-card').count(), 15);
            assert.ok(await staticPage.locator('.home-code pre').first().isVisible());
            assert.ok(await staticPage.locator('.deployment-static--compact').isVisible());
            await staticPage.locator('.home-goal-card').first().click();
            await staticPage.waitForURL(new URL('/en/guide/quickstart', base).href);
            assert.ok((await staticPage.locator('h1').innerText()).includes('First Connectum Service'));
            report.static.push({ colorScheme: theme, renderedTheme, sections: sectionOrder, cards: 15, tutorialLinkWorks: true });
        } finally {
            await staticContext.close();
        }
    }
    for (const module of publicModules) {
        for (const href of [module.guide, module.api, module.source, module.example].filter(Boolean)) links.add(new URL(href, base).href);
    }
    for (const href of links) {
        const url = new URL(href);
        if (url.origin === base.origin) assert.equal(findRedirect(url.pathname), undefined, `Landing links through a compatibility route: ${href}`);
        const result = await checkHttpLink(url, fetchPage);
        report.links.push({ href, ...result });
        if (!result.ok) report.errors.push(`${href}: ${result.reason}`);
    }
    assert.deepEqual(report.errors, []);
    report.completed = true;
} catch (error) {
    report.errors.push(error.stack ?? String(error));
    throw error;
} finally {
    clearTimeout(deadline);
    try {
        await writeFile(resolve(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    } finally {
        await browser.close();
    }
}
console.log(
    `Landing: ${report.layouts.length} layouts, ${report.clicks.length} intentional transitions, keyboard in both themes, ${report.static.length} no-JS fallbacks (actual themes recorded); ${report.links.length} rendered/metadata links with HTTP and fragments checked.`,
);
