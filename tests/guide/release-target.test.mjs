import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../../', import.meta.url);
test('current release documentation does not inherit npm-latest availability warnings', () => {
    const paths = readdirSync(new URL('en/', root), { recursive: true }).filter(
        (path) => path.endsWith('.md') && !path.startsWith('contributing/adr/') && !path.startsWith('api/'),
    );
    for (const path of paths) {
        const source = readFileSync(new URL(`en/${path}`, root), 'utf8');
        assert.doesNotMatch(
            source,
            /not (?:yet )?published to npm|upcoming[^\n]*(?:1\.3|@connectum)|planned for the upcoming|::: (?:info|tip|warning) (?:Preview|Upcoming)/i,
            path,
        );
    }
    for (const path of ['.vitepress/theme/components/ServiceBuilder.vue', 'scripts/update-builder-engine.mjs', '.vitepress/builder/generated/provenance.json']) {
        assert.doesNotMatch(readFileSync(new URL(path, root), 'utf8'), /releaseStatus|registryVersion|not published yet/, path);
    }
});
