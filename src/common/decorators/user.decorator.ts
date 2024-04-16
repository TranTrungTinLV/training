import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserFromRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
