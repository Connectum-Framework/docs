import { defineService } from '@connectum/core';
import { GreeterService } from '../gen/greeter_pb.ts';

export const greeter = defineService(GreeterService, {
  async sayHello({ name }) {
    return { message: `Hello, ${name}!` };
  },
});
