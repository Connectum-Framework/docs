import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
    options: {
        url: { type: 'string', default: 'http://127.0.0.1:4185' },
        output: { type: 'string', default: '.tmp/technology-stack-browser' },
        reference: { type: 'string' },
    },
});
assert.ok(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs. This check starts no server.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href);
const output = resolve(values.output);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = { completed: false, styles: [], layouts: [], static: [], contrast: [], errors: [] };
const referenceSvg = values.reference ? (await readFile(resolve(values.reference), 'utf8')).match(/<svg\b[\s\S]*?<\/svg>/)?.[0] : undefined;
const standaloneHtml = await readFile(new URL('../.vitepress/theme/assets/diagrams/technology-stack.html', import.meta.url), 'utf8');
if (values.reference) assert.ok(referenceSvg, 'The reference HTML must contain the accepted Server SVG.');
const deadline = setTimeout(() => void browser.close(), 180_000);
// isolate this tall figure from sticky page chrome during element captures.
const captureStyle = 'header.VPNav, .VPLocalNav { visibility: hidden !important; }';

function inspectPlates(node) {
    return [...node.querySelectorAll('[data-part]')].map((part) => ({
        key: part.dataset.part,
        focal: part.hasAttribute('data-focal'),
        faces: [...part.querySelectorAll('path')].map((face) => {
            const style = getComputedStyle(face);
            const box = face.getBBox();
            return {
                role: face.getAttribute('class'),
                path: face.getAttribute('d'),
                width: box.width,
                height: box.height,
                style: Object.fromEntries(['fill', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linejoin'].map((property) => [property, style.getPropertyValue(property)])),
            };
        }),
        labels: [...part.querySelectorAll('text')].map((label) => ({ text: label.textContent, fill: getComputedStyle(label).fill, font: getComputedStyle(label).font })),
    }));
}

function compareStyles(actual, reference) {
    assert.deepEqual(
        actual.faces.map((face) => ({ role: face.role, style: face.style })),
        reference.faces.map((face) => ({ role: face.role, style: face.style })),
    );
    for (const [index, face] of actual.faces.entries()) {
        assert.ok(Math.abs(face.width - reference.faces[index].width) < 0.001);
        assert.ok(Math.abs(face.height - reference.faces[index].height) < 0.001);
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
            await page.setViewportSize({ width: 1440, height: 1000 });
            await page.goto(`${values.url}/en/guide/server`, { waitUntil: 'domcontentloaded' });
            await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
            await page.evaluate(() => document.fonts.ready);
            const server = page.locator('.server-composition-art');
            const reference = await server.evaluate(inspectPlates);
            assert.equal(reference.length, 3);
            await server.screenshot({ path: resolve(output, `${theme}-server.png`), style: captureStyle });
            if (referenceSvg) {
                const current = await server.innerHTML();
                await server.evaluate((node, source) => {
                    node.innerHTML = source;
                }, referenceSvg);
                assert.deepEqual(reference, await server.evaluate(inspectPlates), 'Server must retain the accepted paths, computed face styles and labels.');
                await server.screenshot({ path: resolve(output, `${theme}-server-reference.png`), style: captureStyle });
                await server.evaluate((node, source) => {
                    node.innerHTML = source;
                }, current);
            }
            report.styles.push({ theme, serverUnchangedFromReference: Boolean(referenceSvg), server: reference });
            for (const width of [1440, 1024, 768, 390, 320]) {
                await page.setViewportSize({ width, height: 1000 });
                await page.goto(`${values.url}/en/guide/about#mental-model`, { waitUntil: 'domcontentloaded' });
                await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
                await page.evaluate(() => document.fonts.ready);
                const figure = page.locator('.connectum-stack');
                assert.deepEqual(await figure.getByRole('heading', { level: 3 }).allTextContents(), ['Connectum', 'ConnectRPC', 'Protobuf']);
                assert.equal(await figure.getByRole('img').count(), 0, 'The equivalent HTML explanations own the accessible names; vector faces are decorative.');
                assert.equal(await figure.locator('button, a, [tabindex]').count(), 0);
                assert.ok((await figure.innerText()).includes('Your handlers contain the business logic.'));
                assert.ok((await figure.innerText()).includes('Native gRPC and bidirectional streams require HTTP/2.'));
                const plates = await figure.evaluate(inspectPlates);
                assert.equal(plates.length, 3);
                assert.deepEqual(
                    plates.filter((plate) => plate.focal).map((plate) => plate.key),
                    ['connectum'],
                );
                for (const plate of plates)
                    compareStyles(
                        plate,
                        reference.find((part) => part.focal === plate.focal),
                    );
                const layout = await figure.evaluate((node) => {
                    const bounds = node.getBoundingClientRect();
                    return {
                        width: innerWidth,
                        document: document.documentElement.scrollWidth,
                        figure: { width: bounds.width, scroll: node.scrollWidth, height: bounds.height },
                        rows: [...node.querySelectorAll('.stack-layer')].map((row) => {
                            const block = row.querySelector('.stack-block').getBoundingClientRect();
                            const details = row.querySelector('.stack-details').getBoundingClientRect();
                            const svg = row.querySelector('svg');
                            const box = svg.getBBox();
                            const canvas = svg.viewBox.baseVal;
                            const rendered = svg.getBoundingClientRect();
                            const scale = rendered.height / canvas.height;
                            return {
                                sideBySide: details.left >= block.right,
                                below: details.top >= block.bottom - 1,
                                blockWidth: block.width,
                                shapeTop: rendered.top + (box.y - canvas.y) * scale,
                                shapeBottom: rendered.top + (box.y + box.height - canvas.y) * scale,
                                detailsTop: details.top,
                                detailsBottom: details.bottom,
                                font: getComputedStyle(row.querySelector('h3')).fontFamily,
                                labelSize: getComputedStyle(row.querySelector('h3')).fontSize,
                                vectorInsideCanvas:
                                    box.x >= canvas.x && box.y >= canvas.y && box.x + box.width <= canvas.x + canvas.width && box.y + box.height <= canvas.y + canvas.height,
                                textFits: row.querySelector('.stack-details').scrollWidth <= details.width + 1,
                            };
                        }),
                    };
                });
                assert.ok(layout.document <= width + 1, JSON.stringify(layout));
                assert.ok(layout.figure.scroll <= layout.figure.width + 1, JSON.stringify(layout));
                if (width === 1440) assert.ok(layout.figure.height <= 583, 'Keep the accepted compact desktop figure height.');
                for (const row of layout.rows) {
                    assert.ok(width > 640 ? row.sideBySide : row.below, JSON.stringify(row));
                    assert.ok(row.vectorInsideCanvas && row.textFits && Number.parseFloat(row.labelSize) >= 20, JSON.stringify(row));
                }
                for (let i = 1; i < layout.rows.length; i++) {
                    assert.ok(layout.rows[i].shapeTop >= layout.rows[i - 1].shapeBottom + 4, JSON.stringify(layout));
                    assert.ok(layout.rows[i].detailsTop >= layout.rows[i - 1].detailsBottom, JSON.stringify(layout));
                }
                await writeFile(resolve(output, `${theme}-${width}.yml`), await figure.ariaSnapshot());
                await figure.screenshot({ path: resolve(output, `${theme}-${width}.png`), style: captureStyle });
                report.layouts.push({ theme, matchesServerStyle: true, ...layout });
            }
            const contrast = await page.locator('.connectum-stack').evaluate((node) => {
                const canvas = document.createElement('canvas');
                canvas.width = canvas.height = 1;
                const ctx = canvas.getContext('2d');
                const rgb = (color) => {
                    ctx.clearRect(0, 0, 1, 1);
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, 1, 1);
                    return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
                };
                const luminance = (color) =>
                    rgb(color)
                        .map((value) => {
                            const channel = value / 255;
                            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
                        })
                        .reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
                const ratio = (a, b) => {
                    const first = luminance(a);
                    const second = luminance(b);
                    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
                };
                const paper = getComputedStyle(node).getPropertyValue('--stack-paper');
                return [...node.querySelectorAll('.stack-layer')].flatMap((row) => {
                    const samples = [
                        ...[...row.querySelectorAll('h3, li, .stack-note')].map((el) => [el.tagName, getComputedStyle(el).color, paper]),
                        ...[...row.querySelectorAll('code')].map((el) => ['code', getComputedStyle(el).color, getComputedStyle(el).backgroundColor]),
                    ];
                    return samples.map(([role, foreground, background]) => ({
                        technology: row.querySelector('h3').textContent,
                        role,
                        foreground,
                        background,
                        ratio: ratio(foreground, background),
                    }));
                });
            });
            for (const sample of contrast) assert.ok(sample.ratio >= 4.5, JSON.stringify({ theme, ...sample }));
            report.contrast.push({ theme, samples: contrast });
            await page.setViewportSize({ width: 390, height: 1000 });
            await page.goto(`${values.url}/en/guide/server`, { waitUntil: 'domcontentloaded' });
            await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
            await server.focus();
            await server.press('ArrowRight');
            await page.waitForFunction(() => document.querySelector('.server-composition-art').scrollLeft > 0);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            report.styles.at(-1).serverMobileKeyboardScroll = true;
        } catch (error) {
            await page.screenshot({ path: resolve(output, `${theme}-failure.png`) });
            throw error;
        } finally {
            await context.close();
        }

        const staticContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: theme, viewport: { width: 390, height: 1000 } });
        try {
            const page = await staticContext.newPage();
            await page.goto(`${values.url}/en/guide/about#mental-model`, { waitUntil: 'domcontentloaded' });
            const figure = page.locator('.connectum-stack');
            assert.deepEqual(await figure.getByRole('heading', { level: 3 }).allTextContents(), ['Connectum', 'ConnectRPC', 'Protobuf']);
            assert.equal(await figure.locator('svg path').count(), 18);
            await writeFile(resolve(output, `${theme}-no-js.yml`), await figure.ariaSnapshot());
            await figure.screenshot({ path: resolve(output, `${theme}-no-js.png`), style: captureStyle });
            await page.setViewportSize({ width: 794, height: 1000 });
            await page.emulateMedia({ media: 'print' });
            assert.equal(await figure.isVisible(), true);
            await figure.screenshot({ path: resolve(output, `${theme}-print.png`), style: captureStyle });
            await page.emulateMedia({ media: 'screen' });
            await page.setViewportSize({ width: 390, height: 1000 });
            await page.setContent(standaloneHtml, { waitUntil: 'domcontentloaded' });
            const standalone = page.locator('.connectum-stack');
            assert.deepEqual(await standalone.getByRole('heading', { level: 3 }).allTextContents(), ['Connectum', 'ConnectRPC', 'Protobuf']);
            const reference = report.styles.find((entry) => entry.theme === theme).server;
            for (const plate of await standalone.evaluate(inspectPlates))
                compareStyles(
                    plate,
                    reference.find((part) => part.focal === plate.focal),
                );
            await standalone.screenshot({ path: resolve(output, `${theme}-standalone.png`) });
            report.static.push({ theme, noJavaScript: true, completeLabels: true, printVisible: true, standaloneMatchesServer: true });
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
console.log(`Technology stack: ${report.layouts.length} themed layouts, ${report.static.length} no-JS/print cases; contrast samples passed.`);
