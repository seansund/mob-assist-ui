import {BaseApi} from "./base.api";
import {Comparator, first, invertFilter, timer} from "../util";

export abstract class BaseMock<T> extends BaseApi<T> {
    constructor(private values: T[] | Promise<T[]>) {
        super();
    }

    async list(): Promise<Array<T>> {
        await timer(1000)

        return this.values
    }

    async getValue(): Promise<T[]> {
        return this.values
    }

    async get(id: string): Promise<T | undefined> {
        const values = await this.values

        return first(values.filter(this.filter(id)))
            .orElse(undefined as any)
    }

    async addUpdate(toUpdate: T): Promise<Array<T>> {
        const values = await this.values

        first(values.filter(this.filter(this.getId(toUpdate))))
            .ifPresent(val => Object.assign(val as any, toUpdate))
            .orElseGet(() => {
                console.log('Adding new value: ', toUpdate)
                values.push(toUpdate)

                return toUpdate
            })

        return this.values
    }

    async delete(toDelete: T): Promise<Array<T>> {
        console.log('Deleting value: ', toDelete)
        const values = await this.values

        const newValues: Array<T> = values.filter(invertFilter(this.filter(this.getId(toDelete))))

        if (newValues.length !== values.length) {
            this.values = newValues
        }

        return this.values
    }

    filter(id: string): Comparator<T> {
        return (val: T) => id === this.getId(val)
    }

    abstract getId(val: T): string;
    abstract setId(val: T): T;
}