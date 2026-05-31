import { DomainEvent } from '@shared/domain/events/domain-event';

export class UserRegisteredEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly verificationToken?: string,
    ) {
        super();
    }
}
