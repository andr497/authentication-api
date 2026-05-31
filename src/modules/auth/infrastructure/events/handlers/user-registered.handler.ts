import { Injectable } from '@nestjs/common';
import { VerificationEmailService } from '@modules/auth/application/services/verification-email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '@modules/auth/domain/events/user-registered.event';

@Injectable()
export class UserRegisteredHandler {
    constructor(
        private readonly verificationEmailService: VerificationEmailService,
    ) {}

    @OnEvent(UserRegisteredEvent.name)
    async handle(event: UserRegisteredEvent) {
        if (!event.verificationToken) return;

        await this.verificationEmailService.send(
            event.email,
            event.verificationToken,
            event.userId,
        );
    }
}
