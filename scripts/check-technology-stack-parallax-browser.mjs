import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { stackParallaxParts } from '../.vitepress/theme/stackParallax.ts';

const { values } = parseArgs({
    options: {
        url: { type: 'string', default: 'http://127.0.0.1:4185' },
        output: { type: 'string', default: '.tmp/technology-stack-parallax' },
        browser: { type: 'string', default: 'chrome' },
    },
});
assert.ok(['chrome', 'firefox'].includes(values.browser), 'Use --browser chrome or --browser firefox.');
assert.ok(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs. This check starts no server.');
const { chromium, firefox } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href);
const output = resolve(values.output);
await mkdir(output, { recursive: true });
const browser =
    values.browser === 'firefox'
        ? await firefox.launch({
              headless: true,
              channel: 'moz-firefox',
              executablePath: '/usr/bin/firefox',
              firefoxUserPrefs: { 'general.smoothScroll': false, 'ui.prefersReducedMotion': 0 },
          })
        : await chromium.launch({ headless: true, channel: 'chrome' });
const report = { completed: false, browser: values.browser, version: browser.version(), capabilities: [], local: [], motion: [], static: [], navigation: [], errors: [] };
const deadline = setTimeout(() => void browser.close(), 240_000);
const about = '/en/guide/about';
const captureStyle = 'header.VPNav, .VPLocalNav { visibility: hidden !important; }';

async function frames(page, count = 2) {
    await page.evaluate(
        (count) =>
            new Promise((resolve) => {
                const next = () => {
                    if (--count === 0) resolve();
                    else requestAnimationFrame(next);
                };
                requestAnimationFrame(next);
            }),
        count,
    );
}

async function visit(page, route) {
    await page.goto(`${values.url}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
    await page.evaluate(() => document.fonts.ready);
    await frames(page);
}

async function snapshot(page) {
    return page.locator('.technology-stack-embed').evaluate((root) => {
        const figure = root.querySelector('.connectum-stack');
        const bounds = figure.getBoundingClientRect();
        return {
            enhanced: root.hasAttribute('data-parallax'),
            scroll: scrollY,
            figureTop: bounds.top + scrollY,
            width: bounds.width,
            height: bounds.height,
            documentWidth: document.documentElement.scrollWidth,
            documentHeight: document.documentElement.scrollHeight,
            viewportHeight: innerHeight,
            coveredTop: Math.max(
                0,
                ...[...document.querySelectorAll('.VPNav, .VPLocalNav')].map((node) => {
                    const rect = node.getBoundingClientRect();
                    return rect.top < 80 && rect.height > 0 ? rect.bottom : 0;
                }),
            ),
            rows: [...figure.querySelectorAll('.stack-layer')].map((row) => {
                const svg = row.querySelector('svg');
                const block = row.querySelector('.stack-block');
                const details = row.querySelector('.stack-details').getBoundingClientRect();
                const style = getComputedStyle(svg);
                const transform = style.transform === 'none' ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(style.transform);
                return {
                    name: row.querySelector('h3').textContent,
                    shift: transform.m42,
                    matrix: [transform.m11, transform.m12, transform.m21, transform.m22, transform.m41],
                    animation: style.animationName,
                    timeline: style.animationTimeline,
                    text: row.querySelector('.stack-details').textContent,
                    detailsTop: details.top + scrollY,
                    detailsHeight: details.height,
                    detailsBottom: details.bottom + scrollY,
                    blockTop: block.getBoundingClientRect().top + scrollY,
                    svgTop: svg.getBoundingClientRect().top + scrollY,
                    svgBottom: svg.getBoundingClientRect().bottom + scrollY,
                    svgWidth: svg.getBoundingClientRect().width,
                    svgHeight: svg.getBoundingClientRect().height,
                };
            }),
        };
    });
}

function still(frame) {
    for (const row of frame.rows) {
        assert.equal(row.shift, 0, JSON.stringify(row));
        assert.equal(row.animation, 'none', JSON.stringify(row));
    }
}

function sameLayout(actual, reference) {
    for (const key of ['figureTop', 'width', 'height', 'documentWidth']) assert.ok(Math.abs(actual[key] - reference[key]) < 0.5, key);
    for (const [index, row] of actual.rows.entries()) {
        const before = reference.rows[index];
        assert.equal(row.text, before.text);
        for (const key of ['detailsTop', 'detailsHeight', 'blockTop', 'svgWidth', 'svgHeight']) assert.ok(Math.abs(row[key] - before[key]) < 0.5, `${row.name}: ${key}`);
        assert.deepEqual(row.matrix, [1, 0, 0, 1, 0], 'Only vertical translation is allowed.');
    }
}

async function placePart(page, index, viewportRatio) {
    await page
        .locator('.stack-block')
        .nth(index)
        .evaluate((block, ratio) => {
            window.scrollTo({ top: block.getBoundingClientRect().top + scrollY - innerHeight * ratio, behavior: 'instant' });
        }, viewportRatio);
    await frames(page, 3);
    return snapshot(page);
}

function clearances(frame, width) {
    for (const [index, row] of frame.rows.entries()) {
        if (width <= 640) {
            // Firefox exposes subpixel rounding between touching boxes (under 0.001px), not a painted overlap.
            assert.ok(
                row.svgBottom <= row.detailsTop + 0.01,
                `A plate must not move into its mobile label: ${JSON.stringify({ name: row.name, svgBottom: row.svgBottom, detailsTop: row.detailsTop, overlap: row.svgBottom - row.detailsTop })}`,
            );
            if (index > 0) assert.ok(row.svgTop >= frame.rows[index - 1].detailsBottom + 4, 'Keep clearance from the preceding explanation.');
        } else if (index > 0) assert.ok(row.svgTop >= frame.rows[index - 1].svgBottom + 4, 'Keep the compact plate gaps open.');
    }
}

async function localGesture(page, { theme, width, height }) {
    await page.setViewportSize({ width, height });
    await visit(page, `${about}?motion=auto`);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const approach = await page
        .locator('.stack-block')
        .first()
        .evaluate((block) => {
            const bounds = block.getBoundingClientRect();
            return Math.round(bounds.top - (96 + bounds.height * 0.85));
        });
    // approach the illustration from the page's real entry using wheel input, then test an 80px reading gesture.
    await page.mouse.move(width * 0.6, height * 0.6);
    await page.mouse.wheel(0, approach);
    await page.waitForFunction((target) => Math.abs(scrollY - target) < 1, approach);
    await frames(page, 4);
    const start = await snapshot(page);
    if ([1440, 390].includes(width)) await page.screenshot({ path: resolve(output, `${theme}-${width}-${height}-local-before.png`) });
    await page.mouse.move(width * 0.6, height * 0.6);
    await page.mouse.wheel(0, 80);
    await page.waitForFunction((before) => scrollY >= before + 75, start.scroll);
    await frames(page, 4);
    const end = await snapshot(page);
    if ([1440, 390].includes(width)) await page.screenshot({ path: resolve(output, `${theme}-${width}-${height}-local-after.png`) });
    const movement = Math.abs(end.rows[0].shift - start.rows[0].shift);
    const relativeMovement = Math.abs(end.rows[0].shift - end.rows[1].shift - (start.rows[0].shift - start.rows[1].shift));
    await page.mouse.wheel(0, -80);
    await page.waitForFunction((target) => Math.abs(scrollY - target) < 1, start.scroll);
    await frames(page, 4);
    const reverse = await snapshot(page);
    for (const [index, row] of reverse.rows.entries())
        assert.ok(Math.abs(row.shift - start.rows[index].shift) < 0.1, 'Reversing the short wheel gesture restores the same plate positions.');
    await page.evaluate(() => {
        const tail = document.createElement('div');
        tail.id = 'parallax-test-page-tail';
        tail.style.height = '20000px';
        document.body.append(tail);
    });
    await frames(page, 4);
    const extended = await snapshot(page);
    assert.ok(extended.documentHeight >= start.documentHeight + 19000, 'The fixture must substantially extend the page.');
    for (const [index, row] of extended.rows.entries()) assert.ok(Math.abs(row.shift - start.rows[index].shift) < 0.1, 'Page length must not affect the local offsets.');
    await page.mouse.wheel(0, 80);
    await page.waitForFunction((target) => Math.abs(scrollY - target) < 1, end.scroll);
    await frames(page, 4);
    const repeated = await snapshot(page);
    for (const [index, row] of repeated.rows.entries())
        assert.ok(Math.abs(row.shift - end.rows[index].shift) < 0.1, 'The same visible gesture must behave identically on a much longer page.');
    await page.evaluate(() => document.getElementById('parallax-test-page-tail').remove());
    const result = { theme, width, height, scroll: end.scroll - start.scroll, movement, relativeMovement, pageLengthIndependent: true, shortReverse: true, start, end };
    report.local.push(result);
    return result;
}

function assertLocalGesture({ width, height, movement, relativeMovement, start, end }) {
    for (const frame of [start, end]) {
        assert.ok(frame.rows[0].svgTop - frame.scroll >= frame.coveredTop, 'The tested plate must remain below the sticky header.');
        assert.ok(frame.rows[0].svgBottom - frame.scroll <= height, 'The tested plate must remain wholly in the viewport.');
        clearances(frame, width);
    }
    sameLayout(end, start);
    assert.ok(movement >= (width <= 640 ? 5 : 8), `An 80px gesture while the plate stays visible must move it relative to its label: ${movement}px`);
    if (width > 640) assert.ok(relativeMovement >= 5, `Visible neighboring plates need differential motion: ${relativeMovement}px`);
}

try {
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ colorScheme: theme, reducedMotion: 'no-preference' });
        context.setDefaultTimeout(20_000);
        const page = await context.newPage();
        page.on('pageerror', (error) => report.errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') report.errors.push(message.text());
        });
        try {
            await page.setViewportSize({ width: 1440, height: 1000 });
            await visit(page, `${about}?motion=static#mental-model`);
            if ((await page.locator('html').evaluate((node) => node.classList.contains('dark'))) !== (theme === 'dark')) {
                await page.locator('.VPNavBar .VPSwitchAppearance').first().click();
            }
            await page.waitForFunction((dark) => document.documentElement.classList.contains('dark') === dark, theme === 'dark');
            const localResults = [];
            for (const width of [1440, 1024, 768, 390, 320]) localResults.push(await localGesture(page, { theme, width, height: 1000 }));
            for (const height of [640, 800]) {
                for (const width of [1440, 390]) localResults.push(await localGesture(page, { theme, width, height }));
            }
            for (const result of localResults) assertLocalGesture(result);
            for (const width of [1440, 1024, 768, 390, 320]) {
                await page.setViewportSize({ width, height: 1000 });
                await visit(page, `${about}?motion=static#mental-model`);
                const baseline = await snapshot(page);
                assert.equal(baseline.enhanced, false);
                still(baseline);
                assert.ok((await page.locator('.stack-motion-note').innerText()).includes('?motion=static'));
                const staticFigure = page.locator('.connectum-stack');
                const first = await staticFigure.screenshot({ style: captureStyle });
                const second = await staticFigure.screenshot({ style: captureStyle });
                assert.deepEqual(first, second, 'Explicit static captures must be reproducible.');
                await writeFile(resolve(output, `${theme}-${width}-static.png`), first);

                await visit(page, `${about}#mental-model`);
                report.capabilities.push(
                    await page.evaluate(() => ({
                        href: location.href,
                        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
                        nativeTimeline: CSS.supports('animation-timeline: view()'),
                        nativeRange: CSS.supports('animation-range: entry 0% exit 100%'),
                        enhanced: document.querySelector('.technology-stack-embed')?.hasAttribute('data-parallax'),
                        transform: getComputedStyle(document.querySelector('.stack-block svg')).transform,
                    })),
                );
                await page.waitForSelector('.technology-stack-embed[data-parallax]');
                assert.equal(await page.locator('.stack-motion-note').count(), 0);
                const anchor = await snapshot(page);
                sameLayout(anchor, baseline);
                clearances(anchor, width);
                const gestures = [];
                for (const [index, part] of stackParallaxParts.entries()) {
                    const plateHeight = await page
                        .locator('.stack-block')
                        .nth(index)
                        .evaluate((block) => block.getBoundingClientRect().height);
                    const start = await placePart(page, index, (96 + plateHeight * 0.85) / 1000);
                    sameLayout(start, baseline);
                    clearances(start, width);
                    if (index === 0 && [1440, 390].includes(width)) await page.screenshot({ path: resolve(output, `${theme}-${width}-wheel-start.png`) });
                    await page.mouse.move(width * 0.6, 500);
                    await page.mouse.wheel(0, 80);
                    await page.waitForFunction((before) => scrollY >= before + 75, start.scroll);
                    await frames(page, 4);
                    const end = await snapshot(page);
                    sameLayout(end, baseline);
                    clearances(end, width);
                    const travel = width <= 640 ? part.mobile : part.desktop;
                    const movement = Math.abs(end.rows[index].shift - start.rows[index].shift);
                    assert.ok(movement >= (index === 0 ? (width <= 640 ? 5 : 8) : 1), JSON.stringify({ part: part.key, movement }));
                    for (const frame of [start, end]) {
                        assert.ok(frame.rows[index].svgTop - frame.scroll >= frame.coveredTop, 'Motion evidence must stay below the sticky header.');
                        assert.ok(frame.rows[index].svgBottom - frame.scroll <= frame.viewportHeight, 'Motion evidence must stay wholly on screen.');
                    }
                    assert.ok(end.rows[index].shift <= 0 && Math.abs(end.rows[index].shift) <= travel);
                    assert.equal(end.rows[index].animation, 'none', 'Scroll-driven transforms must not require native CSS animation timelines.');
                    assert.ok(end.documentWidth <= width + 1);
                    if (index === 0 && [1440, 390].includes(width)) await page.screenshot({ path: resolve(output, `${theme}-${width}-wheel-end.png`) });
                    await frames(page, 12);
                    const idle = await snapshot(page);
                    assert.deepEqual(
                        idle.rows.map((row) => row.shift),
                        end.rows.map((row) => row.shift),
                        'No drift or inertia while scrolling is idle.',
                    );
                    const reverse = await placePart(page, index, (96 + plateHeight * 0.85) / 1000);
                    assert.deepEqual(
                        reverse.rows.map((row) => row.shift),
                        start.rows.map((row) => row.shift),
                        'Reverse scrolling must restore the same offsets.',
                    );
                    const limit = await placePart(page, index, -0.204);
                    sameLayout(limit, baseline);
                    clearances(limit, width);
                    assert.ok(Math.abs(limit.rows[index].shift + travel) < 0.01, 'Offsets must clamp at the declared travel.');
                    gestures.push({ part: part.key, scrollDistance: end.scroll - start.scroll, movement, fullTravel: limit.rows[index].shift });
                }
                const active = await placePart(page, 0, 0.2);

                // Playwright's BiDi updateEmulateMedia is a no-op; Firefox gets a real native-pref check below.
                if (values.browser === 'chrome') {
                    await page.emulateMedia({ reducedMotion: 'reduce' });
                    await frames(page);
                    await page.waitForFunction(() => document.querySelector('.stack-motion-note')?.textContent.includes('system requests reduced motion'));
                    const reduced = await snapshot(page);
                    still(reduced);
                    sameLayout(reduced, baseline);
                    await page.emulateMedia({ reducedMotion: 'no-preference' });
                    await frames(page);
                    assert.deepEqual(
                        (await snapshot(page)).rows.map((row) => row.shift),
                        active.rows.map((row) => row.shift),
                    );
                }
                await page.evaluate(() => {
                    document.documentElement.dataset.motion = 'static';
                });
                await frames(page);
                still(await snapshot(page));
                await page.evaluate(() => {
                    delete document.documentElement.dataset.motion;
                });
                await frames(page);

                if (values.browser === 'chrome') {
                    await page.emulateMedia({ media: 'print' });
                    await frames(page);
                    still(await snapshot(page));
                    assert.equal(await page.locator('.connectum-stack svg path').count(), 18);
                    await page.emulateMedia({ media: 'screen' });
                    await frames(page);
                }
                report.motion.push({
                    theme,
                    siteThemeVerified: (await page.locator('html').evaluate((node) => node.classList.contains('dark'))) === (theme === 'dark'),
                    width,
                    gestures,
                    anchorInitialOffsets: anchor.rows.map((row) => row.shift),
                    nativeTimelineNotRequired: true,
                    disabledReasonVisible: true,
                    staticLabelsAndLayout: true,
                    reversible: true,
                    idleStill: true,
                    liveReducedMotion: values.browser === 'chrome',
                    printStatic: values.browser === 'chrome',
                    mediaEmulationAvailable: values.browser === 'chrome',
                    staticOverride: true,
                });
            }

            await page.setViewportSize({ width: 1440, height: 1000 });
            assert.equal((await placePart(page, 0, -0.204)).rows[0].shift, -24, 'A live resize must use desktop travel.');
            await page.setViewportSize({ width: 390, height: 1000 });
            assert.equal((await placePart(page, 0, -0.204)).rows[0].shift, -14, 'A live resize must use mobile travel.');
            await page.setViewportSize({ width: 1440, height: 1000 });
            await visit(page, '/en/guide/server');
            assert.equal(await page.locator('.technology-stack-embed').count(), 0);
            const server = await page.locator('.server-composition-art').evaluate((node) => ({ html: node.innerHTML, animations: node.getAnimations({ subtree: true }).length }));
            assert.equal(server.animations, 0);
            await page.locator('header a[href="/en/guide/about"]').first().click();
            await page.waitForURL(`**${about}`);
            await page.waitForSelector('.technology-stack-embed[data-parallax]');
            const returned = await placePart(page, 0, 0.2);
            assert.ok(returned.rows.some((row) => row.shift !== 0));
            const disposed = await page.locator('.technology-stack-embed').elementHandle();
            await page.goBack();
            await page.waitForURL('**/en/guide/server');
            await page.waitForSelector('.server-composition-art');
            assert.equal(await page.locator('.technology-stack-embed').count(), 0);
            assert.equal(await page.locator('.server-composition-art').innerHTML(), server.html);
            const cleanup = await disposed.evaluate((node) => ({
                connected: node.isConnected,
                enabled: node.hasAttribute('data-parallax'),
                offsets: [...node.querySelectorAll('svg')].map((svg) => svg.style.getPropertyValue('--stack-parallax-y')),
            }));
            assert.deepEqual(cleanup, { connected: false, enabled: false, offsets: ['', '', ''] });
            await disposed.dispose();
            await page.goForward();
            await page.waitForURL(`**${about}`);
            await page.waitForSelector('.technology-stack-embed[data-parallax]');
            assert.ok((await placePart(page, 0, 0.2)).rows.some((row) => row.shift !== 0));
            report.navigation.push({ theme, serverUnchanged: true, spaEntryAndHistory: true, unmountClearsMotion: true, liveResizeUpdatesTravel: true });
        } catch (error) {
            await page.screenshot({ path: resolve(output, `${theme}-failure.png`) });
            throw error;
        } finally {
            await context.close();
        }

        if (values.browser === 'chrome') {
            const contextNoJs = await browser.newContext({ colorScheme: theme, reducedMotion: 'no-preference', javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
            try {
                const page = await contextNoJs.newPage();
                await page.goto(`${values.url}${about}#mental-model`, { waitUntil: 'domcontentloaded' });
                const before = await snapshot(page);
                assert.equal(before.enhanced, false);
                still(before);
                await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'instant' }));
                still(await snapshot(page));
                assert.deepEqual(await page.locator('.connectum-stack h3').allTextContents(), ['Connectum', 'ConnectRPC', 'Protobuf']);
                report.static.push({
                    themeRequested: theme,
                    actualDarkClass: await page.locator('html').evaluate((node) => node.classList.contains('dark')),
                    noJavaScript: true,
                    completeLabels: true,
                    noScrollAnimation: true,
                });
            } finally {
                await contextNoJs.close();
            }
        }
    }
    if (values.browser === 'firefox') {
        const nativeReducedBrowser = await firefox.launch({
            headless: true,
            channel: 'moz-firefox',
            executablePath: '/usr/bin/firefox',
            firefoxUserPrefs: { 'ui.prefersReducedMotion': 1 },
        });
        try {
            const context = await nativeReducedBrowser.newContext({ viewport: { width: 390, height: 1000 } });
            const page = await context.newPage();
            await visit(page, `${about}#mental-model`);
            assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
            await page.waitForFunction(() => document.querySelector('.stack-motion-note')?.textContent.includes('system requests reduced motion'));
            still(await snapshot(page));
            assert.equal((await snapshot(page)).enhanced, false);
            await page.locator('.stack-motion-note').scrollIntoViewIfNeeded();
            await page.screenshot({ path: resolve(output, 'firefox-native-reduced.png') });
            report.static.push({ browser: 'firefox', nativeReducedMotionPreference: true, disabledReasonVisible: true, noScrollAnimation: true });
        } finally {
            await nativeReducedBrowser.close();
        }
        const nativeNoJsBrowser = await firefox.launch({
            headless: true,
            channel: 'moz-firefox',
            executablePath: '/usr/bin/firefox',
            firefoxUserPrefs: { 'javascript.enabled': false, 'ui.prefersReducedMotion': 0 },
        });
        try {
            const context = await nativeNoJsBrowser.newContext({ viewport: { width: 390, height: 1000 } });
            const page = await context.newPage();
            await page.goto(`${values.url}${about}#mental-model`, { waitUntil: 'load' });
            assert.equal(await page.evaluate(() => Boolean(document.querySelector('#app')?.__vue_app__)), false);
            const before = await snapshot(page);
            assert.equal(before.enhanced, false);
            still(before);
            assert.deepEqual(await page.locator('.connectum-stack h3').allTextContents(), ['Connectum', 'ConnectRPC', 'Protobuf']);
            report.static.push({ browser: 'firefox', nativeJavaScriptDisabled: true, allContentServerRendered: true, noScrollAnimation: true });
        } finally {
            await nativeNoJsBrowser.close();
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
    `About parallax: ${report.local.length} wholly visible 80px gestures, ${report.motion.length} scroll layouts, ${report.static.length} static fallback cases, ${report.navigation.length} SPA/history cases.`,
);
