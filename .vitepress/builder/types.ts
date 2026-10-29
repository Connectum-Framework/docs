export type BuilderRuntime = 'node' | 'bun';
export type BuilderPackageManager = 'pnpm' | 'npm' | 'bun';
export type BuilderNodeExec = 'raw' | 'tsx';
export type BuilderAdapter = 'nats' | 'kafka' | 'redpanda' | 'redis' | 'amqp';
export type BuilderResilience = 'timeout' | 'bulkhead' | 'circuitBreaker' | 'retry';

export interface BuilderSelection {
    name: string;
    runtime: BuilderRuntime;
    packageManager: BuilderPackageManager;
    nodeExec: BuilderNodeExec;
    auth: boolean;
    otel: boolean;
    catalog: boolean;
    events: boolean;
    adapter: BuilderAdapter;
    resilience: BuilderResilience[];
    publicHello: boolean;
}

export interface ScaffoldConfig {
    dir: string;
    name: string;
    runtime: BuilderRuntime;
    packageManager: BuilderPackageManager;
    nodeExec: BuilderNodeExec;
    sample: boolean;
    modules: {
        auth: boolean;
        otel: boolean;
        catalog: boolean;
        events: { adapter: BuilderAdapter } | undefined;
        resilience: BuilderResilience[];
        healthcheck: boolean;
        reflection: boolean;
    };
}

export type ProjectFiles = Record<string, string>;
export interface DiffLine {
    kind: 'same' | 'added' | 'removed';
    text: string;
    number: number | null;
    beforeNumber: number | null;
}

export type PreviewLine = DiffLine | { kind: 'gap'; text: string; number: null };
