
export const uniqueList = <T> (arr: T[]): T[] => {
    return arr.reduce((partialResult: T[], current: T) => {
        if (!partialResult.includes(current)) {
            partialResult.push(current);
        }

        return partialResult;
    }, []);
}
