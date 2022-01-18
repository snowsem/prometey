import {createParamDecorator, ExecutionContext, UnauthorizedException} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (!request.user) {
             throw new UnauthorizedException('CurrentUserDecorator: Not found user in req')
        }
        return request.user;
    },
);