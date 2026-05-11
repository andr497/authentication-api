import { LoginDto } from '@src/modules/auth/application/dto/login.dto';
import { RegisterDto } from '@modules/auth/application/dto/register.dto';
import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Ip,
    Post,
    UseGuards,
} from '@nestjs/common';
import { LoginUseCase } from '@src/modules/auth/application/use-cases/login.use-case';
import { RefreshTokenDto } from '@src/modules/auth/application/dto/refresh-token.dto';
import { JwtAuthGuard } from '@src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { LogoutUseCase } from '@src/modules/auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '@src/modules/auth/application/use-cases/refresh-token.use-case';
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
