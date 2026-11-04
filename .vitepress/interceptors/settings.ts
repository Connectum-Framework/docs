export const chains = [
    { id: 'audit-first', label: 'audit → stockTag', order: ['audit', 'stockTag'] },
    { id: 'tag-first', label: 'stockTag → audit', order: ['stockTag', 'audit'] },
    { id: 'audit-only', label: 'audit only', order: ['audit'] },
] as const;

export const handlerOutcomes = [
    { id: 'success', label: 'Return stock', sku: 'A-1' },
    { id: 'failure', label: 'Throw NotFound', sku: 'UNKNOWN' },
] as const;

export type Settings = {
    chain: (typeof chains)[number]['id'];
    outcome: (typeof handlerOutcomes)[number]['id'];
};
export type RunResult = {
    code: string;
    events: string[];
    sourceHeader: string | null;
    handlerCalls: number;
    response?: { units: number };
    error?: string;
};

export const initialSettings: Settings = { chain: chains[0].id, outcome: handlerOutcomes[0].id };

export function getChain(id: Settings['chain']) {
    const chain = chains.find((entry) => entry.id === id);
    if (!chain) throw new RangeError(`Unknown interceptor chain: ${id}`);
    return chain;
}
export function getOutcome(id: Settings['outcome']) {
    const outcome = handlerOutcomes.find((entry) => entry.id === id);
    if (!outcome) throw new RangeError(`Unknown handler outcome: ${id}`);
    return outcome;
}
