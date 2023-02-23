
export type Comparator<T> = (val: T) => boolean

export const invertFilter = <T>(fn: Comparator<T>): Comparator<T> => {
    return (val: T): boolean => {
        return !fn(val)
    }
}
