import {BaseApi} from "./base.api";
import {Comparator, first, invertFilter, timer} from "@/util";


export abstract class BaseMock<T extends {id: string}> extends BaseApi<T> {
    protected constructor(private values: T[] | Promise<T[]>) {
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
        const values: T[] = await this.values

        return first(values.filter(this.filter(id)))
            // eslint-disable-next-line
            .orElse(undefined as any)
    }

    async update(toUpdate: T): Promise<T> {
        const values: T[] = await this.values

        return first(values.filter(this.filter(this.getId(toUpdate))))
            .ifPresent(val => Object.assign(val as never, toUpdate))
            .orElseGet(() => {
                console.log('Adding new value: ', toUpdate)
                values.push(toUpdate)

                return toUpdate
            })
    }

    async create(toUpdate: T): Promise<T> {
        const values: T[] = await this.values

        return first(values.filter(this.filter(this.getId(toUpdate))))
            .ifPresent(val => Object.assign(val as never, toUpdate))
            .orElseGet(() => {
                console.log('Adding new value: ', toUpdate)
                values.push(toUpdate)

                return toUpdate
            })
    }

    async delete(toDelete: T): Promise<boolean> {
        console.log('Deleting value: ', toDelete)
        const values: T[] = await this.values

        const newValues: Array<T> = values.filter(invertFilter(this.filter(this.getId(toDelete))))

        if (newValues.length !== values.length) {
            this.values = newValues
            return true
        }

        return false
    }

    filter(id: string): Comparator<T> {
        return (val: T) => id === this.getId(val)
    }

    abstract getId(val: T): string;
    abstract setId(val: T): T;
}