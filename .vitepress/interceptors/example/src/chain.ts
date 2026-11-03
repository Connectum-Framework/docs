import type { Settings } from '../../settings.ts';
import { getChain } from '../../settings.ts';
import { createAudit } from './audit.ts';
import { createStockTag } from './stockTag.ts';

export function createChain(id: Settings['chain'], write: (entry: string) => void) {
    const factories = { audit: createAudit, stockTag: createStockTag };
    return getChain(id).order.map((name) => factories[name](write));
}
