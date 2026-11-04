import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { createMarkdownRenderer, resolveConfig } from 'vitepress';

const { values } = parseArgs({ options: { url: { type: 'string', default: 'http://127.0.0.1:4185' }, output: { type: 'string', default: '.tmp/task-lists-browser' } } });
assert.ok(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs. This check starts no server.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href);
const output = resolve(values.output);
await mkdir(output, { recursive: true });
const root = fileURLToPath(new URL('../', import.meta.url));
const config = await resolveConfig(root, 'build');
const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base);
const checkedFixture = md.render('- [x] Completed task\n- [ ] Pending task\n', { tasklistId: 1000 });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = { completed: false, layouts: [], static: [], errors: [] };
const deadline = setTimeout(() => void browser.close(), 240_000);
const route = '/en/guide/typescript/patterns?runtime=node#checklist';
const captureStyle = 'header.VPNav, .VPLocalNav { visibility: hidden !important; }';

async function captureList(page, list, path) {
    await list.scrollIntoViewIfNeeded();
    const box = await list.boundingBox();
    // task markers extend into the list gutter; include it instead of clipping the native checkbox.
    await page.screenshot({ path, style: captureStyle, clip: { x: box.x - 4, y: box.y, width: box.width + 4, height: box.height } });
}

async function checkInputs(scope, expected) {
    const inputs = scope.getByRole('checkbox');
    assert.equal(await inputs.count(), expected);
    for (const input of await inputs.all()) {
        assert.equal(await input.isVisible(), true);
        assert.equal(await input.isDisabled(), true);
        const name = await input.evaluate((input) =>
            [...input.labels]
                .map((label) => label.textContent)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim(),
        );
        assert.ok(name.length > 0);
        assert.equal(await scope.getByRole('checkbox', { name, exact: true }).count(), 1, 'Native labels must resolve to the accessible checkbox name.');
        const box = await input.boundingBox();
        assert.ok(box.width >= 14 && box.height >= 14, JSON.stringify({ name, box }));
        assert.equal(await input.evaluate((input) => getComputedStyle(input).appearance), 'auto');
    }
    assert.doesNotMatch(await scope.innerText(), /\[ \]/);
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
            for (const width of [1440, 390, 320]) {
                await page.setViewportSize({ width, height: 1000 });
                await page.goto(`${values.url}${route}`, { waitUntil: 'domcontentloaded' });
                await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
                await page.evaluate(() => document.fonts.ready);
                const common = page.locator('#checklist + p + ul.task-list-container');
                const variants = page.locator('#checklist ~ .runtime-group');
                const node = variants.getByRole('button', { name: 'Show Node.js instructions' });
                await node.focus();
                await node.press('Enter');
                await page.waitForFunction(() => document.documentElement.dataset.runtime === 'node');
                await checkInputs(common, 4);
                await checkInputs(variants, 5);
                assert.equal(await page.locator('main input[type="checkbox"]').count(), 11);
                await writeFile(resolve(output, `${theme}-${width}-node.yml`), await variants.ariaSnapshot());
                await captureList(page, common, resolve(output, `${theme}-${width}-common.png`));
                await variants.screenshot({ path: resolve(output, `${theme}-${width}-node.png`), style: captureStyle });

                const bun = variants.getByRole('button', { name: 'Show Bun instructions' });
                await bun.focus();
                await bun.press('Enter');
                await page.waitForFunction(() => document.documentElement.dataset.runtime === 'bun');
                await checkInputs(common, 4);
                await checkInputs(variants, 2);
                await writeFile(resolve(output, `${theme}-${width}-bun.yml`), await variants.ariaSnapshot());
                await variants.screenshot({ path: resolve(output, `${theme}-${width}-bun.png`), style: captureStyle });
                await bun.focus();
                await page.keyboard.press('Tab');
                assert.notEqual(await page.evaluate(() => document.activeElement?.getAttribute('type')), 'checkbox', 'Read-only checklist inputs must not add keyboard stops.');
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

                await page.locator('main .vp-doc').evaluate((node, html) => {
                    const fixture = document.createElement('section');
                    fixture.dataset.taskFixture = '';
                    fixture.innerHTML = html;
                    node.append(fixture);
                }, checkedFixture);
                const fixture = page.locator('[data-task-fixture]');
                await checkInputs(fixture, 2);
                assert.equal(await fixture.getByRole('checkbox', { name: 'Completed task', checked: true }).count(), 1);
                assert.equal(await fixture.getByRole('checkbox', { name: 'Pending task', checked: false }).count(), 1);
                const ids = await page.locator('main input[type="checkbox"]').evaluateAll((inputs) => inputs.map((input) => input.id));
                assert.equal(new Set(ids).size, ids.length);
                await writeFile(resolve(output, `${theme}-${width}-checked.yml`), await fixture.ariaSnapshot());
                await captureList(page, fixture, resolve(output, `${theme}-${width}-checked.png`));
                await fixture.evaluate((node) => node.remove());
                report.layouts.push({
                    theme,
                    width,
                    common: 4,
                    node: 5,
                    bun: 2,
                    labelledNativeInputs: true,
                    keyboardSwitching: true,
                    readOnly: true,
                    checkedState: true,
                    noHorizontalOverflow: true,
                });
            }
        } catch (error) {
            await page.screenshot({ path: resolve(output, `${theme}-failure.png`) });
            throw error;
        } finally {
            await context.close();
        }

        const staticContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: theme, viewport: { width: 390, height: 1000 } });
        try {
            const page = await staticContext.newPage();
            await page.goto(`${values.url}${route}`, { waitUntil: 'load' });
            await page.evaluate(() => document.fonts.ready);
            await checkInputs(page.locator('#checklist + p + ul.task-list-container'), 4);
            await checkInputs(page.locator('#checklist ~ .runtime-group'), 5);
            assert.equal(await page.locator('main input[type="checkbox"]').count(), 11);
            await page.emulateMedia({ media: 'print' });
            assert.equal(await page.getByRole('checkbox').count(), 11, 'Print must include both runtime checklists.');
            report.static.push({ theme, noJavaScript: true, allInputsServerRendered: true, printIncludesBothRuntimes: true });
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
console.log(`Task lists: ${report.layouts.length} themed layouts, labelled checked/unchecked inputs and ${report.static.length} no-JS/print cases.`);
