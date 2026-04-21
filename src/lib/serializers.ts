export function serializeBigInts<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_, innerValue: unknown) =>
      typeof innerValue === "bigint" ? innerValue.toString() : innerValue
    )
  ) as T;
}
