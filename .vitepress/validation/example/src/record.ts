import { writeFileSync } from 'node:fs';
import { captureValidation } from './capture.ts';

const recording = await captureValidation();
writeFileSync(new URL('../../recording.json', import.meta.url), `${JSON.stringify(recording, null, 4)}\n`);
console.log(JSON.stringify(recording, null, 2));
