import { clamp, sceneAt } from './motion.mjs';

export const selectedScene = (frame, scenes) => sceneAt(Math.floor(frame), scenes);
export const commandTyped = (frame, start, frames, characters) => Math.floor(clamp((frame - start) / frames) * characters);
export const loopFrame = (milliseconds, fps, duration) => ((((milliseconds * fps) / 1000) % duration) + duration) % duration;
