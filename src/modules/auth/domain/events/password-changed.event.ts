import { DomainEvent } from '@shared/domain/events/domain-event';

export class PasswordChangedEvent extends DomainEvent {
    constructor(public readonly userId: string) {
        super();
    }
}
