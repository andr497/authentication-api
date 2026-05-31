import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '@shared/domain/events/domain-event';
import { EventBus } from '@shared/application/contracts/event-bus.contract';

@Injectable()
export class NestEventBus extends EventBus {
    constructor(private readonly eventEmitter: EventEmitter2) {
        super();
    }

    async publish(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.eventEmitter.emitAsync(event.constructor.name, event);
        }
    }
}
