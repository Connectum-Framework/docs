import type { Interceptor } from '@connectrpc/connect';

export function createStockTag(write: (entry: string) => void): Interceptor {
    return (next) => async (req) => {
        write('stockTag: before');
        const response = await next(req);
        response.header.set('x-stock-source', 'fixture');
        write('stockTag: after (set header)');
        return response;
    };
}
