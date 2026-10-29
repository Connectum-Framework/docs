export const slideDuration = 7400;
export const deployments = [
    { id: 'monolith', label: 'Monolith', groups: [['profile', 'users', 'avatars']] },
    { id: 'microservices', label: 'Microservices', groups: [['profile'], ['users'], ['avatars']] },
    { id: 'hybrid', label: 'Hybrid', groups: [['profile', 'users'], ['avatars']] },
];

export const services = [
    { id: 'profile', label: 'Profile', initial: 'P' },
    { id: 'users', label: 'Users', initial: 'U' },
    { id: 'avatars', label: 'Avatars', initial: 'A' },
];

export function routeKind(deployment, target) {
    return deployment.groups.some((group) => group.includes('profile') && group.includes(target)) ? 'local' : 'remote';
}

const transferTimings = {
    local: { request: 600, response: 500 },
    remote: { request: 1200, response: 1000 },
};

export function deploymentLayout(deployment, compact) {
    const width = compact ? 320 : 640;
    const height = compact ? 382 : 342;
    const cardWidth = compact ? 112 : 184;
    const xLeft = compact ? 24 : 64;
    const xRight = compact ? 184 : 392;
    const yTop = compact ? 88 : 86;
    const yBottom = compact ? 280 : 238;
    const cards = services.map((service, index) => ({
        ...service,
        x: index === 0 ? xLeft : xRight,
        y: index === 2 ? yBottom : yTop,
        width: cardWidth,
        height: 64,
    }));
    const groups = deployment.groups.map((ids, index) => {
        const members = cards.filter((card) => ids.includes(card.id));
        const x = Math.min(...members.map((card) => card.x)) - (compact ? 12 : 20);
        const y = Math.min(...members.map((card) => card.y)) - 46;
        return {
            ids,
            kind: ids.includes('profile') ? 'local' : 'remote',
            label: `Process ${String(index + 1).padStart(2, '0')}`,
            x,
            y,
            width: Math.max(...members.map((card) => card.x + card.width)) - x + (compact ? 12 : 20),
            height: Math.max(...members.map((card) => card.y + card.height)) - y + 18,
        };
    });
    const [profile, users, avatars] = cards;
    const startX = profile.x + profile.width / 2;
    const midY = avatars.y + 32;
    return {
        width,
        height,
        cards,
        groups,
        edges: [
            {
                target: 'users',
                kind: routeKind(deployment, 'users'),
                path: `M${profile.x + cardWidth} ${profile.y + 32}H${users.x}`,
                labelX: (profile.x + cardWidth + users.x) / 2,
                labelY: profile.y + (compact ? 7 : 19),
            },
            {
                target: 'avatars',
                kind: routeKind(deployment, 'avatars'),
                path: `M${startX} ${profile.y + 64}V${midY - 14}Q${startX} ${midY} ${startX + 14} ${midY}H${avatars.x}`,
                labelX: compact ? 82 : 274,
                labelY: compact ? 224 : midY - 12,
            },
        ],
    };
}

export function deploymentFrame(elapsed, reduced = false) {
    const total = deployments.length * slideDuration;
    const wrapped = ((elapsed % total) + total) % total;
    const index = Math.min(deployments.length - 1, Math.floor(wrapped / slideDuration));
    const local = wrapped - index * slideDuration;
    if (reduced) return { index, local: slideDuration - 1, phase: 'complete', target: null, fraction: 1 };
    for (const [target, requestAt] of [
        ['users', 600],
        ['avatars', 3200],
    ]) {
        const timing = transferTimings[routeKind(deployments[index], target)];
        const responseAt = requestAt + timing.request;
        if (local >= requestAt && local < responseAt) return { index, local, phase: 'request', target, fraction: (local - requestAt) / timing.request };
        if (local >= responseAt && local < responseAt + timing.response) return { index, local, phase: 'response', target, fraction: 1 - (local - responseAt) / timing.response };
    }
    return { index, local, phase: local < 600 ? 'ready' : local < 3200 ? 'users-complete' : 'complete', target: null, fraction: 1 };
}
