export const stackParallaxParts = [
    { key: 'connectum', desktop: 24, mobile: 14 },
    { key: 'connectrpc', desktop: 18, mobile: 10 },
    { key: 'protobuf', desktop: 12, mobile: 6 },
] as const;

// use the untransformed wrapper as the reference so each update cannot feed back into the next one.
export function stackParallaxOffset({ top, height, travel }: { top: number; height: number; travel: number }) {
    if (height <= 0) return 0;
    // spend the full travel over one plate height near the reading line, while the plate is still on screen.
    const progress = Math.max(0, Math.min(1, (96 + height - top) / height));
    return progress === 0 ? 0 : Number((-travel * progress).toFixed(3));
}
