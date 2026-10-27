import base from './generated/base.json' with { type: 'json' };
import { transformBase } from './generated/engine.mjs';
import provenance from './generated/provenance.json' with { type: 'json' };
import type { BuilderPackageManager, BuilderRuntime, BuilderSelection, DiffLine, PreviewLine, ProjectFiles, ScaffoldConfig } from './types.ts';

export { provenance };
export const PROTO_PATH = 'proto/greeter/v1/greeter.proto';
export const adapterDetails = {
    nats: { label: 'NATS JetStream', requirement: 'A NATS server with JetStream enabled. NATS_SERVERS defaults to nats://localhost:4222.' },
    kafka: { label: 'Apache Kafka', requirement: 'A Kafka broker. KAFKA_BROKERS defaults to localhost:9092.' },
    redpanda: { label: 'Redpanda', requirement: 'A Redpanda broker. REDPANDA_BROKERS defaults to localhost:9092.' },
    redis: { label: 'Redis Streams', requirement: 'A Redis-compatible server. REDIS_URL defaults to redis://localhost:6379.' },
    amqp: { label: 'RabbitMQ / AMQP', requirement: 'An AMQP broker. AMQP_URL defaults to amqp://localhost:5672.' },
} as const;

export const featureDetails = [
    { id: 'auth', label: 'JWT authentication', description: 'JWT verification and proto-driven access rules.', file: 'src/auth.ts', guide: '/en/guide/auth/proto-authz' },
    { id: 'otel', label: 'Observability', description: 'An RPC interceptor and provider lifecycle.', file: 'src/index.ts', guide: '/en/guide/observability' },
    { id: 'events', label: 'Events', description: 'An EventBus, adapter and sample event handler.', file: 'src/greeterEventBus.ts', guide: '/en/guide/events/getting-started' },
    {
        id: 'catalog',
        label: 'Typed service calls',
        description: 'Generate a catalog for ctx.call() and ctx.stream().',
        file: 'buf.gen.yaml',
        guide: '/en/guide/service-communication/service-catalog',
    },
] as const;

export function defaultSelection(): BuilderSelection {
    return {
        name: 'my-service',
        runtime: 'node',
        packageManager: 'pnpm',
        nodeExec: 'raw',
        auth: false,
        otel: false,
        catalog: false,
        events: false,
        adapter: 'nats',
        resilience: [],
        publicHello: true,
    };
}

export function packageManagers(runtime: BuilderRuntime): readonly BuilderPackageManager[] {
    return runtime === 'bun' ? ['bun'] : ['pnpm', 'npm'];
}

export function nameError(name: string): string | null {
    if (name.length === 0) return 'Enter a project name.';
    if (name.length > 100 || !/^[a-z0-9][a-z0-9._-]*$/.test(name)) return 'Use 1–100 lowercase letters, digits, dots, underscores or hyphens; start with a letter or digit.';
    if (provenance.reservedProjectNames.includes(name)) return 'Choose a name other than an npm-reserved or Node.js core module name.';
    return null;
}

export function scaffoldConfig(selection: BuilderSelection): ScaffoldConfig {
    const error = nameError(selection.name);
    if (error) throw new Error(error);
    if (!packageManagers(selection.runtime).includes(selection.packageManager)) throw new Error('Choose bun for Bun, or npm/pnpm for Node.js.');
    return {
        dir: selection.name,
        name: selection.name,
        runtime: selection.runtime,
        packageManager: selection.packageManager,
        nodeExec: selection.nodeExec,
        sample: true,
        modules: {
            auth: selection.auth,
            otel: selection.otel,
            catalog: selection.catalog,
            events: selection.events ? { adapter: selection.adapter } : undefined,
            resilience: [...selection.resilience],
            healthcheck: true,
            reflection: true,
        },
    };
}

export function buildProject(selection: BuilderSelection): ProjectFiles {
    const files = Object.fromEntries(transformBase(new Map(Object.entries(base)), scaffoldConfig(selection)));
    // the example's author is not the author of a user's new service.
    const manifest = JSON.parse(files['package.json']);
    delete manifest.author;
    files['package.json'] = `${JSON.stringify(manifest, null, 2)}\n`;
    if (selection.auth && !selection.publicHello) {
        const source = files[PROTO_PATH];
        const annotation = '    option (connectum.auth.v1.method_auth) = { public: true };';
        if (!source?.includes(annotation)) throw new Error('The CLI auth annotation changed; review the contract edit.');
        files[PROTO_PATH] = source
            .split('\n')
            .filter((line) => !line.includes('// Public: skips authentication') && !line.includes('// out of the box. Remove this option') && line !== annotation)
            .join('\n');
        const originalTest = `    it("sayHello is public and returns a greeting", async () => {\n        const res = await client.sayHello({ name: "Ada" });\n        assert.equal(res.message, "Hello, Ada!");\n    });`;
        const testPath = 'tests/e2e/e2e.test.ts';
        if (!files[testPath]?.includes(originalTest)) throw new Error('The CLI auth test changed; review the protected-method test.');
        files[testPath] = files[testPath].replace(
            originalTest,
            `    it("sayHello requires authentication", async () => {\n        await assert.rejects(\n            () => client.sayHello({ name: "Ada" }),\n            (err: Error) => err.message.includes("unauthenticated"),\n        );\n    });`,
        );
        files['README.md'] +=
            '\n## Access policy\n\nSayHello and SayGoodbye require a valid JWT. Configure JWKS_URI, JWT_ISSUER and JWT_AUDIENCE before making authenticated calls. This contract customization and its matching e2e test were applied by the service builder after the CLI scaffold.\n';
    }
    return Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b)));
}

export function scaffoldCommand(selection: BuilderSelection): string {
    scaffoldConfig(selection);
    const flags = [`--runtime ${selection.runtime}`, `--package-manager ${selection.packageManager}`];
    if (selection.runtime === 'node') flags.push(`--node-exec ${selection.nodeExec}`);
    if (selection.auth) flags.push('--auth');
    if (selection.otel) flags.push('--otel');
    if (selection.events) flags.push(`--events ${selection.adapter}`);
    if (selection.catalog) flags.push('--catalog');
    if (selection.resilience.length) flags.push(`--resilience ${selection.resilience.join(',')}`);
    flags.push('--yes');
    return `npx @connectum/cli@${provenance.cliVersion} init ${selection.name} \\\n  ${flags.join(' \\\n  ')}`;
}

export function runCommands(selection: BuilderSelection): string {
    scaffoldConfig(selection);
    return `cd ${selection.name}\n${selection.packageManager} install\n${selection.packageManager} run start`;
}

export function diffLines(before: string, after: string): DiffLine[] {
    const a = before === '' ? [] : before.trimEnd().split('\n');
    const b = after === '' ? [] : after.trimEnd().split('\n');
    const table = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
    for (let i = a.length - 1; i >= 0; i--)
        for (let j = b.length - 1; j >= 0; j--) table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    const lines: DiffLine[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
        if (i < a.length && j < b.length && a[i] === b[j]) {
            lines.push({ kind: 'same', text: b[j], number: j + 1, beforeNumber: i + 1 });
            i++;
            j++;
        } else if (j < b.length && (i === a.length || table[i][j + 1] > table[i + 1][j])) {
            lines.push({ kind: 'added', text: b[j], number: j + 1, beforeNumber: null });
            j++;
        } else {
            lines.push({ kind: 'removed', text: a[i], number: null, beforeNumber: i + 1 });
            i++;
        }
    }
    return lines;
}

export function changedFiles(before: ProjectFiles, after: ProjectFiles): string[] {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((path) => before[path] !== after[path]).sort();
}

function isPreviewPath(path: string): boolean {
    return path.startsWith('src/') || path.startsWith('proto/greeter/') || ['package.json', 'buf.yaml', 'buf.gen.yaml', 'tsconfig.json'].includes(path);
}

function previewOrder(a: string, b: string): number {
    return a === 'src/server.ts' ? -1 : b === 'src/server.ts' ? 1 : a.localeCompare(b);
}

// visibility and modification status are separate: unchanged application code must remain navigable.
export function visiblePreviewFiles(files: ProjectFiles): string[] {
    return Object.keys(files).filter(isPreviewPath).sort(previewOrder);
}

export function previewFiles(before: ProjectFiles, after: ProjectFiles): string[] {
    return changedFiles(before, after).filter(isPreviewPath).sort(previewOrder);
}

export function projectTree(paths: readonly string[]): Array<{ kind: 'directory' | 'file'; path: string; label: string; depth: number }> {
    const nodes: Array<{ kind: 'directory' | 'file'; path: string; label: string; depth: number }> = [];
    const seen = new Set<string>();
    for (const path of [...paths].sort()) {
        const parts = path.split('/');
        for (let depth = 0; depth < parts.length - 1; depth++) {
            const directory = `${parts.slice(0, depth + 1).join('/')}/`;
            if (!seen.has(directory)) {
                seen.add(directory);
                nodes.push({ kind: 'directory', path: directory, label: `${parts[depth]}/`, depth });
            }
        }
        nodes.push({ kind: 'file', path, label: parts[parts.length - 1], depth: parts.length - 1 });
    }
    return nodes;
}

export function compactDiff(before: string, after: string): PreviewLine[] {
    const lines = diffLines(before, after);
    const changes = lines.flatMap((line, index) => (line.kind === 'same' ? [] : [index]));
    if (!changes.length) return lines;
    const visible = new Set<number>();
    for (const index of changes) for (let nearby = Math.max(0, index - 3); nearby <= Math.min(lines.length - 1, index + 3); nearby++) visible.add(nearby);
    const result: PreviewLine[] = [];
    let hidden = 0;
    for (let index = 0; index < lines.length; index++) {
        if (!visible.has(index)) {
            hidden++;
            continue;
        }
        if (hidden) {
            result.push({ kind: 'gap', text: `⋯ ${hidden} unchanged lines`, number: null });
            hidden = 0;
        }
        result.push(lines[index]);
    }
    if (hidden) result.push({ kind: 'gap', text: `⋯ ${hidden} unchanged lines`, number: null });
    return result;
}
