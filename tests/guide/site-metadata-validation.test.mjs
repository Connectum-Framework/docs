import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, relative, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateSiteMetadata } from '../../scripts/lib/site-metadata.mjs';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const page = (url) => `<html><head>
<meta property="og:title" content="Page title">
<meta property="og:description" content="Page description">
<meta property="og:url" content="${url}">
</head><body></body></html>`;
const home = page('https://connectum.dev/en/');

function withBuild(check) {
    const directory = mkdtempSync(resolve(tmpdir(), 'connectum-site-metadata-'));
    const write = (file, content) => {
        const path = resolve(directory, file);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, content);
    };
    const remove = (file) => rmSync(resolve(directory, file));
    const displayPath = (file) => relative(projectRoot, resolve(directory, file));
    try {
        write('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: https://connectum.dev/sitemap.xml\n');
        write('sitemap.xml', '<urlset><url><loc>https://connectum.dev/en/</loc></url></urlset>');
        write('en/index.html', home);
        write('en/packages/core.html', page('https://connectum.dev/en/guide/server').replace('</head>',
            '<link rel="canonical" href="https://connectum.dev/en/guide/server"><meta name="robots" content="noindex,follow"></head>'));
        write('assets/figure.html', '<html><body><svg></svg></body></html>');
        check({ directory, write, remove, displayPath });
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
}

test('built metadata accepts a clean output tree', () => withBuild(({ directory }) => {
    assert.deepEqual(validateSiteMetadata(directory), []);
}));

test('built metadata reports another sitemap URL in robots.txt', () => withBuild(({ directory, write, displayPath }) => {
    write('robots.txt', 'Sitemap: https://example.invalid/sitemap.xml\n');
    assert.deepEqual(validateSiteMetadata(directory), [
        `${displayPath('robots.txt')}: expected one Sitemap: https://connectum.dev/sitemap.xml, found ["https://example.invalid/sitemap.xml"]`,
    ]);
}));

test('built metadata reports two Sitemap directives even when both are canonical', () => withBuild(({ directory, write, displayPath }) => {
    write('robots.txt', 'Sitemap: https://connectum.dev/sitemap.xml\nSitemap: https://connectum.dev/sitemap.xml\n');
    assert.deepEqual(validateSiteMetadata(directory), [
        `${displayPath('robots.txt')}: expected one Sitemap: https://connectum.dev/sitemap.xml, found ["https://connectum.dev/sitemap.xml","https://connectum.dev/sitemap.xml"]`,
    ]);
}));

test('built metadata reports a missing robots.txt', () => withBuild(({ directory, remove, displayPath }) => {
    remove('robots.txt');
    assert.deepEqual(validateSiteMetadata(directory), [
        `${displayPath('robots.txt')}: expected one Sitemap: https://connectum.dev/sitemap.xml, found []`,
    ]);
}));

test('built metadata rejects a README HTML page with otherwise valid metadata', () => withBuild(({ directory, write, displayPath }) => {
    write('README.html', page('https://connectum.dev/README'));
    assert.deepEqual(validateSiteMetadata(directory), [
        `${displayPath('README.html')}: found repository-only page; expected no README.html`,
    ]);
}));

test('built metadata rejects a README sitemap entry without a README page', () => withBuild(({ directory, write, displayPath }) => {
    write('sitemap.xml', '<urlset><url><loc>https://connectum.dev/README</loc></url></urlset>');
    assert.deepEqual(validateSiteMetadata(directory), [
        `${displayPath('sitemap.xml')}: found repository-only URL https://connectum.dev/README`,
    ]);
}));

test('built metadata reports an Open Graph URL that is not the page canonical', () => withBuild(({ directory, write, displayPath }) => {
    write('en/index.html', page('https://connectum.dev/'));
    assert.deepEqual(validateSiteMetadata(directory), [
        `${displayPath('en/index.html')}: expected og:url https://connectum.dev/en/, found "https://connectum.dev/"`,
    ]);
}));

for (const [property, content] of [['og:title', 'Page title'], ['og:description', 'Page description'], ['og:url', 'https://connectum.dev/en/']]) {
    test(`built metadata reports a duplicated ${property}`, () => withBuild(({ directory, write, displayPath }) => {
        write('en/index.html', home.replace('</head>', `<meta property="${property}" content="duplicate"></head>`));
        assert.deepEqual(validateSiteMetadata(directory), [
            `${displayPath('en/index.html')}: expected exactly one ${property}, found ["${content}","duplicate"]`,
        ]);
    }));

    test(`built metadata reports a missing ${property}`, () => withBuild(({ directory, write, displayPath }) => {
        write('en/index.html', home.replace(`<meta property="${property}" content="${content}">`, ''));
        assert.deepEqual(validateSiteMetadata(directory), [
            `${displayPath('en/index.html')}: expected exactly one ${property}, found []`,
        ]);
    }));
}

test('built metadata ignores HTML figures under assets without Open Graph tags', () => withBuild(({ directory, write }) => {
    write('assets/nested/figure.html', '<html><head><title>Standalone figure</title></head><body></body></html>');
    assert.deepEqual(validateSiteMetadata(directory), []);
}));

test('built metadata accepts the redirect destination as its Open Graph URL', () => withBuild(({ directory, write }) => {
    // The route map must also work when the HTML does not repeat a canonical link.
    write('en/packages/core.html', page('https://connectum.dev/en/guide/server'));
    assert.deepEqual(validateSiteMetadata(directory), []);
}));

for (const [name, link] of [
    ['href before rel', '<link href="https://connectum.dev/en/" rel="canonical">'],
    ['single quotes', "<link rel='canonical' href='https://connectum.dev/en/'>"],
    ['intervening attributes', '<link href="https://connectum.dev/en/" data-source="frontmatter" rel="canonical">'],
]) {
    test(`built metadata reads a canonical link with ${name}`, () => withBuild(({ directory, write }) => {
        write('index.html', home.replace('</head>', `${link}</head>`));
        assert.deepEqual(validateSiteMetadata(directory), []);
    }));
}

test('built metadata rejects two canonical links even when they agree', () => withBuild(({ directory, write, displayPath }) => {
    write('index.html', home.replace('</head>', '<link rel="canonical" href="https://connectum.dev/en/"><link href="https://connectum.dev/en/" rel="canonical"></head>'));
    assert.deepEqual(validateSiteMetadata(directory), [
        `${displayPath('index.html')}: expected at most one canonical link, found ["https://connectum.dev/en/","https://connectum.dev/en/"]`,
    ]);
}));

test('built metadata falls back to the root route when no canonical link exists', () => withBuild(({ directory, write }) => {
    write('index.html', page('https://connectum.dev/'));
    assert.deepEqual(validateSiteMetadata(directory), []);
}));
