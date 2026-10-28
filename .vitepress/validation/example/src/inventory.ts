import { Code, ConnectError } from '@connectrpc/connect';

// These are example inventory data, not a connection to a production database.
const stock = new Map([['A-1', 7]]);

export function checkStock(req: { sku: string }) {
    const units = stock.get(req.sku);
    if (units === undefined) {
        throw new ConnectError('SKU not found', Code.NotFound);
    }
    return { units };
}
