import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: { url: { type: 'string', default: 'http://127.0.0.1:4185' }, output: { type: 'string', default: '.playwright-cli/quickstart' } } });
if (!process.env.PLAYWRIGHT_MODULE) throw new Error('Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs. This check starts no server.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href);
const output = resolve(values.output);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const deadline = setTimeout(() => {
    void browser.close();
}, 240_000);
const result = { steps: [], requests: [], scroll: [], focus: [], copy: [], contrast: [], animations: [], static: [], lifecycle: false, errors: [] };
const route = `${values.url}/en/guide/quickstart`;
const labels = ['Init', 'Contract', 'Generate', 'Handler', 'Inspect'];
const clients = ['curl · Connect', 'grpcurl · gRPC'];
const credentials = ['Valid JWT', 'No JWT', 'Invalid JWT'];
const body = { title: 'Your private page', body: 'This content requires a verified JWT.' };
const ready = (page) => page.waitForFunction(() => document.querySelector('.quickstart-steps button')?.disabled === false);

async function checkContrast(root) {
    const ratios = await root.evaluate((root) => {
        const rgba = (value) => {
            const parts = value.match(/[\d.]+/g).map(Number);
            return [parts[0], parts[1], parts[2], parts[3] ?? 1];
        };
        const composite = (front, back) => front.slice(0, 3).map((value, index) => value * front[3] + back[index] * (1 - front[3]));
        const background = (node) => {
            if (!node) return [255, 255, 255];
            const color = rgba(getComputedStyle(node).backgroundColor);
            return color[3] === 1 ? color.slice(0, 3) : composite(color, background(node.parentElement));
        };
        const luminance = (color) =>
            color
                .map((channel) => channel / 255)
                .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
                .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
        return [...root.querySelectorAll('p, button:not(:disabled)')]
            .filter((node) => node.checkVisibility() && node.textContent.trim())
            .map((node) => {
                const bg = background(node);
                const a = luminance(composite(rgba(getComputedStyle(node).color), bg));
                const b = luminance(bg);
                return { text: node.textContent.trim(), ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
            });
    });
    assert.ok(
        ratios.every((row) => row.ratio >= 4.5),
        JSON.stringify(ratios.filter((row) => row.ratio < 4.5)),
    );
    return Math.min(...ratios.map((row) => row.ratio));
}

async function checkScroll(root) {
    const panes = await root.locator('.quickstart-code div[class*="language-"]:visible').evaluateAll((panes) =>
        panes.map((pane) => {
            const pre = pane.querySelector('pre');
            const scrolls = (node, axis) => {
                const style = getComputedStyle(node);
                return (
                    /auto|scroll/.test(style[axis === 'y' ? 'overflowY' : 'overflowX']) &&
                    (axis === 'y' ? node.scrollHeight > node.clientHeight + 1 : node.scrollWidth > node.clientWidth + 1)
                );
            };
            return {
                vertical: Number(scrolls(pane, 'y')) + Number(scrolls(pre, 'y')),
                horizontal: Number(scrolls(pane, 'x')) + Number(scrolls(pre, 'x')),
                preMaxHeight: getComputedStyle(pre).maxHeight,
            };
        }),
    );
    assert.ok(panes.length > 0);
    assert.ok(
        panes.every((pane) => pane.vertical <= 1 && pane.horizontal <= 1 && pane.preMaxHeight === 'none'),
        JSON.stringify(panes),
    );
    return panes;
}

async function checkFocus(page, button) {
    await button.focus();
    await page.keyboard.press('Enter');
    const value = await button.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
            visible: node.matches(':focus-visible'),
            outline: style.outlineWidth,
            shadow: style.boxShadow,
            border: style.borderColor,
            height: node.getBoundingClientRect().height,
        };
    });
    assert.ok(value.visible && value.outline === '2px' && value.shadow === 'none' && value.border === 'rgba(0, 0, 0, 0)' && value.height >= 44, JSON.stringify(value));
    return value;
}

try {
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'], reducedMotion: 'reduce' });
        context.setDefaultTimeout(12_000);
        const page = await context.newPage();
        page.on('pageerror', (error) => result.errors.push(error.message));
        try {
            await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
            await ready(page);
            await page.evaluate((theme) => document.documentElement.classList.toggle('dark', theme === 'dark'), theme);
            const root = page.locator('.quickstart-showcase');
            const stepButtons = root.getByRole('group', { name: 'Quickstart steps', exact: true });
            for (const width of [1440, 768, 390, 320]) {
                await page.setViewportSize({ width, height: 1200 });
                for (let index = 0; index < labels.length; index++) {
                    const button = stepButtons.getByRole('button', { name: labels[index], exact: true });
                    await button.click();
                    const stage = root.locator('.quickstart-stage:visible');
                    assert.equal(await stage.count(), 1);
                    if (index < labels.length - 1) {
                        assert.equal(await root.locator('.quickstart-terminal').count(), 0);
                        assert.equal(await root.locator('.quickstart-response:visible').count(), 0);
                    } else {
                        assert.equal(await root.locator('.quickstart-response-body:visible').count(), 0);
                        assert.equal(await root.locator('.quickstart-response').getAttribute('data-state'), 'idle');
                    }
                    const layout = await root.evaluate((node) => ({
                        left: node.getBoundingClientRect().left,
                        right: node.getBoundingClientRect().right,
                        scroll: document.documentElement.scrollWidth,
                    }));
                    assert.ok(layout.left >= -1 && layout.right <= width + 1 && layout.scroll <= width + 1, JSON.stringify(layout));
                    result.steps.push({ theme, width, label: labels[index], layout, scroll: await checkScroll(stage) });
                    if (labels[index] === 'Handler') {
                        const registration = await stage.locator('.quickstart-registration code').innerText();
                        assert.ok(registration.includes('import { createServer }') && registration.includes('return createServer({'));
                        assert.ok(registration.includes('services: [greeterService, pageService]'));
                        assert.ok(registration.trimEnd().endsWith('}'));
                    }
                    if (width === 1440) result.focus.push({ theme, label: labels[index], ...(await checkFocus(page, button)) });
                }
                const terminal = root.locator('.quickstart-terminal');
                for (let client = 0; client < clients.length; client++) {
                    await terminal.getByRole('group', { name: 'Request client', exact: true }).getByRole('button', { name: clients[client], exact: true }).click();
                    for (let credential = 0; credential < credentials.length; credential++) {
                        await terminal.getByRole('group', { name: 'Request credentials', exact: true }).getByRole('button', { name: credentials[credential], exact: true }).click();
                        assert.equal(await terminal.locator('.quickstart-response-body:visible').count(), 0);
                        const command = terminal.locator('.quickstart-request-command');
                        const source = await command.locator('code').innerText();
                        assert.ok(source.startsWith(client === 0 ? 'curl --http2-prior-knowledge' : 'grpcurl -plaintext'));
                        if (credential === 1) assert.ok(!source.includes('Authorization'));
                        else assert.ok(source.includes(credential === 2 ? 'Bearer invalid' : 'Bearer $TOKEN'));
                        if (width === 1440) {
                            await command.getByRole('button', { name: 'Copy Code', exact: true }).click();
                            assert.equal((await page.evaluate(() => navigator.clipboard.readText())).trimEnd(), source.trimEnd());
                            result.copy.push({ theme, client, credential });
                        }
                        await terminal.getByRole('button', { name: 'Send request', exact: true }).click();
                        await terminal.locator('.quickstart-response-body code').waitFor();
                        const response = JSON.parse(await terminal.locator('.quickstart-response-body code').innerText());
                        const status = await terminal.getByRole('status').innerText();
                        if (credential === 0) {
                            assert.deepEqual(response, body);
                            assert.ok(status.includes(client === 0 ? 'HTTP/2 200' : 'gRPC 0 OK'));
                        } else {
                            assert.deepEqual(response, {
                                code: client === 0 ? 'unauthenticated' : 'Unauthenticated',
                                message: credential === 1 ? 'Missing credentials' : 'Authentication failed',
                            });
                            assert.ok(status.includes(client === 0 ? 'HTTP/2 401' : 'gRPC 16 Unauthenticated'));
                        }
                        result.requests.push({ theme, width, client, credential, status });
                        if (width === 1440) result.contrast.push({ theme, client, credential, minimum: await checkContrast(terminal) });
                    }
                }
                await terminal.getByRole('button', { name: 'Valid JWT', exact: true }).click();
                await terminal.getByRole('button', { name: 'Send request', exact: true }).click();
                await terminal.locator('.quickstart-response-body code').waitFor();
                await terminal.screenshot({ path: resolve(output, `${theme}-${width}-request.png`), timeout: 15_000 });
                const setup = root.locator('.quickstart-setup');
                await setup.evaluate((node) => {
                    node.open = true;
                });
                result.scroll.push({ theme, width, panes: await checkScroll(setup) });
                const pane = setup.locator('.quickstart-code div[class*="language-"]').first();
                const canScroll = await pane.evaluate((node) => node.scrollHeight > node.clientHeight + 1);
                assert.ok(canScroll, 'The complete setup must exercise a genuinely long code pane.');
                await pane.evaluate((node) => {
                    node.scrollTop = 0;
                    node.querySelector('pre').focus();
                });
                await page.keyboard.press('ArrowDown');
                await page.waitForFunction((node) => node.scrollTop > 0, await pane.elementHandle(), { timeout: 3000 });
                await setup.evaluate((node) => {
                    node.open = false;
                });
                const spec = root.locator('.quickstart-stage:visible').getByText('Inspect the generated OpenAPI document', { exact: true });
                await spec.click();
                await checkScroll(root.locator('.quickstart-stage:visible'));
                await spec.click();
            }
            await writeFile(resolve(output, `tree-${theme}.yml`), await root.ariaSnapshot());
            await page.evaluate(() => {
                window.quickstartLifecycleProbe = 29;
            });
            await page.getByRole('link', { name: 'Build the service step by step', exact: true }).click();
            await page.waitForURL('**/en/guide/quickstart-manual');
            await root.waitFor({ state: 'detached' });
            await page.getByRole('link', { name: 'Overview', exact: true }).click();
            await page.waitForURL('**/en/guide/quickstart');
            await ready(page);
            assert.equal(await page.evaluate(() => window.quickstartLifecycleProbe), 29);
            assert.equal(await root.getAttribute('data-step'), 'init');
            assert.equal(await root.locator('.quickstart-terminal').count(), 0);
            result.lifecycle = true;
        } finally {
            await context.close();
        }
    }
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'], reducedMotion: 'no-preference', viewport: { width: 1440, height: 1000 } });
        context.setDefaultTimeout(12_000);
        const page = await context.newPage();
        page.on('pageerror', (error) => result.errors.push(error.message));
        try {
            await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
            await ready(page);
            await page.evaluate((theme) => document.documentElement.classList.toggle('dark', theme === 'dark'), theme);
            const root = page.locator('.quickstart-showcase');
            assert.equal(await root.getAttribute('data-animation'), 'complete');
            for (const label of labels) {
                await root.getByRole('group', { name: 'Quickstart steps', exact: true }).getByRole('button', { name: label, exact: true }).click();
                await page.waitForFunction(() => {
                    const node = document.querySelector('.quickstart-showcase');
                    return node?.dataset.animation === 'playing' && Number(node.dataset.frame) > 0.2 && Number(node.dataset.frame) < 0.5;
                });
                const active = await root.getAttribute('data-step');
                const stage = root.locator('.quickstart-stage:visible');
                assert.ok(
                    await stage
                        .locator('.quickstart-code pre code > .line')
                        .evaluateAll((lines) =>
                            lines.some(
                                (line) => getComputedStyle(line).opacity !== '1' || [...line.querySelectorAll('.quickstart-character')].some((char) => char.style.opacity === '0'),
                            ),
                        ),
                );
                const code = stage.locator('.quickstart-code').first();
                const source = await code.locator('code').textContent();
                await root.getByRole('button', { name: 'Pause animation', exact: true }).click();
                if (label === 'Generate') assert.equal(await stage.locator('.quickstart-generated').evaluate((node) => node.open), false);
                if (label === 'Handler') assert.equal(await stage.locator('.quickstart-startup').evaluate((node) => node.open), false);
                if (label === 'Inspect') assert.equal(await stage.locator('.quickstart-response-body:visible').count(), 0);
                const frame = await root.getAttribute('data-frame');
                await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
                assert.equal(await root.getAttribute('data-frame'), frame);
                if (label === 'Init' || label === 'Contract') {
                    await code.screenshot({ path: resolve(output, `${theme}-${label.toLowerCase()}-paused.png`), timeout: 15_000 });
                    await root.locator('.quickstart-navigation').screenshot({ path: resolve(output, `${theme}-${label.toLowerCase()}-controls.png`), timeout: 15_000 });
                }
                await code.getByRole('button', { name: 'Copy Code', exact: true }).click();
                assert.equal((await page.evaluate(() => navigator.clipboard.readText())).trimEnd(), source.trimEnd());
                const beforeSends = Number(await root.getAttribute('data-sends'));
                await root.getByRole('button', { name: 'Replay animation', exact: true }).click();
                if (label !== 'Contract') {
                    await page.waitForFunction(
                        (expected) => {
                            const node = document.querySelector('.quickstart-showcase');
                            return node?.dataset.animation === 'playing' && Number(node.dataset.animationPart) === expected;
                        },
                        label === 'Handler' ? 2 : 1,
                    );
                    const selector =
                        label === 'Init'
                            ? '.quickstart-created-files'
                            : label === 'Generate'
                              ? '.quickstart-generated'
                              : label === 'Handler'
                                ? '.quickstart-startup'
                                : '.quickstart-response';
                    const outcome = stage.locator(selector);
                    assert.ok(await outcome.isVisible());
                    if (label === 'Generate' || label === 'Handler') {
                        assert.ok(await outcome.evaluate((node) => node.open));
                        assert.ok(
                            await outcome
                                .locator('code > .line')
                                .evaluateAll((lines) =>
                                    lines.some(
                                        (line) =>
                                            getComputedStyle(line).opacity !== '1' ||
                                            [...line.querySelectorAll('.quickstart-character')].some((char) => char.style.opacity === '0'),
                                    ),
                                ),
                        );
                    }
                    if (label === 'Inspect') {
                        await stage.locator('.quickstart-response-body code').waitFor();
                        assert.equal(Number(await root.getAttribute('data-sends')), beforeSends + 1);
                    }
                }
                await page.waitForFunction(() => document.querySelector('.quickstart-showcase')?.dataset.animation === 'complete', undefined, { timeout: 12_000 });
                assert.equal(await root.getAttribute('data-step'), active, 'Animation must not advance the tutorial.');
                assert.equal(await stage.locator('.quickstart-character').count(), 0, 'Completed animation must restore native token markup.');
                if (label === 'Init') {
                    const tree = stage.locator('.quickstart-created-files');
                    assert.ok(await tree.isVisible());
                    const source = await tree.innerText();
                    assert.ok(source.includes('greeterService.ts') && source.includes('auth.ts') && !source.includes('pageService.ts'));
                }
                if (label === 'Generate') {
                    const generated = stage.locator('.quickstart-generated');
                    assert.ok(await generated.evaluate((node) => node.open));
                    assert.ok((await generated.innerText()).includes('export const PageService'));
                    assert.ok((await generated.innerText()).includes('export type GetPageResponse'));
                }
                if (label === 'Handler') {
                    const startup = stage.locator('.quickstart-startup');
                    assert.ok(await startup.evaluate((node) => node.open));
                    assert.ok((await startup.innerText()).includes('export JWKS_URI='));
                    assert.ok((await startup.innerText()).includes('pnpm start'));
                }
                if (label === 'Inspect') {
                    assert.deepEqual(JSON.parse(await stage.locator('.quickstart-response-body code').innerText()), body);
                    assert.equal(Number(await root.getAttribute('data-sends')), beforeSends + 1);
                }
                if (label !== 'Contract') {
                    const selector =
                        label === 'Init'
                            ? '.quickstart-created-files'
                            : label === 'Generate'
                              ? '.quickstart-generated'
                              : label === 'Handler'
                                ? '.quickstart-startup'
                                : '.quickstart-terminal';
                    await stage.locator(selector).screenshot({ path: resolve(output, `${theme}-${label.toLowerCase()}-outcome.png`), timeout: 15_000 });
                }
                result.animations.push({
                    theme,
                    label,
                    revealed: true,
                    paused: true,
                    replayed: true,
                    completeCopyWhilePaused: true,
                    manualStepPreserved: true,
                    operationalOutcomeShown: true,
                });
            }
            await page.setViewportSize({ width: 1440, height: 400 });
            await root.getByRole('button', { name: 'Replay animation', exact: true }).click();
            await page.waitForFunction(() => Number(document.querySelector('.quickstart-showcase')?.dataset.frame) > 0.05);
            await root.evaluate((node) => window.scrollTo({ top: node.getBoundingClientRect().bottom + scrollY + 25, behavior: 'instant' }));
            await page.waitForFunction(() => document.querySelector('.quickstart-showcase')?.dataset.animation === 'waiting');
            const frame = await root.getAttribute('data-frame');
            await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            assert.equal(await root.getAttribute('data-frame'), frame);
            await root.locator('.quickstart-navigation').scrollIntoViewIfNeeded();
            await page.waitForFunction((before) => Number(document.querySelector('.quickstart-showcase')?.dataset.frame) > Number(before), frame);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.waitForFunction(() => document.querySelector('.quickstart-showcase')?.dataset.animation === 'complete');
            assert.equal(await root.locator('.quickstart-character').count(), 0);
            assert.ok(await root.getByRole('button', { name: 'Replay animation', exact: true }).isDisabled());
            await root.getByRole('button', { name: 'Send request', exact: true }).click();
            assert.deepEqual(JSON.parse(await root.locator('.quickstart-response-body code').innerText()), body);
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await root.getByRole('button', { name: 'Replay animation', exact: true }).click();
            await page.waitForFunction(() => document.querySelector('.quickstart-showcase')?.dataset.animation === 'playing');
            await page.evaluate(() => {
                window.quickstartDetached = document.querySelector('.quickstart-showcase');
            });
            await page.getByRole('link', { name: 'Build the service step by step', exact: true }).click();
            await page.waitForURL('**/en/guide/quickstart-manual');
            await root.waitFor({ state: 'detached' });
            const detached = await page.evaluate(() => ({
                connected: window.quickstartDetached.isConnected,
                characters: window.quickstartDetached.querySelectorAll('.quickstart-character').length,
                frame: window.quickstartDetached.dataset.frame,
            }));
            await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            assert.equal(await page.evaluate(() => window.quickstartDetached.dataset.frame), detached.frame);
            assert.equal(detached.connected, false);
            assert.equal(detached.characters, 0);
            result.animations.push({ theme, offscreenPause: true, visibleResume: true, reducedMotion: true, unmountCleanup: true });
        } finally {
            await context.close();
        }
    }
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1200 } });
        context.setDefaultTimeout(12_000);
        try {
            const page = await context.newPage();
            await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
            await page.evaluate((theme) => document.documentElement.classList.toggle('dark', theme === 'dark'), theme);
            const root = page.locator('.quickstart-showcase');
            assert.equal(await root.locator('.quickstart-terminal').count(), 0);
            assert.equal(await root.locator('.quickstart-steps button:not(:disabled)').count(), 0);
            const all = root.locator('.quickstart-static-steps');
            await all.locator('summary').click();
            assert.equal(await all.getByRole('heading', { level: 3 }).count(), labels.length);
            assert.ok((await all.innerText()).includes('Your private page'));
            const staticSource = await all.innerText();
            assert.ok(staticSource.includes('http://localhost:5000/page.v1.PageService/GetPage'));
            assert.ok(staticSource.includes('Bearer $TOKEN'));
            result.static.push({ theme, width: 390, scriptDisabled: true, panes: await checkScroll(all) });
        } finally {
            await context.close();
        }
    }
    assert.deepEqual(result.errors, []);
} catch (error) {
    result.errors.push(error.stack ?? String(error));
    throw error;
} finally {
    clearTimeout(deadline);
    await writeFile(resolve(output, 'report.json'), `${JSON.stringify(result, null, 2)}\n`);
    await browser.close();
}
console.log(
    `Quickstart browser: ${result.steps.length} step cases, ${result.requests.length} emulated requests, ${result.scroll.length} complete-setup checks, ${result.copy.length} native copies; no early response or nested code scrollbars.`,
);
