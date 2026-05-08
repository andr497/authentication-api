import { RegisterDto } from '@modules/auth/application/dto/register.dto';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthResponseMapper } from '../mappers/auth-response.mapper';

@Controller('auth')
export class AuthController {
    constructor(private readonly registerUseCase: RegisterUseCase) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.registerUseCase.execute(dto);

        return AuthResponseMapper.toRegisterResponse(user);
    }
}
