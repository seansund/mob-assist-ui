import {ModelRef} from "@/models";

// eslint-disable-next-line
export abstract class BaseApi<T extends ModelRef, F = any, C = Omit<T, 'id'>> {
    abstract list(filter?: F): Promise<Array<T>>;

    abstract get(id: string): Promise<T | undefined>;

    abstract create(member: C): Promise<T | undefined>;

    abstract update(member: Partial<T> & {id: string}): Promise<T | undefined>;

    abstract delete(member: T): Promise<boolean>;
}
