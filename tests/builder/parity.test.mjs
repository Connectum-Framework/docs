import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { buildProject, defaultSelection, scaffoldConfig } from '../../.vitepress/builder/model.ts';

test('browser scaffold matches the upstream CLI transform across 480 supported combinations', { skip: !process.env.CONNECTUM_FRAMEWORK_ROOT }, async () => {
    const root = process.env.CONNECTUM_FRAMEWORK_ROOT;
    const { transformBase } = await import(pathToFileURL(resolve(root, 'packages/cli/src/scaffold/transform.ts')).href);
    const base = JSON.parse(await readFile(new URL('../../.vitepress/builder/generated/base.json', import.meta.url), 'utf8'));
    let checked = 0;
    for (const { runtime, packageManager, nodeExec } of [
        { runtime: 'node', packageManager: 'pnpm', nodeExec: 'raw' },
        { runtime: 'node', packageManager: 'npm', nodeExec: 'raw' },
        { runtime: 'node', packageManager: 'pnpm', nodeExec: 'tsx' },
        { runtime: 'node', packageManager: 'npm', nodeExec: 'tsx' },
        { runtime: 'bun', packageManager: 'bun', nodeExec: 'raw' },
    ])
        for (const adapter of ['nats', 'kafka', 'redpanda', 'redis', 'amqp', null])
            for (let mask = 0; mask < 16; mask++) {
                const selection = {
                    ...defaultSelection(),
                    runtime,
                    packageManager,
                    nodeExec,
                    adapter: adapter ?? 'nats',
                    events: adapter !== null,
                    auth: mask % 2 === 1,
                    otel: Math.floor(mask / 2) % 2 === 1,
                    catalog: Math.floor(mask / 4) % 2 === 1,
                    resilience: mask >= 8 ? ['timeout', 'retry'] : [],
                };
                const expected = Object.fromEntries(transformBase(new Map(Object.entries(base)), scaffoldConfig(selection)));
                const manifest = JSON.parse(expected['package.json']);
                delete manifest.author;
                expected['package.json'] = `${JSON.stringify(manifest, null, 2)}\n`;
                assert.deepEqual(buildProject(selection), expected, JSON.stringify(selection));
                checked++;
            }
    assert.equal(checked, 480);
});
