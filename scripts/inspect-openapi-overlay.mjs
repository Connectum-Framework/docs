import { parseArgs } from 'node:util';
import { runOverlay } from '../.vitepress/openapi/runtime.ts';

const { values } = parseArgs({ options: { annotation: { type: 'string', default: 'public' }, method: { type: 'string', default: 'CheckStock' } } });
try {
    const result = runOverlay(values);
    if (result.kind === 'rejected') throw new Error(result.message);
    process.stdout.write(`${result.fullOutput}\n`);
} catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
}
