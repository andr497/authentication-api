export abstract class AggregateRoot {
    private readonly domainEvent: unknown[] = [];

    addDomainEvent(event: unknown): void {
        this.domainEvent.push(event);
    }

    pullDomainEvents(): unknown[] {
        const events = [...this.domainEvent];
        this.domainEvent.length = 0;
        return events;
    }
}
