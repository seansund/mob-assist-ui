
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isUndefinedOrEmpty(value: unknown): boolean {
  return value === undefined || (Array.isArray(value) && value.length === 0);
}

export function isUndefinedOrNull(value: unknown): boolean {
  return value === undefined || value === null;
}

export function isDefined(value: unknown): boolean {
  return value !== undefined;
}

export function isDefinedAndNotNull(value: unknown): boolean {
  return value !== undefined && value !== null;
}

export function omit<T, U extends keyof T>(value: T, field: U): Omit<T, U> {
  const c: T = Object.assign({}, value);

  delete c[field];

  return c;
}

export const reverse = <T> (sorter: (a: T, b: T) => number) => {
  return (a: T, b: T): number => sorter(b, a)
}
