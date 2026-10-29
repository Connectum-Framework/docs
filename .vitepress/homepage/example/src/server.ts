import { createServer } from '@connectum/core';
import { greeter } from './greeter.ts';

const server = createServer({
  services: [greeter],
  port: 5000,
  allowHTTP1: false,
});
await server.start();
