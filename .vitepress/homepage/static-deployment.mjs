import { deploymentLayout, deployments } from './deployment-model.mjs';

/** share the animation's model so the no-JS diagram cannot drift to another deployment. */
export function staticDeploymentSvg(compact = false) {
    const variant = compact ? 'compact' : 'wide';
    const id = `deployment-static-${variant}`;
    const layout = deploymentLayout(deployments[0], compact);
    const groups = layout.groups
        .map(
            (group) =>
                `<rect x="${group.x}" y="${group.y}" width="${group.width}" height="${group.height}" rx="12" class="deployment-boundary deployment-boundary--${group.kind}"/><text x="${group.x + 12}" y="${group.y + 19}" class="deployment-process-label">${group.label}</text><text x="${group.x + 12}" y="${group.y + 36}" class="deployment-process-kind deployment-process-kind--${group.kind}">Local</text>`,
        )
        .join('');
    const edges = layout.edges
        .map(
            (edge) =>
                `<path d="${edge.path}" class="deployment-edge deployment-edge--${edge.kind}" marker-end="url(#${id}-arrow)"/><text x="${edge.labelX}" y="${edge.labelY}" text-anchor="middle" class="deployment-edge-label">local</text>`,
        )
        .join('');
    const cards = layout.cards
        .map((card) => {
            const icon = compact
                ? ''
                : `<rect x="${card.x + 14}" y="${card.y + 17}" width="30" height="30" rx="7" class="deployment-service__icon"/><text x="${card.x + 29}" y="${card.y + 37}" text-anchor="middle" class="deployment-service__initial">${card.initial}</text>`;
            const x = compact ? card.x + card.width / 2 : card.x + 56;
            const anchor = compact ? 'middle' : 'start';
            return `<g class="deployment-service deployment-service--${card.id}"><rect x="${card.x}" y="${card.y}" width="${card.width}" height="${card.height}" rx="9" class="deployment-service__surface"/>${icon}<text x="${x}" y="${card.y + 29}" text-anchor="${anchor}" class="deployment-service__name">${card.label}</text><text x="${x}" y="${card.y + 47}" text-anchor="${anchor}" class="deployment-service__type">service</text></g>`;
        })
        .join('');
    return `<svg class="deployment-static deployment-static--${variant}" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">Monolith: 1 process</title><desc id="${id}-desc">Profile, Users and Avatars share a process. Both calls are in-process. This is an illustration, not live redeployment.</desc><defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs>${groups}${edges}${cards}</svg>`;
}
