import {isDefinedAndNotNull} from '../object-util';

export class NoSuchElement extends Error {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultType = any;

export class OptionalValue<T = DefaultType> {
  private constructor(public readonly value: T | undefined) {
  }

  static of<T = DefaultType>(value?: T): OptionalValue<T> {
    return new OptionalValue(value as T);
  }

  static ofNullable<T = DefaultType>(value?: T): OptionalValue<T> {
    return new OptionalValue(value as T);
  }

  static empty<T = DefaultType>(): OptionalValue<T> {
    return new OptionalValue<T>(undefined);
  }

  isPresent(): boolean {
    return this.value !== undefined && this.value !== null;
  }

  ifPresent(f: (value: T) => void): OptionalValue<T> {
    if (this.value !== undefined && this.value !== null) {
      f(this.value);
    }

    return this;
  }

  ifNotPresent(f: () => void): OptionalValue<T> {
    if (this.value === undefined || this.value === null) {
      f();
    }

    return this;
  }

  get(): T {
    if (this.value === undefined || this.value === null) {
      throw new NoSuchElement('The element does not exist');
    }

    return this.value;
  }

  orElse(defaultValue: T): T {
    if (this.value === undefined || this.value === null) {
      return defaultValue;
    }

    return this.value;
  }

  orElseThrow(err: Error): T {
    if (this.value === undefined || this.value === null) {
      throw err;
    }

    return this.value;
  }

  orElseGet(f: () => T): T {
    if (this.value === undefined || this.value === null) {
      return f();
    }

    return this.value;
  }

  map<U>(f: (value: T) => U): OptionalValue<U> {
    if (this.value !== undefined && this.value !== null) {
      return OptionalValue.of(f(this.value));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this as any;
    }
  }

  mapIfNotPresent(f: () => T): OptionalValue<T> {
    if (isDefinedAndNotNull(this.value)) {
      return this;
    }

    return OptionalValue.of(f());
  }
}

export function of<T = DefaultType>(value?: T): OptionalValue<T> {
  return OptionalValue.of<T>(value);
}

export function empty<T = DefaultType>(): OptionalValue<T> {
  return OptionalValue.empty<T>();
}
