import { readFileSync } from 'node:fs';
import { createMarkdownRenderer } from 'vitepress';
import { evaluateInput } from './runtime.ts';
import { validationScenarios } from './scenarios.ts';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const loader = {
    watch: [
        '.vitepress/validation/scenarios.ts',
        '.vitepress/validation/runtime.ts',
        '.vitepress/validation/gen/**/*.ts',
        '.vitepress/validation/example/src/*.ts',
        '.vitepress/validation/example/proto/**/*.proto',
    ],
    async load() {
        const markdown = await createMarkdownRenderer('.', { lineNumbers: true });
        const block = (source: string, language: string) => markdown.render(`\`\`\`${language}\n${source.trimEnd()}\n\`\`\``);
        return {
            initialInput: { sku: validationScenarios[0].sku, quantity: String(validationScenarios[0].quantity) },
            initial: evaluateInput({ sku: validationScenarios[0].sku, quantity: String(validationScenarios[0].quantity) }),
            handler: block(read('./example/src/inventory.ts'), 'typescript'),
            server: block(read('./example/src/server.ts'), 'typescript'),
            proto: block(read('./example/proto/shop/v1/inventory.proto'), 'proto'),
            commands: block('cd .vitepress/validation/example\npnpm install --frozen-lockfile\npnpm generate\npnpm typecheck\npnpm test', 'bash'),
            scenarios: validationScenarios.map((scenario) => {
                const request = { sku: scenario.sku, quantity: scenario.quantity };
                const result = evaluateInput({ sku: scenario.sku, quantity: String(scenario.quantity) });
                return {
                    ...scenario,
                    code: result.code,
                    request: block(JSON.stringify(request, null, 2), 'json'),
                    result: block(JSON.stringify(result.response ?? { code: result.code, issues: result.issues, message: result.message }, null, 2), 'json'),
                };
            }),
        };
    },
};

export declare const data: Awaited<ReturnType<typeof loader.load>>;
export default loader;
