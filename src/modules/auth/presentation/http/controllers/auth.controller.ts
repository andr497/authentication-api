import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Ip,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { LoginDto } from '@modules/auth/application/dto/login.dto';
import { RefreshTokenDto } from '@modules/auth/application/dto/refresh-token.dto';
import { RegisterDto } from '@modules/auth/application/dto/register.dto';
import { VerifyEmailDto } from '@modules/auth/application/dto/verify-email.dto';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@modules/auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '@modules/auth/application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { VerifyEmailUseCase } from '@modules/auth/application/use-cases/verify-email.use-case';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards/jwt-auth.guard';

import type { AuthUser } from '../types/auth-user.type';
import { RegisterResponse } from '../responses/register.response';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthResponseMapper } from '../mappers/auth-response.mapper';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly verifyEmailUseCase: VerifyEmailUseCase,
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
        @Ip() ipAddress: string,
        @Headers('user-agent') userAgent: string | undefined,
    ) {
        const tokens = await this.refreshTokenUseCase.execute(dto, {
            ipAddress,
            userAgent: userAgent ?? 'unknown',
        });

        return AuthResponseMapper.toLoginResponse(tokens);
    }

    @Post('logout')
    @ApiNoContentResponse()
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Body() dto: RefreshTokenDto) {
        await this.logoutUseCase.execute(dto);
        return;
    }

    @Get('verify-email')
    async verifyEmail(@Query() dto: VerifyEmailDto) {
        await this.verifyEmailUseCase.execute(dto);

        return {
            message: 'Email verified successfully',
        };
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(
        @CurrentUser()
        user: AuthUser,
    ) {
        return user;
    }
}
