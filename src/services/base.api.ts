// eslint-disable-next-line
export abstract class BaseApi<T extends {id: string}, F = any> {
    abstract list(filter?: F): Promise<Array<T>>;

    abstract get(id: string): Promise<T | undefined>;

    abstract create(member: Omit<T, 'id'>): Promise<T | undefined>;

    abstract update(member: Partial<T> & {id: string}): Promise<T | undefined>;

    abstract delete(member: T): Promise<boolean>;
}
