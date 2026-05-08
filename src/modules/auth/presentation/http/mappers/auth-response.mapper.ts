import { User } from '../../../domain/entities/user.entity';
import { RegisterResponse } from '../responses/register.response';

export class AuthResponseMapper {
    static toRegisterResponse(user: User): RegisterResponse {
        return {
            id: user.id,
            email: user.email.getValue(),
            isVerified: user.isVerified,
            isActive: user.isActive,
        };
    }
}
