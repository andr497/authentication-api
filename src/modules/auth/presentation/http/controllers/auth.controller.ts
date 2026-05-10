import { RegisterDto } from '@modules/auth/application/dto/register.dto';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import {
    Body,
    Controller,
    Ip,
    Post,
    Headers,
    Get,
    UseGuards,
} from '@nestjs/common';
import { AuthResponseMapper } from '../mappers/auth-response.mapper';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RegisterResponse } from '../responses/register.response';
import { LoginDto } from '@src/modules/auth/application/dto/login.dto';
import { LoginUseCase } from '@src/modules/auth/application/use-cases/login.use-case';
import { RefreshTokenDto } from '@src/modules/auth/application/dto/refresh-token.dto';
import { RefreshTokenUseCase } from '@src/modules/auth/application/use-cases/refresh-token.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '@src/modules/auth/infrastructure/guards/jwt-auth.guard';
import type { AuthUser } from '../types/auth-user.type';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
    ) {}

    @Post('register')
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Creates a new user account',
    })
    @ApiCreatedResponse({
        description: 'User successfully registered',
        type: RegisterResponse,
    })
    @ApiConflictResponse({
        description: 'User already exists',
    })
    @ApiUnprocessableEntityResponse({
        description: 'Invalid email or weak password',
    })
    @ApiBadRequestResponse({
        description: 'Validation error',
    })
    async register(@Body() dto: RegisterDto) {
        const user = await this.registerUseCase.execute(dto);

        return AuthResponseMapper.toRegisterResponse(user);
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Ip() ipAddress: string,
        @Headers('user-agent') userAgent: string | undefined,
    ) {
        const tokens = await this.loginUseCase.execute(dto, {
            ipAddress,
            userAgent: userAgent ?? 'unknown',
        });

        return AuthResponseMapper.toLoginResponse(tokens);
    }

    @Post('refresh')
    async refresh(
        @Body() dto: RefreshTokenDto,
        @Headers('user-agent') userAgent: string,
        @Ip() ipAddress: string,
    ) {
        const tokens = await this.refreshTokenUseCase.execute(dto, {
            ipAddress,
            userAgent,
        });

        return AuthResponseMapper.toLoginResponse(tokens);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(
        @CurrentUser()
        user: AuthUser,
    ) {
        return user;
    }
}
