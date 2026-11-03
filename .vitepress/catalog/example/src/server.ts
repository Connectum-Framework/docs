import { pathToFileURL } from 'node:url';
import { create } from '@bufbuild/protobuf';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { createServer, defineService, mapResolver } from '@connectum/core';
import { serviceCatalog } from '../gen/catalog.gen.ts';
import { CheckStockRequestSchema, InventoryService, OrdersService } from '../gen/shop/v1/catalog_pb.ts';

const inventory = defineService(InventoryService, {
    checkStock: (req) => ({ units: req.sku === 'A-1' ? 7 : 0 }),
});

const orders = defineService(OrdersService, {
    async checkAvailability(req, ctx) {
        const stock = await ctx.call('shop.v1.InventoryService/CheckStock', create(CheckStockRequestSchema, { sku: req.sku }));
        return { sku: req.sku, available: stock.units > 0 };
    },
});

export function createExampleServer(options: { role: 'all' | 'orders' | 'inventory'; port: number; inventoryUrl?: string }) {
    const services = options.role === 'all' ? [orders, inventory] : options.role === 'orders' ? [orders] : [inventory];
    return createServer({
        services,
        catalog: serviceCatalog,
        port: options.port,
        host: '127.0.0.1',
        allowHTTP1: false,
        remoteResolver: mapResolver(options.inventoryUrl ? { [InventoryService.typeName]: createGrpcTransport({ baseUrl: options.inventoryUrl }) } : {}),
        shutdown: { autoShutdown: true, timeout: 5000 },
    });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const role = process.env.ROLE ?? 'all';
    if (role !== 'all' && role !== 'orders' && role !== 'inventory') throw new Error('ROLE must be all, orders or inventory.');
    const inventoryUrl = process.env.INVENTORY_URL?.trim();
    const server = createExampleServer({ role, port: Number(process.env.PORT ?? (role === 'inventory' ? 6000 : 5000)), ...(inventoryUrl ? { inventoryUrl } : {}) });
    await server.start();
    console.log(`${role} listening on ${server.address?.port}`);
}
