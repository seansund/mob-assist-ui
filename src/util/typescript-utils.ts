
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const isEmpty = <T>(value: T[] | undefined): boolean => {
  return value === undefined || value.length === 0;
}
