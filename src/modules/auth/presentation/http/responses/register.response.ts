import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponse {
    @ApiProperty({
        example: '0b8f5f16-6d72-4db6-a6bc-f2d7dcf4c111',
    })
    id!: string;

    @ApiProperty({
        example: 'test@example.com',
    })
    email!: string;

    @ApiProperty({
        example: false,
    })
    isVerified!: boolean;

    @ApiProperty({
        example: true,
    })
    isActive!: boolean;
}
