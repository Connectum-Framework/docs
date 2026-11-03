import { Code, ConnectError } from '@connectrpc/connect';

const stock = new Map([['A-1', 7]]);

export function checkStock(req: { sku: string }, write: (entry: string) => void) {
    const units = stock.get(req.sku);
    if (units === undefined) {
        write('handler: throw NotFound');
        throw new ConnectError('SKU not found', Code.NotFound);
    }
    write(`handler: return ${units} units`);
    return { units };
}
