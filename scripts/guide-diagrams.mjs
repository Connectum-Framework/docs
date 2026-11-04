import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { diagrams } from './guide-diagrams/models.mjs';
import { syncOverview } from './guide-diagrams/pages.mjs';
import { renderHtml } from './guide-diagrams/render.mjs';

const root = new URL('../', import.meta.url);
const keys = process.argv.slice(2);
if (keys.some((key) => !diagrams.some((diagram) => diagram.key === key))) throw new Error('Use existing diagram keys, or no arguments to regenerate all.');
const assets = new URL('.vitepress/theme/assets/diagrams/guide/', root);
mkdirSync(assets, { recursive: true });
const selected = keys.length ? diagrams.filter((diagram) => keys.includes(diagram.key)) : diagrams;
for (const diagram of selected) {
    writeFileSync(new URL(`${diagram.key}.html`, assets), renderHtml(diagram));
    // the introductory scaffold page is deliberately a short CLI example; retain the standalone artwork only.
    if (diagram.key === 'scaffolding') continue;
    const page = new URL(`${diagram.route.slice(1)}.md`, root);
    writeFileSync(page, syncOverview(readFileSync(page, 'utf8'), diagram));
}
console.log(`Generated ${selected.length} section overview sources and page embeds.`);
