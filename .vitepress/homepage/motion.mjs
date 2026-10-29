export const clamp = (value) => Math.max(0, Math.min(1, value));
export const easeOutCubic = (value) => 1 - (1 - value) ** 3;
export const segment = (value, start, end) => clamp((value - start) / (end - start));

export function lineReveal(frame, index, count) {
    // Keep the reference's four staggered groups instead of accelerating long files.
    const group = Math.min(3, Math.floor((index * 4) / count));
    const progress = easeOutCubic(segment(frame / 137, 0.08 + group * 0.14, 0.38 + group * 0.14));
    return { opacity: progress, y: (1 - progress) * 8 };
}

export const sceneAt = (frame, scenes) => scenes.findLast((scene) => frame >= scene.start) ?? scenes[0];
