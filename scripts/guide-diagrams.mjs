import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { diagrams } from './guide-diagrams/models.mjs';
import { syncOverview } from './guide-diagrams/pages.mjs';
import { renderHtml } from './guide-diagrams/render.mjs';

const root = new URL('../', import.meta.url);
const assets = new URL('.vitepress/theme/assets/diagrams/guide/', root);
mkdirSync(assets, { recursive: true });
for (const diagram of diagrams) {
    writeFileSync(new URL(`${diagram.key}.html`, assets), renderHtml(diagram));
    const page = new URL(`${diagram.route.slice(1)}.md`, root);
    writeFileSync(page, syncOverview(readFileSync(page, 'utf8'), diagram));
}
console.log(`Generated ${diagrams.length} section overview sources and page embeds.`);
