import { createServer, defineService } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';
import type { Settings } from '../../settings.ts';
import { InventoryService } from '../gen/shop/v1/inventory_pb.ts';
import { createChain } from './chain.ts';
import { checkStock } from './inventory.ts';

export function createExampleServer(settings: Settings, write: (entry: string) => void, onHandler: () => void) {
    return createServer({
        services: [
            defineService(InventoryService, {
                checkStock(req) {
                    onHandler();
                    return checkStock(req, write);
                },
            }),
        ],
        interceptors: [...createDefaultInterceptors({ errorHandler: { logErrors: false } }), ...createChain(settings.chain, write)],
        host: '127.0.0.1',
        port: 0,
        allowHTTP1: true,
        shutdown: { autoShutdown: false },
    });
}
