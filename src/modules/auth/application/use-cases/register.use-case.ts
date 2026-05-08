import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { randomUUID } from 'crypto';
import { HashService } from '@modules/auth/infrastructure/services/hash.service';
import { RegisterDto } from '../dto/register.dto';
import { Email } from '@modules/auth/domain/value-objects/email.vo';
import { Password } from '@modules/auth/domain/value-objects/password.vo';
import { UserAlreadyExistsError } from '../../domain/errors/auth-exceptions.error';

@Injectable()
export class RegisterUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
    ) {}

    async execute(dto: RegisterDto): Promise<User> {
        const email = Email.create(dto.email);
        const password = Password.create(dto.password);

        const existingUser = await this.userRepository.findByEmail(
            email.getValue(),
        );

        if (existingUser) {
            throw new UserAlreadyExistsError();
        }

        const hashedPassword = await this.hashService.hash(password.getValue());

        const user = User.create({
            id: randomUUID(),
            email,
            password: hashedPassword,
        });

        return this.userRepository.save(user);
    }
}
