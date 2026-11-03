export const ordersTypeName = 'shop.v1.OrdersService';
export const inventoryTypeName = 'shop.v1.InventoryService';
export const catalogCall = `const stock = await ctx.call(
  '${inventoryTypeName}/CheckStock',
  create(CheckStockRequestSchema, { sku: req.sku }),
);`;

export const scenes = [
    { id: 'local', label: 'Together', title: 'Two services. One process.', local: true, hasRoute: true },
    { id: 'remote', label: 'Separate', title: 'Move Inventory. Keep the call.', local: false, hasRoute: true },
    { id: 'unroutable', label: 'No route', title: 'A contract is not an address.', local: false, hasRoute: false },
] as const;

export type CatalogScene = (typeof scenes)[number]['id'];

export function explainRoute(id: CatalogScene) {
    const scene = scenes.find((scene) => scene.id === id);
    if (!scene) throw new Error(`Unknown catalog scene: ${id}`);
    const kind = scene.local ? 'local' : scene.hasRoute ? 'remote' : 'unavailable';
    const description = scene.local
        ? 'Orders and Inventory are mounted on the same server. The catalog call reaches Inventory in-process; no socket or resolver lookup is needed.'
        : scene.hasRoute
          ? 'Orders is local, Inventory is not. The resolver supplies a gRPC transport to the Inventory process. The handler still makes exactly the same call.'
          : 'Orders knows the Inventory contract, but the resolver returns null. The call fails before any request can reach Inventory.';
    const steps = [
        'Look up InventoryService/CheckStock in the catalog.',
        scene.local ? 'Find Inventory mounted on this server.' : 'Inventory is not mounted here. Ask the resolver for a transport.',
        kind === 'unavailable'
            ? 'No route: reject with Code.Unavailable. No handler runs.'
            : `Call the Inventory handler ${scene.local ? 'in-process' : 'over the resolved transport'} and return its stock message.`,
    ];
    const configuration = [
        'createServer({',
        `  services: [orders${scene.local ? ', inventory' : ''}],`,
        '  catalog: serviceCatalog,',
        scene.hasRoute ? `  remoteResolver: mapResolver({\n    [InventoryService.typeName]: inventoryTransport,\n  }),` : '  remoteResolver: mapResolver({}),',
        '});',
    ].join('\n');
    return {
        ...scene,
        kind,
        description,
        steps,
        configuration,
        result: kind === 'unavailable' ? 'Code.Unavailable' : '{ units: 7 }',
        routeLabel: scene.local ? 'In-process' : scene.hasRoute ? 'gRPC / HTTP/2' : 'No transport',
    };
}
