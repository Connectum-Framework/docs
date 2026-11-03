import { createServer, defineService } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { InventoryService } from '../gen/shop/v1/inventory_pb.ts';
import { checkStock } from './inventory.ts';

export function createExampleServer(onHandler: () => void) {
    return createServer({
        services: [
            defineService(InventoryService, {
                checkStock(req) {
                    onHandler();
                    return checkStock(req);
                },
            }),
        ],
        interceptors: createDefaultInterceptors({ errorHandler: { logErrors: false } }),
        host: '127.0.0.1',
        port: 0,
        allowHTTP1: true,
        shutdown: { autoShutdown: false },
    });
}
