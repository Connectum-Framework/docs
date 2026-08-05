#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import process from 'node:process';

const projectRoot = resolve(import.meta.dirname, '..');
const contentRoot = resolve(projectRoot, 'en');
const buildRoot = resolve(projectRoot, '.vitepress/dist');
const siteMetadata = JSON.parse(readFileSync(resolve(projectRoot, '.vitepress/data/site.json'), 'utf8'));

const options = new Set(process.argv.slice(2));
const format = options.has('--json') ? 'json' : 'markdown';
const includeGenerated = options.has('--include-generated');

function collectMarkdownFiles(directory) {
    const files = [];

    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = resolve(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...collectMarkdownFiles(path));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            files.push(path);
        }
    }

    return files.sort();
}

function parseFrontmatter(source) {
    if (!source.startsWith('---\n')) return {};

    const end = source.indexOf('\n---', 4);
    if (end === -1) return {};

    const values = {};
    for (const line of source.slice(4, end).split('\n')) {
        const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
        if (!match) continue;

        values[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim();
    }

    return values;
}

function toRoute(file) {
    const sourcePath = relative(projectRoot, file).replaceAll('\\', '/');
    const withoutExtension = `/${sourcePath.replace(/\.md$/, '')}`;
    return withoutExtension.endsWith('/index') ? withoutExtension.slice(0, -5) : withoutExtension;
}

function stripInlineMarkdown(value) {
    return value
        .replace(/\s+\{#[^}]+\}\s*$/, '')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/[`*_~]/g, '')
        .trim();
}

function slugify(value) {
    return stripInlineMarkdown(value)
        .normalize('NFKD')
        .toLowerCase()
        .replace(/[^\p{Letter}\p{Number}\s_-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function parseHeadings(source) {
    const headings = [];
    const slugCounts = new Map();
    let inFence = false;

    for (const line of source.split(/\r?\n/)) {
        if (/^\s*```/.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;

        const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
        if (!match) continue;

        const customAnchor = match[2].match(/\s+\{#([^}]+)\}\s*$/)?.[1];
        const base = customAnchor ?? slugify(match[2]);
        const seen = slugCounts.get(base) ?? 0;
        slugCounts.set(base, seen + 1);

        headings.push({
            level: match[1].length,
            text: stripInlineMarkdown(match[2]),
            anchor: seen === 0 ? base : `${base}-${seen}`,
        });
    }

    return headings;
}

function parseInternalLinks(source) {
    const links = new Set();
    const pattern = /(?:\[[^\]]*\]\(|href=["'])(\/en\/[A-Za-z0-9@_./#-]*)/g;

    for (const match of source.matchAll(pattern)) {
        links.add(match[1]);
    }

    return [...links].sort();
}

function inferContentType(sourcePath) {
    if (sourcePath.startsWith('en/api/')) return 'generated-reference';
    if (sourcePath.startsWith('en/packages/')) return 'package-hub-migration';
    if (sourcePath.startsWith('en/migration/')) return 'migration';
    if (sourcePath.startsWith('en/contributing/adr/')) return 'adr';
    if (sourcePath.startsWith('en/contributing/')) return 'contributor-guide';
    if (/quickstart|getting-started/.test(sourcePath)) return 'tutorial';
    if (/about\.md$|architecture\.md$/.test(sourcePath)) return 'concept';
    return 'guide-review';
}

function inferAudience(contentType, route) {
    if (route === '/en/') return 'all';
    if (contentType === 'tutorial') return 'beginner';
    if (contentType === 'generated-reference') return 'expert';
    if (contentType === 'package-hub-migration') return 'practitioner, expert';
    if (contentType === 'migration') return 'upgrader, operator';
    if (contentType === 'adr') return 'architect, contributor';
    if (contentType === 'contributor-guide') return 'contributor';
    return 'practitioner';
}

function migrationDisposition(contentType, route) {
    if (route === '/en/') return 'keep-and-redesign';
    if (contentType === 'tutorial') return 'keep-and-rewrite';
    if (contentType === 'concept') return 'keep-and-trim';
    if (contentType === 'package-hub-migration') return 'keep-and-trim';
    if (contentType === 'guide-review') return 'keep-and-consolidate';
    if (contentType === 'migration') return 'keep-and-reorganize';
    return 'keep';
}

function canonicalOwner(contentType) {
    if (contentType === 'generated-reference') return 'generated API';
    if (contentType === 'package-hub-migration') return 'module learning and routing';
    if (contentType === 'migration') return 'release migration';
    if (contentType === 'adr') return 'architecture rationale';
    if (contentType === 'contributor-guide') return 'contributor workflow';
    if (contentType === 'tutorial') return 'guided learning outcome';
    if (contentType === 'concept') return 'mental model';
    return 'task guidance';
}

function countBuildOutputs() {
    const readBuildFile = (name) => {
        const path = resolve(buildRoot, name);
        return existsSync(path) ? readFileSync(path, 'utf8') : null;
    };

    const sitemap = readBuildFile('sitemap.xml');
    const search = readBuildFile('hashmap.json');
    const llmOutputs = ['llms.txt', 'llms-full.txt', 'en.md'].map((name) => {
        const path = resolve(buildRoot, name);
        return { name, present: existsSync(path), bytes: existsSync(path) ? statSync(path).size : 0 };
    });

    return {
        sitemapUrls: sitemap ? [...sitemap.matchAll(/<url>/g)].length : null,
        searchDocuments: search ? Object.keys(JSON.parse(search)).length : null,
        llmOutputs,
    };
}

const allFiles = collectMarkdownFiles(contentRoot);
const files = includeGenerated ? allFiles : allFiles.filter((file) => !relative(contentRoot, file).startsWith('api/'));

const pagesByArea = allFiles.reduce((counts, file) => {
    const sourcePath = relative(projectRoot, file).replaceAll('\\', '/');
    const area = sourcePath === 'en/index.md' ? 'home' : sourcePath.split('/')[1];
    counts[area] = (counts[area] ?? 0) + 1;
    return counts;
}, {});

const pages = files.map((file) => {
    const source = readFileSync(file, 'utf8');
    const sourcePath = relative(projectRoot, file).replaceAll('\\', '/');
    const frontmatter = parseFrontmatter(source);
    const headings = parseHeadings(source);

    return {
        sourcePath,
        route: toRoute(file),
        title: frontmatter.title || headings.find((heading) => heading.level === 1)?.text || '(untitled)',
        contentType: frontmatter.docType || inferContentType(sourcePath),
        headings,
        links: parseInternalLinks(source),
        wordCount: source.split(/\s+/).filter(Boolean).length,
    };
});

const inbound = new Map(pages.map((page) => [page.route, []]));
for (const page of pages) {
    for (const link of page.links) {
        const route = link.split('#')[0].replace(/\/$/, '') || '/en/';
        const candidates = [route, `${route}/`];
        const target = candidates.find((candidate) => inbound.has(candidate));
        if (target) inbound.get(target).push(page.route);
    }
}

const inventory = {
    generatedAt: new Date().toISOString(),
    scope: includeGenerated ? 'all documentation' : 'hand-written documentation',
    totals: {
        pages: pages.length,
        headings: pages.reduce((sum, page) => sum + page.headings.length, 0),
        wordsIncludingCode: pages.reduce((sum, page) => sum + page.wordCount, 0),
        pagesByArea,
        buildOutputs: countBuildOutputs(),
    },
    redirectPolicy: {
        hosting: 'GitHub Pages',
        mechanism: 'compatibility page with canonical, noindex, and search exclusion',
        redirects: siteMetadata.redirects,
    },
    pages: pages.map((page) => ({
        ...page,
        audience: inferAudience(page.contentType, page.route),
        disposition: migrationDisposition(page.contentType, page.route),
        canonicalOwner: canonicalOwner(page.contentType),
        targetRoute: page.route,
        redirectRequired: siteMetadata.redirects.some((redirect) => redirect.from === page.route),
        inboundLinks: [...new Set(inbound.get(page.route) ?? [])].sort(),
    })),
};

if (format === 'json') {
    process.stdout.write(`${JSON.stringify(inventory, null, 2)}\n`);
    process.exit(0);
}

const lines = [
    '# Documentation route inventory',
    '',
    `Generated: ${inventory.generatedAt}`,
    '',
    `Scope: ${inventory.scope}`,
    '',
    `Pages: ${inventory.totals.pages}; headings: ${inventory.totals.headings}; words including code: ${inventory.totals.wordsIncludingCode}.`,
    '',
    `Areas: ${Object.entries(inventory.totals.pagesByArea).map(([area, count]) => `${area} ${count}`).join('; ')}.`,
    '',
    `Build outputs: sitemap ${inventory.totals.buildOutputs.sitemapUrls ?? 'not built'} URLs; search ${inventory.totals.buildOutputs.searchDocuments ?? 'not built'} documents; LLM ${inventory.totals.buildOutputs.llmOutputs.filter((output) => output.present).length}/3 files.`,
    '',
    '| Route | Source | Type / audience | Disposition / owner | Inbound | Anchors |',
    '|---|---|---|---|---:|---|',
];

for (const page of inventory.pages) {
    const anchors = page.headings
        .filter((heading) => heading.level > 1)
        .map((heading) => `#${heading.anchor}`)
        .join('<br>');

    lines.push(
        `| \`${page.route}\` | \`${page.sourcePath}\` | ${page.contentType}<br>${page.audience} | ${page.disposition}<br>${page.canonicalOwner} | ${page.inboundLinks.length} | ${anchors || '—'} |`,
    );
}

process.stdout.write(`${lines.join('\n')}\n`);
