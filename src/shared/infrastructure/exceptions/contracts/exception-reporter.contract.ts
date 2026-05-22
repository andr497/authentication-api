export abstract class ExceptionReporter {
    abstract report(exception: Error): void;
}
