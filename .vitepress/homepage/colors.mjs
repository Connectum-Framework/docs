const channels = (hex) => [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
const luminance = (hex) =>
    channels(hex)
        .map((value) => {
            const scaled = value / 255;
            return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
        })
        .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);

export function contrast(foreground, background) {
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
}

export function readableLightToken(color) {
    let output = color;
    const original = channels(color);
    for (let factor = 1; factor >= 0 && contrast(output, '#f6f6f7') < 4.6; factor -= 0.01) {
        output =
            '#' +
            original
                .map((channel) =>
                    Math.round(channel * factor)
                        .toString(16)
                        .padStart(2, '0'),
                )
                .join('');
    }
    return output;
}
