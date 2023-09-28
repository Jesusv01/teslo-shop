import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // console.log(req);
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found in request');
    return !data ? user : user[data];
  },
);
