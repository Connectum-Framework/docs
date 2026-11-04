import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { deployments } from '../.vitepress/homepage/deployment-model.mjs';
import { chains, handlerOutcomes } from '../.vitepress/interceptors/settings.ts';
import { annotations, methods } from '../.vitepress/openapi/settings.ts';

const { values } = parseArgs({ options: { url: { type: 'string', default: 'http://127.0.0.1:4185' }, output: { type: 'string', default: '.tmp/accepted-demos-browser' } } });
assert.ok(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs. This check starts no server.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href);
const story = JSON.parse(await readFile(new URL('../.vitepress/homepage/native.json', import.meta.url), 'utf8'));
const output = resolve(values.output);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = { completed: false, validation: [], interceptors: [], openapi: [], homepage: [], builder: [], layouts: [], errors: [] };
const deadline = setTimeout(() => void browser.close(), 240_000);

async function visit(page, route) {
    await page.goto(`${values.url}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForFunction(() => document.querySelector('#app')?.__vue_app__);
}

async function attribute(locator, name, value) {
    await locator.and(locator.page().locator(`[${name}="${value}"]`)).waitFor({ state: 'attached' });
}

async function capture(page, theme, name, selector) {
    const region = page.locator(selector);
    await region.scrollIntoViewIfNeeded();
    await writeFile(resolve(output, `${theme}-${name}.yml`), await region.ariaSnapshot());
    await page.screenshot({ path: resolve(output, `${theme}-${name}.png`) });
}

try {
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({
            colorScheme: theme,
            reducedMotion: 'reduce',
            viewport: { width: 1440, height: 1000 },
            permissions: ['clipboard-read', 'clipboard-write'],
        });
        context.setDefaultTimeout(20_000);
        const page = await context.newPage();
        page.on('pageerror', (error) => report.errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') report.errors.push(message.text());
        });
        try {
            await visit(page, '/en/guide/validation');
            const validation = page.locator('.validation-showcase');
            await attribute(validation, 'data-ready', 'true');
            for (const [sku, quantity, code, handler] of [
                ['A-1', '2', 'OK', true],
                ['A-1', '0', 'InvalidArgument', false],
                ['A-1', '2', 'OK', true],
                ['UNKNOWN', '2', 'NotFound', true],
            ]) {
                await validation.getByLabel('SKU', { exact: true }).fill(sku);
                await validation.getByLabel('Quantity', { exact: true }).fill(quantity);
                await attribute(page.locator('.validation-live-result'), 'data-outcome', code);
                assert.ok((await validation.locator('.validation-boundaries').innerText()).includes(handler ? 'Called locally' : 'Not called'));
                assert.equal(await validation.getByLabel('Quantity', { exact: true }).getAttribute('aria-invalid'), String(quantity === '0'));
                report.validation.push({ theme, sku, quantity, code, handler });
            }
            await validation.getByRole('button', { name: 'Reset', exact: true }).click();
            await attribute(page.locator('.validation-live-result'), 'data-outcome', 'OK');
            await capture(page, theme, 'validation', '.validation-showcase');

            await visit(page, '/en/guide/interceptors');
            const interceptors = page.locator('.interceptors-showcase');
            await attribute(interceptors, 'data-phase', 'ready');
            for (const chain of chains) {
                for (const outcome of handlerOutcomes) {
                    await interceptors.getByLabel('Interceptor chain', { exact: true }).selectOption(chain.id);
                    await interceptors.getByLabel('Handler outcome', { exact: true }).selectOption(outcome.id);
                    await attribute(interceptors, 'data-phase', 'ready');
                    const log = await interceptors.locator('.interceptors-result .interceptors-log li').allTextContents();
                    const failure = outcome.id === 'failure';
                    const before = chain.order.map((name) => `${name}: before`);
                    const after =
                        chain.id === 'audit-first'
                            ? ['stockTag: after (set header)', 'audit: after (header = fixture)']
                            : chain.id === 'tag-first'
                              ? ['audit: after (header = unset)', 'stockTag: after (set header)']
                              : ['audit: after (header = unset)'];
                    assert.deepEqual(log, failure ? [...before, 'handler: throw NotFound'] : [...before, 'handler: return 7 units', ...after]);
                    const caller = await interceptors.locator('.interceptors-caller').innerText();
                    assert.ok(caller.includes(failure ? 'NotFound' : 'Successful call'));
                    assert.ok(caller.includes(failure || chain.id === 'audit-only' ? '(not set)' : 'fixture'));
                    report.interceptors.push({ theme, chain: chain.id, outcome: outcome.id, log });
                }
            }
            await interceptors.getByRole('button', { name: 'Reset', exact: true }).click();
            await attribute(interceptors, 'data-phase', 'ready');
            await capture(page, theme, 'interceptors', '.interceptors-showcase');

            await visit(page, '/en/guide/openapi');
            const openapi = page.locator('.openapi-showcase');
            await attribute(openapi, 'data-phase', 'ready');
            for (const method of methods) {
                for (const annotation of annotations) {
                    await openapi.getByLabel('RPC in the base spec', { exact: true }).selectOption(method.id);
                    await openapi.getByLabel('Method auth option', { exact: true }).selectOption(annotation.id);
                    await attribute(openapi, 'data-phase', 'ready');
                    const kind = method.id === 'WatchStock' ? 'skipped' : annotation.id === 'conflict' ? 'rejected' : 'patched';
                    assert.equal(await openapi.getAttribute('data-result'), kind);
                    const outcome = await openapi.locator('.openapi-outcome').innerText();
                    if (kind === 'skipped') assert.ok(outcome.includes('No POST to patch'));
                    else if (kind === 'rejected') assert.ok(outcome.includes('Public and internal conflict'));
                    else {
                        const text = await openapi.locator('.openapi-output-code code').innerText();
                        const fragment = JSON.parse(text);
                        const operation = fragment.paths['/shop.v1.InventoryService/CheckStock'].post;
                        assert.deepEqual(operation.security, annotation.id === 'public' ? [] : annotation.id === 'internal' ? [{ internalToken: [] }] : [{ bearerAuth: [] }]);
                        if (annotation.id === 'internal') assert.ok(text.includes('x-internal-token'));
                        if (annotation.id === 'deny') assert.ok(outcome.includes('Deny is not encoded by security'));
                    }
                    report.openapi.push({ theme, method: method.id, annotation: annotation.id, kind });
                }
            }
            await openapi.getByRole('button', { name: 'Reset', exact: true }).click();
            await attribute(openapi, 'data-phase', 'ready');
            await capture(page, theme, 'openapi', '.openapi-showcase');

            await visit(page, '/en/');
            const code = page.locator('.home-code');
            const deployment = page.locator('.deployment-panel');
            await attribute(code, 'data-phase', 'ready');
            await attribute(page.locator('.home-deployments'), 'data-phase', 'ready');
            for (const [index, scene] of story.scenes.entries()) {
                await code.getByRole('button', { name: scene.stepLabel, exact: true }).click();
                await attribute(code, 'data-scene', String(index));
                assert.ok((await code.innerText()).includes(scene.stepLabel));
            }
            assert.ok((await code.innerText()).includes('Hello, Alice!'));
            await code.getByRole('button', { name: 'Replay animation', exact: true }).click();
            await attribute(code, 'data-playing', 'true');
            await code.getByRole('button', { name: 'Pause animation', exact: true }).click();
            await attribute(code, 'data-playing', 'false');
            await code.getByRole('button', { name: story.scenes.at(-1).stepLabel, exact: true }).click();
            await capture(page, theme, 'homepage-code', '.home-code');
            for (const item of deployments) {
                await deployment.getByRole('button', { name: item.label, exact: true }).click();
                await attribute(deployment, 'data-scene', item.id);
                assert.ok((await deployment.locator('.deployment-stage').ariaSnapshot()).includes(item.label));
            }
            assert.ok(await deployment.getByRole('button', { name: 'Replay deployment animation', exact: true }).isDisabled());
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await deployment.getByRole('button', { name: 'Replay deployment animation', exact: true }).click();
            await attribute(deployment, 'data-playing', 'true');
            await deployment.getByRole('button', { name: 'Pause deployment animation', exact: true }).click();
            await attribute(deployment, 'data-playing', 'false');
            await page.emulateMedia({ reducedMotion: 'reduce' });
            report.homepage.push({ theme, codeSteps: story.scenes.length, deploymentSteps: deployments.length, replayAndPause: true, reducedMotionStopsDeployment: true });
            await capture(page, theme, 'homepage-deployment', '.deployment-panel');

            await visit(page, '/en/builder');
            const builder = page.locator('.service-builder');
            await builder.getByRole('button', { name: 'Reset', exact: true }).click();
            await builder.getByLabel('Project name', { exact: true }).fill('review-service');
            await builder.getByRole('checkbox', { name: /^JWT authentication/ }).check();
            const command = builder.getByRole('region', { name: 'Scaffold command', exact: true });
            assert.match(await command.innerText(), /review-service.*--auth/s);
            assert.ok((await builder.locator('.builder-code').innerText()).includes('JwtAuth'));
            await builder.getByRole('checkbox', { name: /Public SayHello/ }).uncheck();
            assert.match(await builder.locator('.builder-code').innerText(), /requires/);
            await builder.getByRole('checkbox', { name: /^Events/ }).check();
            await builder.getByLabel('Event transport', { exact: true }).selectOption('redis');
            assert.ok((await builder.locator('.builder-code').innerText()).includes('RedisAdapter'));
            await builder.getByRole('radio', { name: 'Bun', exact: true }).check();
            assert.match(await command.innerText(), /--runtime bun/);
            assert.match(await command.innerText(), /--package-manager bun/);
            assert.match(await builder.getByRole('region', { name: 'Install and start commands', exact: true }).innerText(), /bun install/);
            await builder.getByRole('button', { name: 'Copy command', exact: true }).click();
            assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await command.locator('code').innerText());
            const pending = page.waitForEvent('download');
            await builder.getByRole('button', { name: /Download project .zip/ }).click();
            const download = await pending;
            assert.equal(download.suggestedFilename(), 'review-service.zip');
            const archive = resolve(output, `${theme}-review-service.zip`);
            await download.saveAs(archive);
            const zipCheck = execFileSync('unzip', ['-t', archive], { encoding: 'utf8' });
            await writeFile(resolve(output, `${theme}-archive.txt`), zipCheck);
            const packageSource = execFileSync('unzip', ['-p', archive, 'review-service/package.json'], { encoding: 'utf8' });
            assert.equal(JSON.parse(packageSource).name, 'review-service');
            assert.ok(packageSource.includes('@connectum/events-redis'));
            await builder.getByLabel('Project name', { exact: true }).fill('Invalid Name');
            assert.equal(await builder.getByLabel('Project name', { exact: true }).getAttribute('aria-invalid'), 'true');
            assert.ok(await builder.getByRole('button', { name: /Download project .zip/ }).isDisabled());
            await builder.getByRole('button', { name: 'Reset', exact: true }).click();
            report.builder.push({
                theme,
                authChangesCode: true,
                privateContract: true,
                redisAdapter: true,
                bunCommand: true,
                copy: true,
                archive: download.suggestedFilename(),
                invalidNameBlocksDownload: true,
            });
            await capture(page, theme, 'builder', '.builder-workspace');

            for (const [route, selector] of [
                ['/en/guide/validation', '.validation-showcase'],
                ['/en/guide/interceptors', '.interceptors-showcase'],
                ['/en/guide/openapi', '.openapi-showcase'],
                ['/en/', '.home-code'],
                ['/en/builder', '.service-builder'],
            ]) {
                await page.setViewportSize({ width: 390, height: 950 });
                await visit(page, route);
                if (selector === '.validation-showcase') await attribute(page.locator(selector), 'data-ready', 'true');
                else if (selector !== '.service-builder') await attribute(page.locator(selector), 'data-phase', 'ready');
                const dimensions = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
                assert.ok(dimensions.document <= dimensions.width + 1, `${route}: ${JSON.stringify(dimensions)}`);
                await capture(page, theme, `mobile-${route.split('/').filter(Boolean).at(-1)}`, selector);
                report.layouts.push({ theme, route, ...dimensions });
            }
        } catch (error) {
            await page.screenshot({ path: resolve(output, `${theme}-failure.png`) });
            await writeFile(resolve(output, `${theme}-failure.yml`), await page.locator('body').ariaSnapshot());
            throw error;
        } finally {
            await context.close();
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
    `Accepted demos: ${report.validation.length} validation cases, ${report.interceptors.length} chains/outcomes, ${report.openapi.length} overlays, both homepage players and Builder downloads in both themes; ${report.layouts.length} mobile pages.`,
);
