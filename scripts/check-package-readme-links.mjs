import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { createMarkdownRenderer } from 'vitepress';
import { checkDocumentationLink, checkHttpLink, checkLocalLink, markdownLinks, packageReadmes } from './lib/package-readme-links.mjs';

const { values } = parseArgs({
    options: {
        'framework-root': { type: 'string' },
        'site-root': { type: 'string', default: '.vitepress/dist' },
        'site-url': { type: 'string' },
        output: { type: 'string', default: '.tmp/package-readme-links.json' },
    },
});
assert.ok(values['framework-root'], 'Supply --framework-root pointing to the framework revision being checked.');
const root = resolve(values['framework-root']);
const siteRoot = resolve(values['site-root']);
const packages = (await readdir(resolve(root, 'packages'), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
assert.ok(packages.length, 'No framework packages found; refusing an empty audit.');
const readmes = packageReadmes(root, packages);
const markdown = await createMarkdownRenderer(process.cwd());
const report = {
    completed: false,
    frameworkRoot: root,
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    packages,
    readmes: readmes.length,
    site: values['site-url'] ?? siteRoot,
    links: [],
    errors: [],
};
const pages = new Map();

async function fetchPage(url) {
    const key = new URL(url);
    key.hash = '';
    if (!pages.has(key.href)) {
        pages.set(
            key.href,
            (async () => {
                const response = await fetch(key, { signal: AbortSignal.timeout(20_000), headers: { 'user-agent': 'Connectum-documentation-link-check' } });
                return { status: response.status, html: await response.text(), finalUrl: response.url };
            })(),
        );
    }
    return pages.get(key.href);
}

for (const readme of readmes) {
    const source = await readFile(readme, 'utf8');
    for (const href of markdownLinks(markdown, source)) {
        const entry = { readme: relative(root, readme), href };
        try {
            if (!/^(?:https?:)?\/\//i.test(href)) {
                if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
                    entry.result = { ok: false, reason: 'non-HTTP scheme requires manual review' };
                } else {
                    entry.result = checkLocalLink({ markdown, root, readme, href });
                }
            } else {
                const url = new URL(href, 'https://connectum.dev');
                if (url.hostname === 'connectum.dev' || url.hostname === 'www.connectum.dev') {
                    entry.result = await checkDocumentationLink({ siteRoot, url, siteUrl: values['site-url'], fetchPage });
                } else entry.result = await checkHttpLink(url, fetchPage);
            }
        } catch (error) {
            entry.result = { ok: false, reason: error.message };
        }
        report.links.push(entry);
        if (!entry.result.ok) report.errors.push(entry);
    }
}
report.completed = true;
await mkdir(dirname(resolve(values.output)), { recursive: true });
await writeFile(resolve(values.output), `${JSON.stringify(report, null, 2)}\n`);
console.log(
    `Package README links: ${packages.length} packages, ${readmes.length} READMEs, ${report.links.length} distinct links per file, ${report.errors.length} unresolved; report ${values.output}.`,
);
for (const entry of report.errors) console.error(`${entry.readme}: ${entry.href}: ${entry.result.reason}`);
process.exitCode = report.errors.length ? 1 : 0;
