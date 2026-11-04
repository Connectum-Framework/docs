import { writeFileSync } from 'node:fs';
import { captureInterceptors } from './capture.ts';

writeFileSync(new URL('../../recording.json', import.meta.url), `${JSON.stringify(await captureInterceptors(), null, 4)}\n`);
