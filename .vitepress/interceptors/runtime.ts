import { Code, ConnectError, createClient, createRouterTransport } from '@connectrpc/connect';
import { createChain } from './example/src/chain.ts';
import { checkStock } from './example/src/inventory.ts';
import { InventoryService } from './gen/shop/v1/inventory_pb.ts';
import type { RunResult, Settings } from './settings.ts';
import { getOutcome } from './settings.ts';

export async function runInterceptors(settings: Settings, signal?: AbortSignal): Promise<RunResult> {
    const events: string[] = [];
    const write = (entry: string) => events.push(entry);
    let handlerCalls = 0;
    let sourceHeader: string | null = null;
    const transport = createRouterTransport(
        (router) => {
            router.service(InventoryService, {
                checkStock(req) {
                    handlerCalls++;
                    return checkStock(req, write);
                },
            });
        },
        { router: { interceptors: createChain(settings.chain, write) } },
    );
    const client = createClient(InventoryService, transport);
    try {
        const response = await client.checkStock(
            { sku: getOutcome(settings.outcome).sku },
            {
                signal,
                onHeader(header) {
                    sourceHeader = header.get('x-stock-source');
                },
            },
        );
        return { code: 'OK', events, sourceHeader, handlerCalls, response: { units: response.units } };
    } catch (error) {
        if (!(error instanceof ConnectError) || signal?.aborted) throw error;
        return { code: Code[error.code], events, sourceHeader, handlerCalls, error: error.rawMessage };
    }
}
