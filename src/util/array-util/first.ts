import {OptionalValue} from '../optional'

export const first = <T>(arr: T[] = []): OptionalValue<T> => {
  if (arr.length === 0) {
    return OptionalValue.empty()
  }

  return OptionalValue.ofNullable(arr[0])
}

export const last = <T>(arr: T[] = []): OptionalValue<T> => {
  if (arr.length === 0) {
    return OptionalValue.empty()
  }

  return OptionalValue.ofNullable(arr[arr.length - 1])
}
