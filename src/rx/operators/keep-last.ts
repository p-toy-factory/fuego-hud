import { OperatorFunction, scan } from "rxjs";

export function keepLast<T>(
  count: number,
  seed?: T[]
): OperatorFunction<T, T[]> {
  return (source) =>
    source.pipe(
      scan<T, T[]>((acc, value) => {
        if (acc.length >= count) {
          acc.shift();
        }
        acc.push(value);
        return acc;
      }, seed?.slice() ?? [])
    );
}
