export abstract class BaseApi<T> {
    abstract list(): Promise<Array<T>>;

    abstract get(phone: string): Promise<T | undefined>;

    abstract addUpdate(member: T): Promise<T>;

    abstract delete(member: T): Promise<boolean>;
}
