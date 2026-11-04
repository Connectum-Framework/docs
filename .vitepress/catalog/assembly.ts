export type AssemblyLayoutId = 'folder' | 'packages' | 'repositories';
export type ContractId = 'orders' | 'inventory';

// labels mirror the executable shop.v1 example; these are not live protobuf descriptors.
export const assemblyContracts = {
    orders: {
        name: 'Orders',
        file: 'orders.proto',
        typeName: 'shop.v1.OrdersService',
        descriptor: 'OrdersService',
        method: 'CheckAvailability',
        request: 'CheckAvailabilityRequest',
        requestFields: 'sku: string',
        response: 'CheckAvailabilityResponse',
        responseFields: 'sku: string; available: boolean',
    },
    inventory: {
        name: 'Inventory',
        file: 'inventory.proto',
        typeName: 'shop.v1.InventoryService',
        descriptor: 'InventoryService',
        method: 'CheckStock',
        request: 'CheckStockRequest',
        requestFields: 'sku: string',
        response: 'CheckStockResponse',
        responseFields: 'units: number',
    },
} satisfies Record<
    ContractId,
    { name: string; file: string; typeName: string; descriptor: string; method: string; request: string; requestFields: string; response: string; responseFields: string }
>;

type BuildGroup = {
    root: string;
    contracts: readonly ContractId[];
    importFrom: string;
    dependency?: string;
};
type AssemblyLayout = {
    id: AssemblyLayoutId;
    label: string;
    explanation: string;
    boundary: string;
    groups: readonly BuildGroup[];
    code: string;
    caveat: string;
};

const composedCode = `import { mergeCatalogs } from '@connectum/core';
import { serviceCatalog as ordersCatalog } from '@shop/orders-contracts';
import { serviceCatalog as inventoryCatalog } from '@shop/inventory-contracts';

export const catalog = mergeCatalogs(ordersCatalog, inventoryCatalog);`;

export const assemblyLayouts: readonly AssemblyLayout[] = [
    {
        id: 'folder',
        label: 'One folder',
        explanation: 'Both proto files are inputs to the same generation run. One generated catalog already contains both services.',
        boundary: 'One application · one generation input set',
        groups: [{ root: 'app/', contracts: ['orders', 'inventory'], importFrom: './gen/catalog.gen.js' }],
        code: `import { serviceCatalog } from './gen/catalog.gen.js';

export const catalog = serviceCatalog;`,
        caveat: 'Several source directories can also feed one generation run. Moving a file into another folder does not require merging catalogs.',
    },
    {
        id: 'packages',
        label: 'Separate packages',
        explanation: 'Each directory is an independently generated contract package. The application imports the two parts and merges their runtime maps.',
        boundary: 'One repository · two contract packages',
        groups: [
            { root: 'packages/orders-contracts/', contracts: ['orders'], importFrom: '@shop/orders-contracts' },
            { root: 'packages/inventory-contracts/', contracts: ['inventory'], importFrom: '@shop/inventory-contracts' },
        ],
        code: composedCode,
        caveat: 'The split here is a generation/package boundary, not just two folders. The package exports must also expose the generated type augmentations.',
    },
    {
        id: 'repositories',
        label: 'Separate repositories',
        explanation: 'Each repository builds a contract package. The consumer installs versioned dependencies, then uses the same imports and merge as in a monorepo.',
        boundary: 'Two source repositories → one consumer application',
        groups: [
            { root: 'orders-contracts repo/', contracts: ['orders'], importFrom: '@shop/orders-contracts', dependency: '@shop/orders-contracts@1.0.0' },
            { root: 'inventory-contracts repo/', contracts: ['inventory'], importFrom: '@shop/inventory-contracts', dependency: '@shop/inventory-contracts@1.0.0' },
        ],
        code: composedCode,
        caveat: 'Package names and 1.0.0 versions are illustrative. Ship compiled descriptors and declarations; consumers need both. This is package delivery, not service discovery.',
    },
];

export const ASSEMBLY_PAUSE_KEY = 'connectum-catalog-assembly-paused';
