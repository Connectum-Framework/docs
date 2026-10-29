import { mountDeployments } from './deployment.js';
import story from './native.json' with { type: 'json' };
import { mountPrototype } from './prototype.js';

export function mountCode(panel: HTMLElement) {
    return mountPrototype(panel, story);
}

export function mountDeployment(section: HTMLElement) {
    return mountDeployments(section);
}
