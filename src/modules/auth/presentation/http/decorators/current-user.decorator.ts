import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../types/auth-user.type';
import { Request } from 'express';

type RequestWithUser = Request & { user: AuthUser };

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): AuthUser => {
        const request = context.switchToHttp().getRequest<RequestWithUser>();

        return request.user;
    },
);
