import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { createMarkdownRenderer } from 'vitepress';
import {
    builtSiteTarget,
    checkDocumentationLink,
    checkHttpLink,
    checkLocalLink,
    documentationTargets,
    htmlHasFragment,
    markdownLinks,
    packageReadmes,
} from '../../scripts/lib/package-readme-links.mjs';

const markdown = await createMarkdownRenderer(process.cwd());
const temporaryRoot = resolve(import.meta.dirname, '../../.tmp');
await mkdir(temporaryRoot, { recursive: true });

test('README extraction includes reference links, linked badges, autolinks and HTML without treating code as links', () => {
    const source =
        '# @connectum/auth\n\n[guide][g]\n[g]: https://connectum.dev/en/guide/server#lifecycle\n\n[![status](https://img.example/status)](https://example.test/build)\n<https://example.test/api>\n<a href="https://example.test/?a=1&amp;b=2">HTML</a>\n`[code](https://not-a-link.test)`';
    assert.deepEqual(markdownLinks(markdown, source), [
        'https://connectum.dev/en/guide/server#lifecycle',
        'https://example.test/build',
        'https://img.example/status',
        'https://example.test/api',
        'https://example.test/?a=1&b=2',
    ]);
});

test('built routes and local README anchors are checked instead of accepting a page solely because it exists', async () => {
    const root = await mkdtemp(resolve(temporaryRoot, 'connectum-readme-links-'));
    try {
        const readme = resolve(root, 'README.md');
        await writeFile(readme, '# Package\n\n## Usage\n\n## Usage\n\n## [Linked usage](guide.md)\n');
        await writeFile(resolve(root, 'server.html'), '<h2 id="lifecycle">Lifecycle</h2>');
        assert.equal(builtSiteTarget(root, new URL('https://connectum.dev/server')), resolve(root, 'server.html'));
        assert.equal(builtSiteTarget(root, new URL('https://connectum.dev/missing')), undefined);
        assert.equal(checkLocalLink({ markdown, root, readme, href: '#usage-1' }).ok, true);
        assert.equal(checkLocalLink({ markdown, root, readme, href: '#gone' }).ok, false);
        assert.equal(checkLocalLink({ markdown, root, readme, href: '#linked-usage' }).ok, true);
        assert.equal(htmlHasFragment('<a id="user-content-usage">', 'usage'), true);
        assert.equal(htmlHasFragment('<h1 id="present">', 'missing'), false);
        await mkdir(resolve(root, 'packages/test/tests/integration'), { recursive: true });
        await writeFile(resolve(root, 'packages/test/README.md'), '# Test');
        await writeFile(resolve(root, 'packages/test/tests/integration/README.md'), '# Integration');
        assert.equal(packageReadmes(root, ['test']).length, 2);
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});

test('HTTP verification observes real status and fragment content, including a broken anchor on an otherwise successful page', async () => {
    const root = await mkdtemp(resolve(temporaryRoot, 'connectum-readme-http-'));
    const server = createServer((req, res) => {
        res.writeHead(req.url === '/missing' || req.url.startsWith('/en/guide/scaffolding-commands') ? 404 : 200, { 'content-type': 'text/html' });
        res.end('<h2 id="supported">Supported</h2>');
    });
    await new Promise((done) => server.listen(0, '127.0.0.1', done));
    try {
        const origin = `http://127.0.0.1:${server.address().port}`;
        const fetchPage = async (url) => {
            const response = await fetch(url);
            return { status: response.status, html: await response.text(), finalUrl: response.url };
        };
        assert.equal((await checkHttpLink(new URL(`${origin}/ok#supported`), fetchPage)).ok, true);
        assert.equal((await checkHttpLink(new URL(`${origin}/ok#gone`), fetchPage)).ok, false);
        assert.equal((await checkHttpLink(new URL(`${origin}/missing`), fetchPage)).reason, 'HTTP 404');
        for (const path of ['en/packages/cli.html', 'en/guide/scaffolding-commands.html']) {
            await mkdir(resolve(root, path, '..'), { recursive: true });
            await writeFile(resolve(root, path), '<h1>Present in the build</h1>');
        }
        const result = await checkDocumentationLink({ siteRoot: root, url: new URL('https://connectum.dev/en/packages/cli'), siteUrl: origin, fetchPage });
        assert.equal(result.reason, 'HTTP 404');
        assert.equal(result.target, `${origin}/en/guide/scaffolding-commands`);
    } finally {
        await new Promise((done) => server.close(done));
        await rm(root, { recursive: true, force: true });
    }
});

test('published compatibility URLs retain queries while checking their real final route and fragment', () => {
    const urls = documentationTargets(new URL('https://connectum.dev/en/guide/interceptors/built-in?pm=bun#circuit-breaker-placement-and-error-classification'));
    assert.equal(urls.at(-1).href, 'https://connectum.dev/en/guide/interceptors/circuit-breaker?pm=bun');
    const nested = documentationTargets(new URL('https://connectum.dev/en/packages/testing?pm=bun#catalog-calls'));
    assert.equal(nested.at(-1).href, 'https://connectum.dev/en/guide/testing/integration?pm=bun#catalog-calls');
});
