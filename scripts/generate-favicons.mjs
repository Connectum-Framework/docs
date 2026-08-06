#!/usr/bin/env node
/**
 * Regenerate every favicon asset from `public/assets/favicon.svg`.
 *
 * Local tool, not a CI step: it shells out to `rsvg-convert` and ImageMagick, which the
 * build does not have. The outputs are committed, so run this after editing the source
 * SVG and commit what changes.
 *
 *   node scripts/generate-favicons.mjs
 *
 * Sizes follow what each platform actually asks for. The Apple touch icon is the one
 * exception to "keep it transparent": iOS composites a home-screen icon onto black and
 * applies its own rounding, so it gets an opaque plate and a safe-area inset instead.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';

const projectRoot = resolve(import.meta.dirname, '..');
const source = resolve(projectRoot, 'public/assets/favicon.svg');
const publicDir = resolve(projectRoot, 'public');
const scratch = mkdtempSync(join(tmpdir(), 'connectum-favicon-'));

const APPLE_SIZE = 180;
const APPLE_INSET = 20; // leaves the mark clear of the corner mask iOS applies
const APPLE_BACKGROUND = '#ffffff';
const THEME_COLOR = '#635bff';

const run = (command, args) => execFileSync(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });

const requireTool = (command) => {
    try {
        run(command, ['--version']);
    } catch {
        process.stderr.write(`Missing required tool: ${command}\n`);
        process.exit(1);
    }
};

requireTool('rsvg-convert');
requireTool('magick');

/** Render the source SVG to a transparent PNG of the given square size. */
const render = (size, destination) => {
    run('rsvg-convert', ['-w', String(size), '-h', String(size), source, '-o', destination]);
};

try {
    // The SVG itself is the primary icon wherever it is supported.
    run('cp', [source, resolve(publicDir, 'favicon.svg')]);

    const pngs = [16, 32, 48, 192, 512];
    for (const size of pngs) {
        render(size, join(scratch, `${size}.png`));
    }

    run('cp', [join(scratch, '16.png'), resolve(publicDir, 'favicon-16x16.png')]);
    run('cp', [join(scratch, '32.png'), resolve(publicDir, 'favicon-32x32.png')]);
    run('cp', [join(scratch, '192.png'), resolve(publicDir, 'android-chrome-192x192.png')]);
    run('cp', [join(scratch, '512.png'), resolve(publicDir, 'android-chrome-512x512.png')]);

    // Browsers still request /favicon.ico unprompted; a multi-size icon answers every
    // legacy surface (tab, bookmark bar, Windows shortcut) from one file.
    run('magick', [join(scratch, '16.png'), join(scratch, '32.png'), join(scratch, '48.png'), resolve(publicDir, 'favicon.ico')]);

    const artwork = APPLE_SIZE - APPLE_INSET * 2;
    render(artwork, join(scratch, 'apple-art.png'));
    run('magick', [
        '-size', `${APPLE_SIZE}x${APPLE_SIZE}`,
        `xc:${APPLE_BACKGROUND}`,
        join(scratch, 'apple-art.png'),
        '-gravity', 'center',
        '-composite',
        resolve(publicDir, 'apple-touch-icon.png'),
    ]);

    const manifest = {
        name: 'Connectum',
        short_name: 'Connectum',
        description: 'Production-ready gRPC and ConnectRPC framework for Node.js',
        icons: [
            { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
        theme_color: THEME_COLOR,
        background_color: '#ffffff',
        display: 'browser',
        start_url: '/',
    };
    writeFileSync(resolve(publicDir, 'site.webmanifest'), `${JSON.stringify(manifest, null, 4)}\n`);

    process.stdout.write(
        'Generated: favicon.svg, favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest\n',
    );
} finally {
    rmSync(scratch, { recursive: true, force: true });
}
