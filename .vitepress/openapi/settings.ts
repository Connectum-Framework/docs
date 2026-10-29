import type { MessageInitShape } from '@bufbuild/protobuf';
import type { MethodAuthSchema } from '@connectum/auth/proto';

export const annotations = [
    { id: 'public', label: 'Public', options: { public: true } },
    { id: 'user', label: 'User JWT', options: { public: false } },
    { id: 'roles', label: 'Role + scope', options: { public: false, requires: { roles: ['warehouse'], scopes: ['stock:read'] } } },
    { id: 'internal', label: 'Internal service', options: { internal: true, requires: { roles: ['orders'] } } },
    { id: 'deny', label: 'Deny policy', options: { public: false, policy: 'deny' } },
    { id: 'conflict', label: 'Conflicting options', options: { public: true, internal: true } },
] as const satisfies readonly { id: string; label: string; options: MessageInitShape<typeof MethodAuthSchema> }[];

export const methods = [
    { id: 'CheckStock', label: 'CheckStock · unary', response: 'CheckStockResponse' },
    { id: 'WatchStock', label: 'WatchStock · server stream', response: 'stream CheckStockResponse' },
] as const;

export type AnnotationId = (typeof annotations)[number]['id'];
export type MethodId = (typeof methods)[number]['id'];
export type Settings = { annotation: AnnotationId; method: MethodId };
export const initialSettings: Settings = { annotation: 'public', method: 'CheckStock' };

export function annotationFor(id: AnnotationId) {
    const entry = annotations.find((entry) => entry.id === id);
    if (!entry) throw new Error(`Unknown annotation: ${id}`);
    return entry;
}

export function methodFor(id: MethodId) {
    const entry = methods.find((entry) => entry.id === id);
    if (!entry) throw new Error(`Unknown method: ${id}`);
    return entry;
}

export function protoSource(settings: Settings): string {
    const options: MessageInitShape<typeof MethodAuthSchema> = annotationFor(settings.annotation).options;
    const fields: string[] = [];
    if (options.public !== undefined) fields.push(`public: ${options.public}`);
    if (options.internal !== undefined) fields.push(`internal: ${options.internal}`);
    if (options.policy !== undefined) fields.push(`policy: ${JSON.stringify(options.policy)}`);
    if (options.requires) {
        const requires: string[] = [];
        for (const role of options.requires.roles ?? []) requires.push(`roles: ${JSON.stringify(role)}`);
        for (const scope of options.requires.scopes ?? []) requires.push(`scopes: ${JSON.stringify(scope)}`);
        fields.push(`requires { ${requires.join(' ')} }`);
    }
    const method = methodFor(settings.method);
    return `rpc ${method.id}(CheckStockRequest)\n    returns (${method.response}) {\n  option (connectum.auth.v1.method_auth) = {\n    ${fields.join('\n    ')}\n  };\n}`;
}
