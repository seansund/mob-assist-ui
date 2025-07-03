import {ModelRef} from "@/models";

// eslint-disable-next-line
export abstract class BaseApi<T extends ModelRef, F = any, C = Omit<T, 'id'>, D = T> {
    abstract list(filter?: F): Promise<Array<T>>;

    abstract get(id: string): Promise<T | undefined>;

    abstract create(member: C, filter?: F): Promise<T | undefined>;

    abstract update(member: Partial<T> & {id: string}, filter?: F): Promise<T | undefined>;

    abstract delete(member: D, filter?: F): Promise<boolean>;
}
