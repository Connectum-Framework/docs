import { diagrams as build } from './build.mjs';
import { diagrams as communication } from './communication.mjs';
import { diagrams as deployment } from './deployment.mjs';
import { diagrams as foundation } from './foundation.mjs';

export const diagrams = [...foundation, ...build, ...communication, ...deployment];
