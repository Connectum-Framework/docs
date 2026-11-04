import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { findRedirect } from '../.vitepress/data/redirects.ts';

const { values } = parseArgs({ options: { url: { type: 'string', default: 'http://127.0.0.1:4185' }, output: { type: 'string', default: '.tmp/architecture-browser' } } });
assert.ok(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs. This check starts no server.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href);
const output = resolve(values.output);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = { completed: false, cta: [], diagrams: [], fragments: [], static: [], errors: [] };
const deadline = setTimeout(() => void browser.close(), 240_000);
const canonical = '/en/guide/production/architecture';
const legacy = findRedirect(`${canonical}-details`);
const captureStyle = 'header.VPNav, .VPLocalNav { visibility: hidden !important; }';

async function visit(page, route) {
    await page.goto(`${values.url}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
}

async function checkDiagrams(page) {
    const main = page.locator('main');
    await main.locator('.technical-diagram').nth(2).waitFor();
    assert.equal(await main.locator('h1').count(), 1);
    assert.equal(await main.locator('.technical-diagram').count(), 3);
    assert.equal(await main.locator('.technical-diagram svg').count(), 3);
    assert.equal(await main.locator('.guide-sections').count(), 0);
    assert.equal(await main.locator('a[href*="architecture-details"]').count(), 0);
    const images = main.locator('.technical-diagram svg');
    for (const image of await images.all()) {
        assert.equal(await image.getAttribute('role'), 'img');
        const ids = (await image.getAttribute('aria-labelledby')).split(/\s+/);
        for (const id of ids) assert.ok((await page.locator(`[id="${id}"]`).textContent()).trim());
    }
}

try {
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
        context.setDefaultTimeout(20_000);
        const page = await context.newPage();
        page.on('pageerror', (error) => report.errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') report.errors.push(message.text());
        });
        try {
            for (const width of [1440, 390]) {
                await page.setViewportSize({ width, height: 1000 });
                await visit(page, '/en/');
                const primary = page.locator('.home-actions .home-button--primary');
                const secondary = page.locator('.home-actions .home-button--secondary');
                assert.equal(await primary.innerText(), 'Get started');
                assert.equal(await primary.getAttribute('href'), '/en/guide/about');
                assert.equal(await secondary.innerText(), 'Explore architecture');
                assert.equal(await secondary.getAttribute('href'), canonical);
                await page.locator('.home-hero').screenshot({ path: resolve(output, `${theme}-${width}-hero.png`), style: captureStyle });
                await primary.focus();
                await primary.press('Enter');
                await page.waitForURL(`**/en/guide/about`);
                await page.waitForFunction(() => document.querySelector('main h1')?.textContent.includes('Get started'));
                assert.ok((await page.locator('main h1').innerText()).includes('Get started'));
                await visit(page, '/en/');
                await secondary.focus();
                await secondary.press('Enter');
                await page.waitForURL(`**${canonical}`);
                await checkDiagrams(page);
                report.cta.push({ theme, width, primary: '/en/guide/about', secondary: canonical, keyboardNavigation: true });

                const dimensions = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
                assert.ok(dimensions.document <= width + 1, JSON.stringify(dimensions));
                await writeFile(resolve(output, `${theme}-${width}-architecture.yml`), await page.locator('main').ariaSnapshot());
                const figures = page.locator('main .technical-diagram');
                for (const [index, figure] of (await figures.all()).entries()) {
                    const art = figure.locator('.technical-diagram__art');
                    const geometry = await art.evaluate((node) => {
                        node.scrollLeft = node.scrollWidth;
                        return { width: node.clientWidth, content: node.scrollWidth, scroll: node.scrollLeft };
                    });
                    if (geometry.content > geometry.width + 1) assert.ok(geometry.scroll > 0, JSON.stringify(geometry));
                    await art.evaluate((node) => {
                        node.scrollLeft = 0;
                    });
                    await figure.screenshot({ path: resolve(output, `${theme}-${width}-diagram-${index + 1}.png`), style: captureStyle });
                    report.diagrams.push({ theme, width, index: index + 1, ...geometry });
                }
                await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
                await page.screenshot({ path: resolve(output, `${theme}-${width}-architecture.png`) });
            }

            for (const [fragment, destination] of Object.entries(legacy.fragments)) {
                await visit(page, `${legacy.from}?pm=pnpm#${fragment}`);
                const expected = new URL(destination, values.url);
                await page.waitForURL((url) => url.pathname === expected.pathname && url.hash === expected.hash);
                assert.equal(new URL(page.url()).searchParams.get('pm'), 'pnpm');
                assert.equal(await page.locator(`[id="${fragment}"]`).count(), 1);
                await checkDiagrams(page);
                report.fragments.push({ theme, from: fragment, to: destination });
            }
            for (const fragment of ['inside-and-outside', 'go-deeper']) {
                await visit(page, `${canonical}#${fragment}`);
                assert.equal(await page.locator(`[id="${fragment}"]`).count(), 1);
            }
        } catch (error) {
            await page.screenshot({ path: resolve(output, `${theme}-failure.png`) });
            throw error;
        } finally {
            await context.close();
        }

        const staticContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: theme });
        try {
            const page = await staticContext.newPage();
            await page.goto(`${values.url}${canonical}`, { waitUntil: 'domcontentloaded' });
            await checkDiagrams(page);
            await page.goto(`${values.url}${legacy.from}#runtime-composition`, { waitUntil: 'domcontentloaded' });
            assert.equal(await page.locator('.compatibility-route p a').getAttribute('href'), canonical);
            assert.equal(await page.locator('.compatibility-route a[href$="#runtime-composition"]').count(), 1);
            assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,follow');
            assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://connectum.dev${canonical}`);
            report.static.push({ theme, completeDiagramsWithoutJavaScript: true, legacyFallback: true, canonicalAndNoindex: true });
        } finally {
            await staticContext.close();
        }
    }
    assert.deepEqual(report.errors, []);
    report.completed = true;
} catch (error) {
    report.errors.push(error.stack ?? String(error));
    throw error;
} finally {
    clearTimeout(deadline);
    await writeFile(resolve(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    await browser.close();
}
console.log(
    `Architecture: ${report.cta.length} CTA pairs, ${report.diagrams.length} preserved diagram views, ${report.fragments.length} old fragments and ${report.static.length} no-JS cases.`,
);
