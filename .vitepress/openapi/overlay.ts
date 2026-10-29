import type { DescMethod } from '@bufbuild/protobuf';
import { resolveMethodAuth } from './generated/auth-reader.mjs';

export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue };

const object = (value: JsonValue | undefined): value is JsonObject => typeof value === 'object' && value !== null && !Array.isArray(value);

export function jsonDocument(value: unknown): JsonObject {
    const json = (item: unknown): item is JsonValue => {
        if (item === null || typeof item === 'string' || typeof item === 'boolean') return true;
        if (typeof item === 'number') return Number.isFinite(item);
        if (Array.isArray(item)) return item.every(json);
        return typeof item === 'object' && item !== null && Object.values(item).every(json);
    };
    if (!json(value) || !object(value)) throw new Error('The base document must be a JSON object.');
    return value;
}

/** credential metadata does not grant runtime access; always patch a fresh base. */
export function overlayMethod(base: JsonObject, method: DescMethod) {
    const document = structuredClone(base);
    const path = `/${method.parent.typeName}/${method.name}`;
    const paths = document.paths;
    if (!object(paths)) throw new Error('The base OpenAPI document has no paths object.');
    const item = paths[path];
    const operation = object(item) ? item.post : undefined;
    if (!object(operation)) return { kind: 'skipped' as const, document, path };

    const auth = resolveMethodAuth(method);
    // refuse ambiguous credentials here even with readers that allow both flags.
    if (auth.public && auth.internal) throw new Error('A method cannot be both public and internal. The example overlay rejects these options; choose one access boundary.');

    document.components ??= {};
    if (!object(document.components)) throw new Error('The base components value is not an object.');
    document.components.securitySchemes ??= {};
    const schemes = document.components.securitySchemes;
    if (!object(schemes)) throw new Error('The base securitySchemes value is not an object.');

    if (auth.public) {
        operation.security = [];
        operation['x-connectum-public'] = true;
    } else if (auth.internal) {
        schemes.internalToken = { type: 'apiKey', in: 'header', name: 'x-internal-token' };
        operation.security = [{ internalToken: [] }];
        operation['x-connectum-internal'] = true;
    } else {
        schemes.bearerAuth = { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' };
        operation.security = [{ bearerAuth: [] }];
    }
    if (!auth.public && auth.requires?.roles.length) operation['x-connectum-required-roles'] = [...auth.requires.roles];
    if (!auth.public && auth.requires?.scopes.length) operation['x-connectum-required-scopes'] = [...auth.requires.scopes];

    return { kind: 'patched' as const, document, path, auth };
}

/** retain the complete generated document while showing only this overlay's fields. */
export function securityFragment(document: JsonObject, path: string): JsonObject {
    const item = object(document.paths) ? document.paths[path] : undefined;
    const operation = object(item) ? item.post : undefined;
    const fields: JsonObject = {};
    if (object(operation)) {
        for (const [name, value] of Object.entries(operation)) {
            if (name === 'security' || name.startsWith('x-connectum-')) fields[name] = value;
        }
    }
    const components = document.components;
    const schemes = object(components) && object(components.securitySchemes) ? components.securitySchemes : {};
    return {
        paths: { [path]: object(operation) ? { post: fields } : {} },
        ...(Object.keys(schemes).length ? { components: { securitySchemes: schemes } } : {}),
    };
}
