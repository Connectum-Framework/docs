import { clone, create, createFileRegistry, setExtension } from '@bufbuild/protobuf';
import { FileDescriptorProtoSchema, MethodOptionsSchema } from '@bufbuild/protobuf/wkt';
import base from './base/shop/v1/inventory.openapi.json' with { type: 'json' };
import { MethodAuthSchema, method_auth } from './gen/connectum/auth/v1/options_pb.ts';
import { file_shop_v1_inventory } from './gen/shop/v1/inventory_pb.ts';
import { jsonDocument, overlayMethod, securityFragment } from './overlay.ts';
import { annotationFor, methodFor, type Settings } from './settings.ts';

const baseDocument = jsonDocument(base);

export function methodDescriptor(settings: Settings) {
    const annotation = annotationFor(settings.annotation);
    methodFor(settings.method);
    // the reader caches by descriptor identity; a fresh file prevents stale options.
    const file = clone(FileDescriptorProtoSchema, file_shop_v1_inventory.proto);
    const method = file.service[0]?.method.find((method) => method.name === settings.method);
    if (!method) throw new Error('The compiled Inventory method is missing.');
    method.options = create(MethodOptionsSchema);
    setExtension(method.options, method_auth, create(MethodAuthSchema, annotation.options));
    const registry = createFileRegistry(file, (name) => file_shop_v1_inventory.dependencies.find((dependency) => dependency.proto.name === name));
    const descriptor = registry.getService('shop.v1.InventoryService')?.methods.find((method) => method.name === settings.method);
    if (!descriptor) throw new Error('The edited method descriptor could not be constructed.');
    return descriptor;
}

export function runOverlay(settings: Settings) {
    const method = methodDescriptor(settings);
    try {
        const result = overlayMethod(baseDocument, method);
        return {
            ...result,
            output: JSON.stringify(securityFragment(result.document, result.path), null, 2),
            fullOutput: JSON.stringify(result.document, null, 2),
        };
    } catch (error) {
        return { kind: 'rejected' as const, path: `/${method.parent.typeName}/${method.name}`, message: error instanceof Error ? error.message : String(error) };
    }
}

export type OverlayResult = ReturnType<typeof runOverlay>;
