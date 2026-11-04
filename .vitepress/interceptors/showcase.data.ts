import { readFileSync } from 'node:fs';
import { createMarkdownRenderer } from 'vitepress';
import { runInterceptors } from './runtime.ts';
import { chains, handlerOutcomes, initialSettings } from './settings.ts';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const loader = {
    watch: ['.vitepress/interceptors/*.ts', '.vitepress/interceptors/example/src/*.ts', '.vitepress/interceptors/example/proto/**/*.proto', '.vitepress/interceptors/gen/**/*.ts'],
    async load() {
        const markdown = await createMarkdownRenderer('.', { lineNumbers: true });
        const block = (text: string, language = 'typescript') => markdown.render(`\`\`\`${language}\n${text.trimEnd()}\n\`\`\``);
        const compositions = Object.fromEntries(chains.map((chain) => [chain.id, block(`interceptors: [${chain.order.join(', ')}]`)]));
        const comparisons = [];
        for (const outcome of handlerOutcomes)
            for (const chain of chains) {
                const settings = { chain: chain.id, outcome: outcome.id };
                comparisons.push({ settings, label: `${chain.label} · ${outcome.label}`, result: await runInterceptors(settings) });
            }
        return {
            initial: await runInterceptors(initialSettings),
            compositions,
            comparisons,
            sources: {
                audit: { label: 'audit.ts', html: block(read('./example/src/audit.ts')) },
                stockTag: { label: 'stockTag.ts', html: block(read('./example/src/stockTag.ts')) },
                handler: { label: 'handler.ts', html: block(read('./example/src/inventory.ts')) },
            },
            setup: block(read('./example/src/server.ts')),
            commands: block('cd .vitepress/interceptors/example\npnpm install --frozen-lockfile\npnpm generate\npnpm typecheck\npnpm test', 'bash'),
        };
    },
};

export declare const data: Awaited<ReturnType<typeof loader.load>>;
export default loader;
