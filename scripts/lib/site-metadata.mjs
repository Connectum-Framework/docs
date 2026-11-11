import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { findRedirect } from '../../.vitepress/data/redirects.ts';

const projectRoot = resolve(import.meta.dirname, '../..');

function collectHtml(directory) {
    const files = [];
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) files.push(...collectHtml(path));
        else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
    }
    return files.sort();
}

export function validateSiteMetadata(buildRoot) {
    const errors = [];
    const displayPath = (file) => relative(projectRoot, resolve(buildRoot, file));
    const robotsFile = resolve(buildRoot, 'robots.txt');
    const sitemapDirectives = existsSync(robotsFile)
        ? [...readFileSync(robotsFile, 'utf8').matchAll(/^\s*Sitemap:\s*(.*?)\s*$/gim)].map((match) => match[1])
        : [];
    if (sitemapDirectives.length !== 1 || sitemapDirectives[0] !== 'https://connectum.dev/sitemap.xml') {
        errors.push(`${displayPath('robots.txt')}: expected one Sitemap: https://connectum.dev/sitemap.xml, found ${JSON.stringify(sitemapDirectives)}`);
    }

    if (existsSync(resolve(buildRoot, 'README.html'))) {
        errors.push(`${displayPath('README.html')}: found repository-only page; expected no README.html`);
    }
    const sitemapFile = resolve(buildRoot, 'sitemap.xml');
    if (existsSync(sitemapFile)) {
        for (const [, location] of readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
            if (/^https:\/\/[^/]+\/README(?:[./?#]|$)/i.test(location)) {
                errors.push(`${displayPath('sitemap.xml')}: found repository-only URL ${location}`);
            }
        }
    }

    if (existsSync(buildRoot)) {
        for (const file of collectHtml(buildRoot)) {
            const output = relative(buildRoot, file).replaceAll('\\', '/');
            // Standalone figures are copied assets, not VitePress pages with site metadata.
            if (output.startsWith('assets/')) continue;
            const route = `/${output.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}`;
            const redirect = findRedirect(route);
            const html = readFileSync(file, 'utf8').split('</head>')[0];
            const canonicalLink = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
            const canonical = new URL(redirect ? redirect.to.split('#')[0] : canonicalLink ?? route, 'https://connectum.dev').href;
            const values = new Map(['og:title', 'og:description', 'og:url'].map((property) => [property, []]));
            for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
                const attributes = Object.fromEntries([...tag.matchAll(/([\w:-]+)=(?:"([^"]*)"|'([^']*)')/g)].map(([, key, double, single]) => [key, double ?? single]));
                values.get(attributes.property)?.push(attributes.content ?? '');
            }
            for (const [property, found] of values) {
                if (found.length !== 1) {
                    errors.push(`${relative(projectRoot, file)}: expected exactly one ${property}, found ${JSON.stringify(found)}`);
                }
            }
            const urls = values.get('og:url');
            if (urls.length === 1 && urls[0] !== canonical) {
                errors.push(`${relative(projectRoot, file)}: expected og:url ${canonical}, found ${JSON.stringify(urls[0])}`);
            }
        }
    }
    return errors;
}
