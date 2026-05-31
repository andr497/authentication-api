import { DomainEvent } from '@shared/domain/events/domain-event';

export abstract class EventBus {
    abstract publish(events: DomainEvent[]): Promise<void>;
}
