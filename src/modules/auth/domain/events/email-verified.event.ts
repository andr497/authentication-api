import { DomainEvent } from '@shared/domain/events/domain-event';

export class EmailVerifiedEvent extends DomainEvent {
    constructor(public readonly userId: string) {
        super();
    }
}
