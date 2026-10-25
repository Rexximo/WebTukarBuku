export type SearchParamsPromise = Promise<
  Record<string, string | string[] | undefined>
>;

export function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export function firstNumber(
  value: string | string[] | undefined,
  fallback = 1
): number {
  const parsed = Number(first(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
