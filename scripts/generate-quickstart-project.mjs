import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { provenance } from '../.vitepress/builder/model.ts';
import { buildQuickstartProject, initCommand } from '../.vitepress/quickstart/project.ts';

const root = new URL('../.vitepress/quickstart/example/', import.meta.url);
const files = buildQuickstartProject();
for (const [path, source] of Object.entries(files)) {
    const target = new URL(path, root);
    mkdirSync(dirname(target.pathname), { recursive: true });
    writeFileSync(target, source);
}
const sourceHashes = Object.fromEntries(Object.entries(files).map(([path, text]) => [path, createHash('sha256').update(text).digest('hex')]));
writeFileSync(
    new URL('../project-provenance.json', root),
    `${JSON.stringify({ command: initCommand, cliSourceCommit: provenance.sourceCommit, baseRef: provenance.baseRef, sourceHashes }, null, 2)}\n`,
);
console.log(`Quickstart project: ${Object.keys(files).length} files from the CLI transform plus the handwritten Page service.`);
