import { readFileSync } from 'node:fs';
import { createMarkdownRenderer } from 'vitepress';
import type { ValidationScenarioId } from './scenarios.ts';
import { validationScenarios } from './scenarios.ts';

type RecordedResult = {
    id: ValidationScenarioId;
    request: { sku: string };
    handlerCalls: number;
    code: string;
    response?: { units: number };
    error?: { code: string; message: string };
};

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const loader = {
    watch: [
        '.vitepress/validation/recording.json',
        '.vitepress/validation/scenarios.ts',
        '.vitepress/validation/example/src/*.ts',
        '.vitepress/validation/example/proto/**/*.proto',
    ],
    async load() {
        const recording: { transport: string; records: RecordedResult[] } = JSON.parse(read('./recording.json'));
        const markdown = await createMarkdownRenderer('.', { lineNumbers: true });
        const block = (source: string, language: string) => markdown.render(`\`\`\`${language}\n${source.trimEnd()}\n\`\`\``);
        return {
            transport: recording.transport,
            handler: block(read('./example/src/inventory.ts'), 'typescript'),
            server: block(read('./example/src/server.ts'), 'typescript'),
            proto: block(read('./example/proto/shop/v1/inventory.proto'), 'proto'),
            commands: block('cd .vitepress/validation/example\npnpm install --frozen-lockfile\npnpm generate\npnpm typecheck\npnpm test', 'bash'),
            scenarios: validationScenarios.map((scenario) => {
                const record = recording.records.find((entry) => entry.id === scenario.id);
                if (!record || record.request.sku !== scenario.sku) throw new Error(`Missing or stale validation recording: ${scenario.id}`);
                return {
                    ...scenario,
                    code: record.code,
                    handlerCalls: record.handlerCalls,
                    message: record.error?.message,
                    request: block(JSON.stringify(record.request, null, 2), 'json'),
                    result: block(JSON.stringify(record.response ?? record.error, null, 2), 'json'),
                };
            }),
        };
    },
};

export declare const data: Awaited<ReturnType<typeof loader.load>>;
export default loader;
