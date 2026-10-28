import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { getOption } from '@bufbuild/protobuf';
import { Code, ConnectError, createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-node';
import { validationScenarios } from '../../scenarios.ts';
import { field } from '../gen/buf/validate/validate_pb.ts';
import { CheckStockRequestSchema, InventoryService } from '../gen/shop/v1/inventory_pb.ts';
import { createExampleServer } from './server.ts';

export async function captureValidation() {
    const rules = getOption(CheckStockRequestSchema.field.sku, field).type;
    if (rules.case !== 'string') throw new Error('The showcase requires the string constraint on sku.');
    const minimum = rules.value.minLen;
    function observeRule(sku: string, passed: boolean) {
        const characters = Array.from(sku).length;
        // Compare the explanation with the observed interceptor boundary, not just its expected result.
        if (BigInt(characters) >= minimum !== passed) throw new Error('The recorded RPC does not match the proto length constraint.');
        return { field: 'sku', value: sku, characters, minimum: String(minimum), passed };
    }
    let handlerCalls = 0;
    const server = createExampleServer(() => {
        handlerCalls++;
    });
    await server.start();
    try {
        const client = createClient(InventoryService, createConnectTransport({ baseUrl: `http://127.0.0.1:${server.address?.port}`, httpVersion: '1.1' }));
        const records = [];
        for (const scenario of validationScenarios) {
            const before = handlerCalls;
            const request = { sku: scenario.sku };
            try {
                const response = await client.checkStock(request);
                records.push({
                    id: scenario.id,
                    request,
                    validation: observeRule(request.sku, handlerCalls > before),
                    handlerCalls: handlerCalls - before,
                    code: 'OK',
                    response: { units: response.units },
                });
            } catch (error) {
                if (!(error instanceof ConnectError)) throw error;
                records.push({
                    id: scenario.id,
                    request,
                    validation: observeRule(request.sku, handlerCalls > before),
                    handlerCalls: handlerCalls - before,
                    code: Code[error.code],
                    error: { code: Code[error.code], message: error.rawMessage },
                });
            }
        }
        const sources = Object.fromEntries(
            [
                'proto/shop/v1/inventory.proto',
                'src/inventory.ts',
                'src/server.ts',
                'src/capture.ts',
                'package.json',
                'pnpm-lock.yaml',
                'buf.lock',
                'buf.gen.yaml',
                '../scenarios.ts',
            ].map((path) => [
                path,
                createHash('sha256')
                    .update(readFileSync(new URL(`../${path}`, import.meta.url)))
                    .digest('hex'),
            ]),
        );
        return { transport: 'Connect over HTTP/1.1', sources, records };
    } finally {
        await server.stop();
    }
}
