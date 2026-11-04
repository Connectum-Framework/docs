import { readFileSync } from 'node:fs';
import { buildProject, defaultSelection, projectTree, provenance } from '../builder/model.ts';

export const quickstartSelection = { ...defaultSelection(), name: 'private-page', auth: true, otel: true };
export const initCommand = `npx @connectum/cli@${provenance.cliVersion} init private-page --auth --otel --yes`;
export const additions = ['proto/page/v1/page.proto', 'src/services/pageService.ts', 'tests/quickstart/capture.ts', 'requests/get-page.sh', 'requests/variants.ts'] as const;

export function scaffoldFileTree() {
    const nodes = projectTree(Object.keys(buildProject(quickstartSelection)));
    const siblings: boolean[] = [];
    return `${quickstartSelection.name}/\n${nodes
        .map((node, index) => {
            const next = nodes.slice(index + 1).find((next) => next.depth <= node.depth);
            const hasSibling = next?.depth === node.depth;
            const prefix = Array.from({ length: node.depth }, (_, depth) => (siblings[depth] ? '│   ' : '    ')).join('');
            siblings[node.depth] = hasSibling;
            return `${prefix}${hasSibling ? '├── ' : '└── '}${node.label}`;
        })
        .join('\n')}`;
}

export function buildQuickstartProject() {
    const files = buildProject(quickstartSelection);
    const manifest = JSON.parse(files['package.json']);
    manifest.devDependencies['@connectrpc/connect-node'] = manifest.dependencies['@connectrpc/connect'];
    manifest.scripts['quickstart:verify'] = 'buf generate && node tests/quickstart/capture.ts';
    files['package.json'] = `${JSON.stringify(manifest, null, 2)}\n`;
    for (const path of additions) files[path] = readFileSync(new URL(`./additions/${path}`, import.meta.url), 'utf8');
    const registration = '        services: [greeterService],';
    if (!files['src/server.ts'].includes(registration)) throw new Error('The CLI server registration changed; review the Quickstart edit.');
    files['src/server.ts'] = files['src/server.ts']
        .replace(
            'import { greeterService } from "#services/greeterService.ts";',
            'import { greeterService } from "#services/greeterService.ts";\nimport { pageService } from "#services/pageService.ts";',
        )
        .replace(registration, '        services: [greeterService, pageService],');
    if (!files['src/server.ts'].includes('import { pageService }')) throw new Error('The CLI service import changed; review the Quickstart edit.');
    if (!files['src/auth.ts'].includes('methods: protocolMethods, effect: AuthzEffect.ALLOW')) {
        throw new Error('The CLI protocol access rule changed; review the probes before updating Quickstart.');
    }
    return files;
}
