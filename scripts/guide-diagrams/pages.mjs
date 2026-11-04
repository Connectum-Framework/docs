import { dirname, relative } from 'node:path';
import { escapeHtml } from './primitives.mjs';

export function syncOverview(markdown, diagram) {
    const page = `${diagram.route.slice(1)}.md`;
    const component = relative(dirname(page), '.vitepress/theme/components/GuideOverview.vue');
    const asset = relative(dirname(page), `.vitepress/theme/assets/diagrams/guide/${diagram.key}.html`);
    const imports = `import GuideOverview from '${component}';\nimport overview from '${asset}?raw';`;
    let source = markdown;
    if (!source.includes('import GuideOverview ')) {
        if (source.includes('<script setup>')) source = source.replace('<script setup>', `<script setup>\n${imports}`);
        else source = source.replace(/^(---\n[\s\S]*?\n---\n)/, `$1\n<script setup>\n${imports}\n</script>\n`);
    }
    const figure = `<figure class="technical-diagram" data-guide-overview="${diagram.key}" aria-label="${escapeHtml(diagram.title)}">\n<GuideOverview :source="overview" />\n<figcaption>${escapeHtml(diagram.caption)}</figcaption>\n</figure>`;
    const existing = new RegExp(`<figure\\b[^>]*data-guide-overview="${diagram.key}"[^>]*>[\\s\\S]*?<\\/figure>`);
    if (existing.test(source)) return source.replace(existing, figure);
    const firstFigure = /<figure\b[^>]*>[\s\S]*?<\/figure>/;
    if (!firstFigure.test(source)) throw new Error(`${diagram.route}: missing illustration insertion point`);
    // server's accepted exploded composition is a different explanation and stays intact.
    if (diagram.key === 'server') return source.replace(firstFigure, (accepted) => `${accepted}\n\n${figure}`);
    return source.replace(firstFigure, figure);
}
