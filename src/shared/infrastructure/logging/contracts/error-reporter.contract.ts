export abstract class ErrorReporter {
    abstract report(
        error: Error,
        context?: string,
        metadata?: Record<string, unknown>,
    ): Promise<void>;
}
