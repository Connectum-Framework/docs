import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveConfig } from 'vitepress';

const config = await resolveConfig(new URL('../../', import.meta.url).pathname, 'build');
const metadata = async (page, head = []) => config.transformHead({ page, title: 'Computed page title', description: 'Computed description', head });
const value = (head, property) => head.filter(([tag, attributes]) => tag === 'meta' && attributes.property === property).map(([, attributes]) => attributes.content);

test('Open Graph uses the rendered metadata and clean file or directory URLs', async () => {
    for (const [page, url] of [
        ['en/guide/quickstart.md', 'https://connectum.dev/en/guide/quickstart'],
        ['en/index.md', 'https://connectum.dev/en/'],
        ['en/api/@connectum/core/index.md', 'https://connectum.dev/en/api/@connectum/core/'],
    ]) {
        const head = await metadata(page);
        assert.deepEqual(value(head, 'og:title'), ['Computed page title']);
        assert.deepEqual(value(head, 'og:description'), ['Computed description']);
        assert.deepEqual(value(head, 'og:url'), [url]);
    }
    for (const property of ['og:title', 'og:description', 'og:url']) assert.deepEqual(value(config.site.head, property), []);
});

test('the language entry page keeps its existing canonical destination in Open Graph', async () => {
    const head = await metadata('index.md', [['link', { rel: 'canonical', href: 'https://connectum.dev/en/' }]]);
    assert.deepEqual(value(head, 'og:url'), ['https://connectum.dev/en/']);
});

test('compatibility metadata identifies the destination and retains canonical and noindex', async () => {
    const head = await metadata('en/packages/core.md');
    assert.deepEqual(value(head, 'og:url'), ['https://connectum.dev/en/guide/server']);
    assert.ok(head.some(([tag, attributes]) => tag === 'link' && attributes.rel === 'canonical' && attributes.href === 'https://connectum.dev/en/guide/server'));
    assert.ok(head.some(([tag, attributes]) => tag === 'meta' && attributes.name === 'robots' && attributes.content === 'noindex,follow'));
});
