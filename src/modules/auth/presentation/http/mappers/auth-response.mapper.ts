import { User } from '../../../domain/entities/user.entity';
import { LoginResponse } from '../responses/login.response';
import { RegisterResponse } from '../responses/register.response';

export class AuthResponseMapper {
    static toRegisterResponse(user: User): RegisterResponse {
        return {
            id: user.id,
            email: user.email.getValue(),
            isVerified: user.isEmailVerified(),
            isActive: user.isActiveUser(),
        };
    }

    static toLoginResponse(tokens: {
        accessToken: string;
        refreshToken: string;
    }): LoginResponse {
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
}
