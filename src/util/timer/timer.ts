
export const timer = async <T>(time: number, fn?: () => T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (fn) resolve(fn())

            resolve(undefined as unknown as T)
        }, time)
    })
}
