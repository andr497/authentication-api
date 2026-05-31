export abstract class TransactionManager {
    abstract run<T>(callback: () => Promise<T>): Promise<T>;
}
