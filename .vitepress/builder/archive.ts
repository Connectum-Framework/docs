// biome-ignore-all lint/suspicious/noBitwiseOperators: ZIP CRC-32 requires unsigned shifts and polynomial XOR arithmetic.
import type { ProjectFiles } from './types.ts';

const encoder = new TextEncoder();
const table = Uint32Array.from({ length: 256 }, (_, value) => {
    let crc = value;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    return crc >>> 0;
});

function crc32(bytes: Uint8Array): number {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
    return (crc ^ 0xffffffff) >>> 0;
}

export function projectArchive(name: string, files: ProjectFiles): Uint8Array<ArrayBuffer> {
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) throw new Error('Invalid archive folder name.');
    const entries = Object.entries(files).map(([path, content]) => {
        if (path.startsWith('/') || path.split('/').some((segment) => segment === '..') || path.includes('\\')) throw new Error(`Unsafe archive path: ${path}`);
        return { path: encoder.encode(`${name}/${path}`), content: encoder.encode(content) };
    });
    let length = 22;
    for (const entry of entries) length += 30 + 46 + entry.path.length * 2 + entry.content.length;
    const bytes = new Uint8Array(length);
    const view = new DataView(bytes.buffer);
    let offset = 0;
    const central: Uint8Array[] = [];
    for (const entry of entries) {
        const start = offset;
        const checksum = crc32(entry.content);
        view.setUint32(offset, 0x04034b50, true);
        view.setUint16(offset + 4, 20, true);
        view.setUint16(offset + 6, 0x0800, true);
        view.setUint16(offset + 12, 0x21, true);
        view.setUint32(offset + 14, checksum, true);
        view.setUint32(offset + 18, entry.content.length, true);
        view.setUint32(offset + 22, entry.content.length, true);
        view.setUint16(offset + 26, entry.path.length, true);
        offset += 30;
        bytes.set(entry.path, offset);
        offset += entry.path.length;
        bytes.set(entry.content, offset);
        offset += entry.content.length;
        const record = new Uint8Array(46 + entry.path.length);
        const c = new DataView(record.buffer);
        c.setUint32(0, 0x02014b50, true);
        c.setUint16(4, 20, true);
        c.setUint16(6, 20, true);
        c.setUint16(8, 0x0800, true);
        c.setUint16(14, 0x21, true);
        c.setUint32(16, checksum, true);
        c.setUint32(20, entry.content.length, true);
        c.setUint32(24, entry.content.length, true);
        c.setUint16(28, entry.path.length, true);
        c.setUint32(42, start, true);
        record.set(entry.path, 46);
        central.push(record);
    }
    const centralStart = offset;
    for (const record of central) {
        bytes.set(record, offset);
        offset += record.length;
    }
    view.setUint32(offset, 0x06054b50, true);
    view.setUint16(offset + 8, entries.length, true);
    view.setUint16(offset + 10, entries.length, true);
    view.setUint32(offset + 12, offset - centralStart, true);
    view.setUint32(offset + 16, centralStart, true);
    return bytes;
}
